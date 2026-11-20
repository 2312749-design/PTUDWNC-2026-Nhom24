using CulinaryBlog.Application.CQRS.Recipes.Commands;
using CulinaryBlog.Application.CQRS.Recipes.Queries;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.API.Authorization;
using Hangfire;
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
        private readonly IBackgroundJobClient? _backgroundJobs;
        private readonly IAuthorizationService? _authorizationService;

        public RecipesHandlers(IMediator mediator, ApplicationDbContext context, ICacheService cache)
            : this(mediator, context, cache, null, null, null)
        {
        }

        public RecipesHandlers(IMediator mediator, ApplicationDbContext context, ICacheService cache,
            IFileStorageService? fileStorageService, IBackgroundJobClient? backgroundJobs = null,
            IAuthorizationService? authorizationService = null)
        {
            _mediator = mediator;
            _context = context;
            _cache = cache;
            _fileStorageService = fileStorageService;
            _backgroundJobs = backgroundJobs;
            _authorizationService = authorizationService;
        }

        // 1. Lấy danh sách tất cả Recipe thông qua MediatR CQRS Query
        public async Task<ApiResponseResult> GetAllRecipes()
        {
            var result = await _mediator.Send(new GetRecipesQuery());
            return Ok(result);
        }
        public async Task<ApiResponseResult> GetRecipeById(Guid id)
        {
            var usePublicCache = User.Identity?.IsAuthenticated != true;
            if (usePublicCache)
            {
                var cached = await _cache.GetAsync<RecipeDto>(CacheKeys.Recipe(id));
                if (cached?.Status == RecipeStatus.Published && cached.CreatedAt != default) return RecipeResponse(cached);
            }

            var recipe = await _context.Recipes
                .Include(r => r.Category)
                .Include(r => r.Author)
                .Include(r => r.StructuredIngredients)
                .Include(r => r.StructuredSteps)
                .AsSplitQuery()
                .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

            if (recipe == null || !await IsAuthorizedAsync(recipe, RecipeOperations.Read)) return NotFound(new { message = "Không tìm thấy công thức nấu ăn." });

            var result = await MapRecipeAsync(recipe);
            if (usePublicCache && recipe.Status == RecipeStatus.Published)
            {
                await _cache.SetAsync(CacheKeys.Recipe(id), result, TimeSpan.FromMinutes(5));
            }
            return RecipeResponse(result);
        }
        public async Task<ApiResponseResult> GetRecipeBySlug(string slug)
        {
            var recipe = await _context.Recipes
                .Include(item => item.Category)
                .Include(item => item.Author)
                .Include(item => item.StructuredIngredients)
                .Include(item => item.StructuredSteps)
                .AsSplitQuery()
                .FirstOrDefaultAsync(item => item.Slug == slug && !item.IsDeleted);
            if (recipe == null || !await IsAuthorizedAsync(recipe, RecipeOperations.Read)) return NotFound(new { message = "Không tìm thấy công thức nấu ăn." });
            return RecipeResponse(await MapRecipeAsync(recipe));
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
                .Where(recipe => !recipe.IsDeleted && recipe.Status == RecipeStatus.Published && !recipe.Category.IsDeleted && recipe.Category.IsVisible)
                .OrderBy(recipe => recipe.Id)
                .Select(recipe => new { recipe.Slug, recipe.UpdatedAt })
                .ToListAsync();
            return Ok(recipes);
        }
        public async Task<ApiResponseResult> RecordView(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            if (!await _context.Recipes.AnyAsync(recipe => recipe.Id == id && !recipe.IsDeleted)) return NotFound();
            // A detail page can record the same view from two client effects at
            // nearly the same time. Use one database upsert so the composite
            // key (RecipeId, UserId) can never race into a duplicate insert.
            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                INSERT INTO ""RecipeViews"" (""RecipeId"", ""UserId"", ""ViewedAt"")
                VALUES ({id}, {userId}, {DateTime.UtcNow})
                ON CONFLICT (""RecipeId"", ""UserId"")
                DO UPDATE SET ""ViewedAt"" = EXCLUDED.""ViewedAt"";");
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
                PrepTimeMinutes = dto.PrepTimeMinutes ?? -1,
                CookTimeMinutes = dto.CookTimeMinutes ?? -1,
                Servings = dto.Servings ?? -1,
                Difficulty = dto.Difficulty,
                IsVegetarian = dto.IsVegetarian,
                Nutrition = dto.Nutrition
            };

            var result = await _mediator.Send(command);
            AddActivity(userId, "recipe.created", $"Tạo công thức: {result.Title}.");
            await _context.SaveChangesAsync();
            return Created($"/api/v1/recipes/{result.Id}", result);
        }

        // 3. Cập nhật Recipe (Chỉ tác giả tạo ra mới có quyền sửa)
        public async Task<ApiResponseResult> UpdateRecipe(Guid id, [FromBody] UpdateRecipeDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });

            RecipeNutritionDto? nutrition = null;
            if (dto.Nutrition.ValueKind == JsonValueKind.Object)
                nutrition = JsonSerializer.Deserialize<RecipeNutritionDto>(dto.Nutrition.GetRawText(), new JsonSerializerOptions(JsonSerializerDefaults.Web));
            else if (dto.Nutrition.ValueKind is not (JsonValueKind.Undefined or JsonValueKind.Null))
                throw new CulinaryBlog.Domain.Exceptions.ValidationException("Nutrition phải là object hoặc null.");

            var result = await _mediator.Send(new UpdateRecipeCommand
            {
                Id = id,
                CurrentUserId = userId,
                IsAdmin = User.IsInRole("Admin"),
                ExpectedUpdatedAt = RequestedRecipeVersion(),
                Title = dto.Title,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                Ingredients = dto.Ingredients,
                Instructions = dto.Instructions,
                RecipeIngredients = dto.RecipeIngredients,
                RecipeSteps = dto.RecipeSteps,
                CategoryId = dto.CategoryId,
                PrepTimeMinutes = dto.PrepTimeMinutes,
                CookTimeMinutes = dto.CookTimeMinutes,
                Servings = dto.Servings,
                Difficulty = dto.Difficulty,
                IsVegetarian = dto.IsVegetarian,
                NutritionSpecified = dto.Nutrition.ValueKind != JsonValueKind.Undefined,
                Nutrition = nutrition
            });
            AddActivity(userId, "recipe.updated", $"Cập nhật công thức: {result.Title}.");
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật công thức nấu ăn thành công!", data = result, result.UpdatedAt });
        }
        public async Task<ApiResponseResult> PatchRecipe(Guid id, [FromBody] PatchRecipeDto dto)
        {
            var authorization = await GetManageableRecipeAsync(id, RecipeOperations.Update);
            if (authorization.Recipe == null) return NotFound(new { message = "Không tìm thấy công thức." });
            if (!authorization.CanManage) return Forbid();
            var recipe = authorization.Recipe!;
            if (!MatchesRecipeVersion(recipe)) return RecipeVersionConflict();
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
            return await ChangeStatusAsync(id, RecipeStatusTransition.Publish);
        }
        public Task<ApiResponseResult> UnpublishRecipe(Guid id) => ChangeStatusAsync(id, RecipeStatusTransition.Unpublish);
        public Task<ApiResponseResult> ArchiveRecipe(Guid id) => ChangeStatusAsync(id, RecipeStatusTransition.Archive);
        public Task<ApiResponseResult> RestoreRecipe(Guid id) => ChangeStatusAsync(id, RecipeStatusTransition.Restore);

        public async Task<ApiResponseResult> SubmitForReview(Guid id)
        {
            var authorization = await GetManageableRecipeAsync(id, RecipeOperations.Publish);
            if (authorization.Recipe is null) return NotFound(new { message = "Không tìm thấy công thức." });
            if (!authorization.CanManage) return Forbid();
            var recipe = authorization.Recipe;
            recipe.RequestReview();
            await _context.SaveChangesAsync();
            await InvalidateCachesAsync(id);
            return Ok(new { message = "Đã gửi công thức tới hàng chờ duyệt.", data = new { recipe.Id, recipe.ReviewStatus, recipe.ReviewRequestedAt } });
        }

        public async Task<ApiResponseResult> UploadRecipeImage(Guid id, IFormFile file, string? altText = null, bool? primary = null)
        {
            await using var buffer = new MemoryStream();
            await file.CopyToAsync(buffer);
            var metadata = await _mediator.Send(new UploadRecipeImageCommand(
                id, CurrentUserId(), User.IsInRole("Admin"), buffer.ToArray(), altText, primary));
            return Created($"/api/v1/recipes/{id}/images/{metadata.Id}", new
            {
                id = metadata.Id,
                url = metadata.Url,
                imageId = metadata.Id,
                originalUrl = metadata.Url,
                metadata.AltText,
                metadata.OrderIndex,
                thumbnailUrl = metadata.ThumbnailUrl,
                mediumUrl = metadata.MediumUrl,
                isPrimary = metadata.IsPrimary
            });
        }

        public Task<ApiResponseResult> SetPrimaryRecipeImage(Guid id, Guid imageId) =>
            UpdateRecipeImage(id, imageId, new RecipeImageMetadata(null, true, null));

        public async Task<ApiResponseResult> UpdateRecipeImage(Guid id, Guid imageId, RecipeImageMetadata request)
        {
            var selected = await _mediator.Send(new UpdateRecipeImageCommand(
                id, imageId, CurrentUserId(), User.IsInRole("Admin"), request.AltText, request.IsPrimary, request.OrderIndex));
            return Ok(new { id = selected.Id, selected.IsPrimary, imageUrl = selected.Url, selected.AltText, selected.OrderIndex });
        }

        public async Task<ApiResponseResult> DeleteRecipeImage(Guid id, Guid imageId)
        {
            await _mediator.Send(new DeleteRecipeImageCommand(id, imageId, CurrentUserId(), User.IsInRole("Admin")));
            return NoContent();
        }

        private string CurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Phiên đăng nhập không hợp lệ.");

        // 4. Xóa Recipe (Chỉ tác giả mới có quyền xóa)
        public Task<ApiResponseResult> DeleteRecipe(Guid id) => ChangeStatusAsync(id, RecipeStatusTransition.Delete);

        private async Task InvalidateCachesAsync(Guid recipeId, CancellationToken cancellationToken = default)
        {
            await _cache.RemoveAsync(CacheKeys.Recipes, cancellationToken);
            await _cache.RemoveAsync(CacheKeys.Recipe(recipeId), cancellationToken);
        }

        private void AddActivity(string userId, string activityType, string description)
        {
            _context.UserActivityLogs.Add(new UserActivityLog
            {
                UserId = userId,
                ActivityType = activityType,
                Description = description,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = HttpContext.Request.Headers.UserAgent.ToString()[..Math.Min(HttpContext.Request.Headers.UserAgent.ToString().Length, 512)]
            });
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

        private async Task<bool> IsAuthorizedAsync(Recipe recipe, RecipeOperationRequirement operation)
        {
            if (_authorizationService is null)
                return RecipeAuthorizationRules.IsAllowed(User, operation, recipe);

            return (await _authorizationService.AuthorizeAsync(User, recipe, operation)).Succeeded;
        }

        private async Task<(Recipe? Recipe, bool CanManage)> GetManageableRecipeAsync(
            Guid id, RecipeOperationRequirement operation)
        {
            var recipe = await _context.Recipes.FirstOrDefaultAsync(item => item.Id == id && !item.IsDeleted);
            if (recipe == null) return (null, false);
            return (recipe, await IsAuthorizedAsync(recipe, operation));
        }

        private async Task<ApiResponseResult> ChangeStatusAsync(Guid id, RecipeStatusTransition transition)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
            var result = await _mediator.Send(new ChangeRecipeStatusCommand(id, userId, User.IsInRole("Admin"), transition));
            if (result.Changed)
            {
                AddActivity(userId, $"recipe.{transition.ToString().ToLowerInvariant()}", $"Thay đổi trạng thái công thức {id}.");
                await _context.SaveChangesAsync();
            }
            return Ok(new { data = new { result.Id, status = result.Status, result.UpdatedAt }, result.Changed });
        }

        private ApiResponseResult RecipeResponse(RecipeDto recipe)
        {
            HttpContext.Response.Headers.ETag = $"\"{recipe.UpdatedAt:O}\"";
            return Ok(recipe);
        }

        private bool MatchesRecipeVersion(Recipe recipe)
        {
            if (!HttpContext.Request.Headers.TryGetValue("If-Match", out var expected)) return true;
            var value = expected.ToString();
            return value.Length > 2 && value[0] == '"' && value[^1] == '"' &&
                DateTimeOffset.TryParse(value[1..^1], System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.AssumeUniversal, out var version) &&
                version.UtcTicks / 10 == recipe.UpdatedAt.Ticks / 10;
        }

        private DateTime? RequestedRecipeVersion()
        {
            if (!HttpContext.Request.Headers.TryGetValue("If-Match", out var expected)) return null;
            var value = expected.ToString();
            if (value.Length > 2 && value[0] == '"' && value[^1] == '"' &&
                DateTimeOffset.TryParse(value[1..^1], System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.AssumeUniversal, out var version))
                return version.UtcDateTime;
            throw new CulinaryBlog.Domain.Exceptions.ValidationException("If-Match không hợp lệ. Hãy tải lại công thức trước khi lưu.");
        }

        private static ApiResponseResult RecipeVersionConflict() =>
            new(412, new { message = "Công thức đã được cập nhật ở nơi khác. Hãy tải lại trước khi lưu." });

        private async Task<RecipeDto> MapRecipeAsync(Recipe recipe)
        {
            var ingredientNavigation = _context.Entry(recipe).Collection(item => item.StructuredIngredients);
            var stepNavigation = _context.Entry(recipe).Collection(item => item.StructuredSteps);
            if (!ingredientNavigation.IsLoaded) await ingredientNavigation.LoadAsync();
            if (!stepNavigation.IsLoaded) await stepNavigation.LoadAsync();

            var ingredients = recipe.StructuredIngredients
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
                }).ToList();
            var steps = recipe.StructuredSteps
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
                }).ToList();
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
                ReviewStatus = recipe.ReviewStatus,
                ReviewNote = recipe.ReviewNote,
                ReviewRequestedAt = recipe.ReviewRequestedAt,
                ReviewedAt = recipe.ReviewedAt,
                CreatedAt = recipe.CreatedAt,
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
