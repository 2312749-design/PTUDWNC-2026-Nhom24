using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.CQRS.Recipes.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace CulinaryBlog.API.Endpoints
{
    public class RecipesHandlers : EndpointHandler
    {
        private readonly IMediator _mediator;
        private readonly ApplicationDbContext _context;
        private readonly ICacheService _cache;
        private readonly IFileStorageService? _fileStorageService;

        public RecipesHandlers(IMediator mediator, ApplicationDbContext context, ICacheService cache)
            : this(mediator, context, cache, null)
        {
        }

        public RecipesHandlers(IMediator mediator, ApplicationDbContext context, ICacheService cache, IFileStorageService? fileStorageService)
        {
            _mediator = mediator;
            _context = context;
            _cache = cache;
            _fileStorageService = fileStorageService;
        }

        // 1. Lấy danh sách tất cả Recipe thông qua MediatR CQRS Query
        public async Task<ApiResponseResult> GetAllRecipes()
        {
            var result = await _mediator.Send(new GetRecipesQuery());
            return Ok(result);
        }
        public async Task<ApiResponseResult> GetRecipeById(Guid id)
        {
            var cached = await _cache.GetAsync<RecipeDto>(CacheKeys.Recipe(id));
            if (cached?.Status == RecipeStatus.Published) return Ok(cached);

            var recipe = await _context.Recipes
                .Include(r => r.Category)
                .Include(r => r.Author)
                .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

            if (recipe == null || !CanViewRecipe(recipe)) return NotFound(new { message = "Không tìm thấy công thức nấu ăn." });

            var result = await MapRecipeAsync(recipe);
            if (recipe.Status == RecipeStatus.Published)
            {
                await _cache.SetAsync(CacheKeys.Recipe(id), result, TimeSpan.FromMinutes(10));
            }
            return Ok(result);
        }
        public async Task<ApiResponseResult> GetRecipeBySlug(string slug)
        {
            var recipe = await _context.Recipes
                .Include(item => item.Category)
                .Include(item => item.Author)
                .FirstOrDefaultAsync(item => item.Slug == slug && !item.IsDeleted);
            if (recipe == null || !CanViewRecipe(recipe)) return NotFound(new { message = "Không tìm thấy công thức nấu ăn." });
            return Ok(await MapRecipeAsync(recipe));
        }
        public async Task<ApiResponseResult> GetMyRecipes()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();
            var query = _context.Recipes.Where(recipe => !recipe.IsDeleted);
            if (!User.IsInRole("Admin")) query = query.Where(recipe => recipe.AuthorId == userId);
            var recipes = await query.Include(recipe => recipe.Category).Include(recipe => recipe.Author)
                .OrderByDescending(recipe => recipe.UpdatedAt).ToListAsync();
            var result = new List<RecipeDto>(recipes.Count);
            foreach (var recipe in recipes) result.Add(await MapRecipeAsync(recipe));
            return Ok(result);
        }
        public async Task<ApiResponseResult> GetSitemapRecipes()
        {
            var recipes = await _context.Recipes.AsNoTracking()
                .Where(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published && !recipe.Category.IsDeleted)
                .OrderBy(recipe => recipe.Id)
                .Select(recipe => new { recipe.Slug, recipe.UpdatedAt })
                .ToListAsync();
            return Ok(recipes);
        }
        public async Task<ApiResponseResult> RecordView(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            if (!await _context.Recipes.AnyAsync(recipe => recipe.Id == id)) return NotFound();
            var view = await _context.RecipeViews.FindAsync(id, userId);
            if (view == null) _context.RecipeViews.Add(new CulinaryBlog.Domain.Entities.RecipeView { RecipeId = id, UserId = userId });
            else view.ViewedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(new { recorded = true });
        }

        // 2. Tạo mới Recipe thông qua MediatR Command (Đã chuyển đổi chuẩn CQRS)
        public async Task<ApiResponseResult> CreateRecipe([FromBody] CreateRecipeDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Không tìm thấy thông tin định danh người dùng từ Token!" });
            }

            var command = new CreateRecipeCommand
            {
                Title = dto.Title,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                Ingredients = dto.Ingredients,
                Instructions = dto.Instructions,
                RecipeIngredients = dto.RecipeIngredients,
                RecipeSteps = dto.RecipeSteps,
                CategoryId = dto.CategoryId,
                AuthorId = userId,
                PrepTimeMinutes = dto.PrepTimeMinutes!.Value,
                CookTimeMinutes = dto.CookTimeMinutes!.Value,
                Servings = dto.Servings!.Value,
                Difficulty = dto.Difficulty,
                IsVegetarian = dto.IsVegetarian,
                Nutrition = dto.Nutrition
            };

            try
            {
                var result = await _mediator.Send(command);
                return Created($"/api/v1/recipes/{result.Id}", result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 3. Cập nhật Recipe (Chỉ tác giả tạo ra mới có quyền sửa)
        public async Task<ApiResponseResult> UpdateRecipe(Guid id, [FromBody] UpdateRecipeDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
            }

            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null || recipe.IsDeleted)
            {
                return NotFound(new { message = "Không tìm thấy công thức nấu ăn cần sửa!" });
            }

            if (!User.IsInRole("Admin") && recipe.AuthorId != userId)
            {
                return Forbid();
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId && !c.IsDeleted);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Danh mục (CategoryId) không tồn tại!" });
            }

            recipe.Update(
                dto.Title,
                dto.Description,
                dto.Ingredients,
                dto.Instructions,
                dto.CategoryId,
                dto.ImageUrl,
                difficulty: dto.Difficulty,
                isVegetarian: dto.IsVegetarian,
                prepTimeMinutes: dto.PrepTimeMinutes,
                cookTimeMinutes: dto.CookTimeMinutes,
                servings: dto.Servings
            );
            var slugBase = Recipe.CreateSlug(dto.Title);
            var slug = slugBase;
            var suffix = 2;
            while (await _context.Recipes.AnyAsync(existing => existing.Id != id && existing.Slug == slug))
            {
                slug = $"{slugBase}-{suffix++}";
            }
            recipe.SetSlug(slug);

            if (dto.Nutrition.ValueKind != JsonValueKind.Undefined)
            {
                if (dto.Nutrition.ValueKind == JsonValueKind.Null)
                {
                    recipe.SetNutrition(null);
                }
                else if (dto.Nutrition.ValueKind == JsonValueKind.Object)
                {
                    var nutrition = JsonSerializer.Deserialize<RecipeNutritionDto>(dto.Nutrition.GetRawText(), new JsonSerializerOptions(JsonSerializerDefaults.Web));
                    recipe.SetNutrition(nutrition == null ? null : new RecipeNutrition(
                        nutrition.Calories, nutrition.Protein, nutrition.Carbohydrates,
                        nutrition.Fat, nutrition.Fiber, nutrition.Sodium));
                }
                else
                {
                    return BadRequest(new { message = "Nutrition phải là object hoặc null." });
                }
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();
            await _context.SaveChangesAsync();
            await ReplaceRecipeChildrenAsync(recipe.Id, dto.RecipeIngredients, dto.RecipeSteps, dto.Ingredients, dto.Instructions);
            await transaction.CommitAsync();
            await InvalidateCachesAsync(id);

            return Ok(new { message = "Cập nhật công thức nấu ăn thành công!" });
        }
        public async Task<ApiResponseResult> PatchRecipe(Guid id, [FromBody] PatchRecipeDto dto)
        {
            var authorization = await GetManageableRecipeAsync(id);
            if (authorization.Recipe == null) return NotFound(new { message = "Không tìm thấy công thức." });
            if (!authorization.CanManage) return Forbid();
            var recipe = authorization.Recipe!;
            if (dto.Nutrition.ValueKind == JsonValueKind.Undefined)
            {
                return Ok(new { changed = false });
            }

            if (dto.Nutrition.ValueKind == JsonValueKind.Null)
            {
                recipe.SetNutrition(null);
            }
            else if (dto.Nutrition.ValueKind == JsonValueKind.Object)
            {
                var nutrition = JsonSerializer.Deserialize<RecipeNutritionDto>(dto.Nutrition.GetRawText(), new JsonSerializerOptions(JsonSerializerDefaults.Web));
                recipe.SetNutrition(nutrition == null ? null : new RecipeNutrition(
                    nutrition.Calories, nutrition.Protein, nutrition.Carbohydrates,
                    nutrition.Fat, nutrition.Fiber, nutrition.Sodium));
            }
            else
            {
                return BadRequest(new { message = "Nutrition phải là object hoặc null." });
            }

            await _context.SaveChangesAsync();
            await InvalidateCachesAsync(id);
            return Ok(new { changed = true, data = await MapRecipeAsync(recipe) });
        }
        public async Task<ApiResponseResult> PublishRecipe(Guid id)
        {
            var authorization = await GetManageableRecipeAsync(id);
            if (authorization.Recipe == null) return NotFound(new { message = "Không tìm thấy công thức." });
            if (!authorization.CanManage) return Forbid();
            var recipe = authorization.Recipe!;
            if (await _context.Categories.AnyAsync(category => category.Id == recipe.CategoryId && category.IsDeleted))
            {
                throw new CulinaryBlog.Domain.Exceptions.ValidationException("Không thể xuất bản công thức thuộc danh mục đã xóa.");
            }

            var hasIngredient = await _context.RecipeIngredients.AnyAsync(item => item.RecipeId == id && item.Name.Trim() != "") ||
                recipe.Ingredients.Any(item => !string.IsNullOrWhiteSpace(item));
            var hasStep = await _context.RecipeSteps.AnyAsync(item => item.RecipeId == id && item.Description.Trim() != "") ||
                recipe.Instructions.Any(item => !string.IsNullOrWhiteSpace(item));
            var changed = recipe.Publish(hasIngredient, hasStep);
            if (changed)
            {
                await _context.SaveChangesAsync();
                await InvalidateCachesAsync(id);
            }
            return Ok(new { data = new { recipe.Id, status = recipe.Status }, changed });
        }
        public Task<ApiResponseResult> UnpublishRecipe(Guid id) => TransitionRecipeAsync(id, recipe => recipe.Unpublish());
        public Task<ApiResponseResult> ArchiveRecipe(Guid id) => TransitionRecipeAsync(id, recipe => recipe.Archive());
        public Task<ApiResponseResult> RestoreRecipe(Guid id) => TransitionRecipeAsync(id, recipe => recipe.RestoreToDraft());

        public async Task<ApiResponseResult> UploadRecipeImage(Guid id, IFormFile file)
        {
            if (_fileStorageService is null) return StatusCode(500, new { message = "Dịch vụ lưu trữ ảnh chưa được cấu hình." });
            var authorization = await GetManageableRecipeAsync(id);
            if (authorization.Recipe is null) return NotFound(new { message = "Không tìm thấy công thức." });
            if (!authorization.CanManage) return Forbid();

            var validation = await CulinaryBlog.Infrastructure.Services.ImageUploadValidationService.ValidateAsync(file);
            if (validation.Image is null) return BadRequest(new { message = validation.Error });
            var image = validation.Image;
            var prefix = $"recipes/{id:N}/{Guid.NewGuid():N}";

            await using var original = new MemoryStream(image.Content, writable: false);
            var originalUrl = await _fileStorageService.UploadAsync(original, $"{prefix}{image.Extension}", image.ContentType);
            await using var thumbnailSource = new MemoryStream(image.Content, writable: false);
            var thumbnail = await CulinaryBlog.Infrastructure.Services.ImageThumbnailService.CreateThumbnailAsync(thumbnailSource);
            await using var thumbnailStream = new MemoryStream(thumbnail, writable: false);
            var thumbnailUrl = await _fileStorageService.UploadThumbnailAsync(thumbnailStream, $"{prefix}-thumb.webp", "image/webp");
            await using var mediumSource = new MemoryStream(image.Content, writable: false);
            var medium = await CulinaryBlog.Infrastructure.Services.ImageThumbnailService.CreateMediumAsync(mediumSource);
            await using var mediumStream = new MemoryStream(medium, writable: false);
            var mediumUrl = await _fileStorageService.UploadThumbnailAsync(mediumStream, $"{prefix}-medium.webp", "image/webp");

            var recipe = authorization.Recipe;
            var isPrimary = !await _context.RecipeImages.AnyAsync(item => item.RecipeId == id);
            var metadata = new RecipeImage
            {
                RecipeId = id,
                Url = originalUrl,
                ThumbnailUrl = thumbnailUrl,
                MediumUrl = mediumUrl,
                IsPrimary = isPrimary
            };
            _context.RecipeImages.Add(metadata);
            if (isPrimary) recipe.SetImageUrl(originalUrl);
            await _context.SaveChangesAsync();
            await InvalidateCachesAsync(id);
            return Created($"/api/v1/recipes/{id}/images/{metadata.Id}", new
            {
                id = metadata.Id,
                url = metadata.Url,
                thumbnailUrl = metadata.ThumbnailUrl,
                mediumUrl = metadata.MediumUrl,
                isPrimary = metadata.IsPrimary
            });
        }

        public async Task<ApiResponseResult> SetPrimaryRecipeImage(Guid id, Guid imageId)
        {
            var authorization = await GetManageableRecipeAsync(id);
            if (authorization.Recipe is null) return NotFound(new { message = "Không tìm thấy công thức." });
            if (!authorization.CanManage) return Forbid();
            var images = await _context.RecipeImages.Where(item => item.RecipeId == id).ToListAsync();
            var selected = images.FirstOrDefault(item => item.Id == imageId);
            if (selected is null) return NotFound(new { message = "Không tìm thấy ảnh công thức." });

            foreach (var image in images) image.IsPrimary = image.Id == selected.Id;
            authorization.Recipe.SetImageUrl(selected.Url);
            await _context.SaveChangesAsync();
            await InvalidateCachesAsync(id);
            return Ok(new { id = selected.Id, isPrimary = true, imageUrl = selected.Url });
        }

        public async Task<ApiResponseResult> DeleteRecipeImage(Guid id, Guid imageId)
        {
            if (_fileStorageService is null) return StatusCode(500, new { message = "Dịch vụ lưu trữ ảnh chưa được cấu hình." });
            var authorization = await GetManageableRecipeAsync(id);
            if (authorization.Recipe is null) return NotFound(new { message = "Không tìm thấy công thức." });
            if (!authorization.CanManage) return Forbid();
            var image = await _context.RecipeImages.FirstOrDefaultAsync(item => item.RecipeId == id && item.Id == imageId);
            if (image is null) return NotFound(new { message = "Không tìm thấy ảnh công thức." });

            var urls = new[] { image.Url, image.ThumbnailUrl, image.MediumUrl };
            var wasPrimary = image.IsPrimary;
            _context.RecipeImages.Remove(image);
            if (wasPrimary)
            {
                var next = await _context.RecipeImages.Where(item => item.RecipeId == id && item.Id != imageId)
                    .OrderBy(item => item.CreatedAt).FirstOrDefaultAsync();
                if (next is null)
                {
                    authorization.Recipe.SetImageUrl(null);
                }
                else
                {
                    next.IsPrimary = true;
                    authorization.Recipe.SetImageUrl(next.Url);
                }
            }
            await _context.SaveChangesAsync();
            await InvalidateCachesAsync(id);
            foreach (var url in urls)
            {
                if (TryGetStorageKey(url, out var key)) await _fileStorageService.DeleteAsync(key);
            }
            return NoContent();
        }

        // 4. Xóa Recipe (Chỉ tác giả mới có quyền xóa)
        public async Task<ApiResponseResult> DeleteRecipe(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null || recipe.IsDeleted)
            {
                return NotFound(new { message = "Không tìm thấy công thức nấu ăn cần xóa!" });
            }

            if (!User.IsInRole("Admin") && recipe.AuthorId != userId)
            {
                return Forbid();
            }

            recipe.SoftDelete();
            await _context.SaveChangesAsync();
            await InvalidateCachesAsync(id);

            return Ok(new { message = "Xóa công thức nấu ăn thành công!" });
        }

        private async Task InvalidateCachesAsync(Guid recipeId, CancellationToken cancellationToken = default)
        {
            await _cache.RemoveAsync(CacheKeys.Recipes, cancellationToken);
            await _cache.RemoveAsync(CacheKeys.Recipe(recipeId), cancellationToken);
        }

        private static bool TryGetStorageKey(string url, out string key)
        {
            key = string.Empty;
            var path = Uri.TryCreate(url, UriKind.Absolute, out var uri) ? uri.AbsolutePath : url;
            var segments = path.Trim('/').Split('/', StringSplitOptions.RemoveEmptyEntries);
            if (segments.Length == 0) return false;
            key = segments[0].Equals("uploads", StringComparison.OrdinalIgnoreCase)
                ? string.Join('/', segments.Skip(1))
                : string.Join('/', segments.Skip(1));
            return key.StartsWith("recipes/", StringComparison.Ordinal);
        }

        private bool CanViewRecipe(Recipe recipe) =>
            (recipe.Status == RecipeStatus.Published && recipe.Category?.IsDeleted != true) ||
            User.IsInRole("Admin") || User.FindFirstValue(ClaimTypes.NameIdentifier) == recipe.AuthorId;

        private async Task<(Recipe? Recipe, bool CanManage)> GetManageableRecipeAsync(Guid id)
        {
            var recipe = await _context.Recipes.FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted);
            if (recipe == null) return (null, false);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return (recipe, User.IsInRole("Admin") || recipe.AuthorId == userId);
        }

        private async Task<ApiResponseResult> TransitionRecipeAsync(Guid id, Func<Recipe, bool> transition)
        {
            var authorization = await GetManageableRecipeAsync(id);
            if (authorization.Recipe == null) return NotFound(new { message = "Không tìm thấy công thức." });
            if (!authorization.CanManage) return Forbid();
            var recipe = authorization.Recipe!;
            var changed = transition(recipe);
            if (changed)
            {
                await _context.SaveChangesAsync();
                await InvalidateCachesAsync(id);
            }
            return Ok(new { data = new { recipe.Id, status = recipe.Status }, changed });
        }

        private async Task<RecipeDto> MapRecipeAsync(Recipe recipe)
        {
            var ingredients = await _context.RecipeIngredients.Where(item => item.RecipeId == recipe.Id)
                .OrderBy(item => item.OrderIndex)
                .Select(item => new RecipeIngredientDto
                {
                    Id = item.Id,
                    RecipeId = item.RecipeId,
                    Name = item.Name,
                    Quantity = item.Quantity,
                    Unit = item.Unit,
                    Notes = item.Notes,
                    OrderIndex = item.OrderIndex
                }).ToListAsync();
            var steps = await _context.RecipeSteps.Where(item => item.RecipeId == recipe.Id)
                .OrderBy(item => item.StepNumber)
                .Select(item => new RecipeStepDto
                {
                    Id = item.Id,
                    RecipeId = item.RecipeId,
                    Title = item.Title,
                    Description = item.Description,
                    StepNumber = item.StepNumber,
                    TimerMinutes = item.TimerMinutes,
                    ImageUrl = item.ImageUrl
                }).ToListAsync();
            return new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Slug = recipe.Slug,
                Description = recipe.Description,
                ImageUrl = recipe.ImageUrl,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                RecipeIngredients = ingredients,
                RecipeSteps = steps,
                CategoryId = recipe.CategoryId,
                CategoryName = recipe.Category?.Name ?? string.Empty,
                AuthorId = recipe.AuthorId,
                Status = recipe.Status,
                UpdatedAt = recipe.UpdatedAt,
                PrepTimeMinutes = recipe.PrepTimeMinutes,
                CookTimeMinutes = recipe.CookTimeMinutes,
                Servings = recipe.Servings,
                CookingTimeMinutes = recipe.CookingTimeMinutes,
                Difficulty = recipe.Difficulty,
                IsVegetarian = recipe.IsVegetarian,
                Nutrition = recipe.Nutrition == null ? null : new RecipeNutritionDto
                {
                    Calories = recipe.Nutrition.Calories,
                    Protein = recipe.Nutrition.Protein,
                    Carbohydrates = recipe.Nutrition.Carbohydrates,
                    Fat = recipe.Nutrition.Fat,
                    Fiber = recipe.Nutrition.Fiber,
                    Sodium = recipe.Nutrition.Sodium
                }
            };
        }

        private async Task ReplaceRecipeChildrenAsync(
            Guid recipeId,
            List<CreateRecipeIngredientDto>? ingredientDtos,
            List<CreateRecipeStepDto>? stepDtos,
            List<string> legacyIngredients,
            List<string> legacySteps)
        {
            var ingredientInputs = ingredientDtos ?? legacyIngredients
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .Select((value, index) => new CreateRecipeIngredientDto { Name = value, OrderIndex = index + 1 })
                .ToList();
            var stepInputs = stepDtos ?? legacySteps
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .Select(value => new CreateRecipeStepDto { Description = value })
                .ToList();

            var oldIngredients = await _context.RecipeIngredients.Where(item => item.RecipeId == recipeId).ToListAsync();
            var oldSteps = await _context.RecipeSteps.Where(item => item.RecipeId == recipeId).ToListAsync();
            _context.RecipeIngredients.RemoveRange(oldIngredients);
            _context.RecipeSteps.RemoveRange(oldSteps);
            await _context.SaveChangesAsync();

            var ingredients = ingredientInputs.Where(item => !string.IsNullOrWhiteSpace(item.Name))
                .Select((item, index) => RecipeIngredient.Create(recipeId, item.Name, item.Quantity, item.Unit, item.Notes, index + 1));
            var steps = stepInputs.Where(item => !string.IsNullOrWhiteSpace(item.Description))
                .Select((item, index) => RecipeStep.Create(recipeId, item.Title, item.Description, index + 1, item.TimerMinutes, item.ImageUrl));
            _context.RecipeIngredients.AddRange(ingredients);
            _context.RecipeSteps.AddRange(steps);
            await _context.SaveChangesAsync();
        }
    }
}
