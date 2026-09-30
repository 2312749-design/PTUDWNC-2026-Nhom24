using System.Security.Claims;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Controllers;

[Route("api/features")]
[ApiController]
[Authorize]
public class RecipeFeaturesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public RecipeFeaturesController(ApplicationDbContext context) => _context = context;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("bookmarks")]
    public async Task<IActionResult> Bookmarks()
    {
        var items = await _context.RecipeBookmarks.Where(bookmark => bookmark.UserId == UserId)
            .OrderByDescending(bookmark => bookmark.CreatedAt)
            .Select(bookmark => new
            {
                recipe = new { bookmark.Recipe.Id, bookmark.Recipe.Title, bookmark.Recipe.Description, bookmark.Recipe.CookingTimeMinutes, bookmark.Recipe.Difficulty, bookmark.Recipe.IsVegetarian, categoryName = bookmark.Recipe.Category.Name },
                savedAt = bookmark.CreatedAt,
                collections = _context.RecipeCollectionItems.Where(item => item.RecipeId == bookmark.RecipeId && item.Collection.OwnerId == UserId).Select(item => item.Collection.Name).ToList()
            }).ToListAsync();
        return Ok(items);
    }

    [HttpPost("recipes/{recipeId:guid}/bookmark")]
    public async Task<IActionResult> SaveRecipe(Guid recipeId)
    {
        if (!await _context.Recipes.AnyAsync(recipe => recipe.Id == recipeId)) return NotFound();
        if (!await _context.RecipeBookmarks.AnyAsync(item => item.RecipeId == recipeId && item.UserId == UserId))
        {
            _context.RecipeBookmarks.Add(new RecipeBookmark { RecipeId = recipeId, UserId = UserId });
            await _context.SaveChangesAsync();
        }
        return Ok(new { saved = true });
    }

    [HttpDelete("recipes/{recipeId:guid}/bookmark")]
    public async Task<IActionResult> UnsaveRecipe(Guid recipeId)
    {
        var bookmark = await _context.RecipeBookmarks.FindAsync(recipeId, UserId);
        if (bookmark != null)
        {
            _context.RecipeBookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();
        }
        return NoContent();
    }

    [HttpGet("collections")]
    public async Task<IActionResult> Collections()
    {
        var items = await _context.RecipeCollections.Where(collection => collection.OwnerId == UserId)
            .OrderBy(collection => collection.Name)
            .Select(collection => new
            {
                collection.Id,
                collection.Name,
                createdAt = collection.CreatedAt,
                count = collection.Items.Count,
                recipes = collection.Items.OrderBy(item => item.AddedAt).Select(item => new { item.Recipe.Id, item.Recipe.Title, item.Recipe.Category.Name }).ToList()
            }).ToListAsync();
        return Ok(items);
    }

    [HttpPost("collections")]
    public async Task<IActionResult> CreateCollection(CollectionRequest request)
    {
        var name = (request.Name ?? string.Empty).Trim();
        if (name.Length is < 2 or > 80) return BadRequest(new { message = "Tên bộ sưu tập cần có từ 2 đến 80 ký tự." });
        if (await _context.RecipeCollections.AnyAsync(collection => collection.OwnerId == UserId && collection.Name == name))
            return Conflict(new { message = "Bạn đã có bộ sưu tập cùng tên." });
        var collection = new RecipeCollection { OwnerId = UserId, Name = name };
        _context.RecipeCollections.Add(collection);
        await _context.SaveChangesAsync();
        return Ok(new { collection.Id, collection.Name, count = 0 });
    }

    [HttpDelete("collections/{id:guid}")]
    public async Task<IActionResult> DeleteCollection(Guid id)
    {
        var collection = await _context.RecipeCollections.FirstOrDefaultAsync(item => item.Id == id && item.OwnerId == UserId);
        if (collection == null) return NotFound();
        _context.RecipeCollections.Remove(collection);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("collections/{id:guid}/recipes/{recipeId:guid}")]
    public async Task<IActionResult> AddToCollection(Guid id, Guid recipeId)
    {
        if (!await _context.RecipeCollections.AnyAsync(collection => collection.Id == id && collection.OwnerId == UserId)) return NotFound();
        if (!await _context.Recipes.AnyAsync(recipe => recipe.Id == recipeId)) return NotFound();
        if (!await _context.RecipeCollectionItems.AnyAsync(item => item.CollectionId == id && item.RecipeId == recipeId))
        {
            _context.RecipeCollectionItems.Add(new RecipeCollectionItem { CollectionId = id, RecipeId = recipeId });
            if (!await _context.RecipeBookmarks.AnyAsync(item => item.UserId == UserId && item.RecipeId == recipeId))
                _context.RecipeBookmarks.Add(new RecipeBookmark { UserId = UserId, RecipeId = recipeId });
            await _context.SaveChangesAsync();
        }
        return Ok(new { added = true });
    }

    [HttpDelete("collections/{id:guid}/recipes/{recipeId:guid}")]
    public async Task<IActionResult> RemoveFromCollection(Guid id, Guid recipeId)
    {
        var item = await _context.RecipeCollectionItems.FirstOrDefaultAsync(entry => entry.CollectionId == id && entry.RecipeId == recipeId && entry.Collection.OwnerId == UserId);
        if (item != null)
        {
            _context.RecipeCollectionItems.Remove(item);
            await _context.SaveChangesAsync();
        }
        return NoContent();
    }

    [HttpGet("recipes/{recipeId:guid}/reviews")]
    [AllowAnonymous]
    public async Task<IActionResult> Reviews(Guid recipeId)
    {
        var reviews = await _context.RecipeReviews.Where(review => review.RecipeId == recipeId).OrderByDescending(review => review.CreatedAt)
            .Select(review => new { review.Id, review.Rating, review.Content, review.IsCooked, review.CreatedAt, username = review.User.UserName, fullName = review.User.FullName, avatarUrl = review.User.AvatarUrl })
            .ToListAsync();
        return Ok(new { averageRating = reviews.Count == 0 ? 0 : reviews.Average(review => review.Rating), count = reviews.Count, items = reviews });
    }

    [HttpPost("recipes/{recipeId:guid}/reviews")]
    public async Task<IActionResult> SaveReview(Guid recipeId, ReviewRequest request)
    {
        if (request.Rating is < 1 or > 5) return BadRequest(new { message = "Đánh giá cần từ 1 đến 5 sao." });
        if (request.Content?.Length > 1200) return BadRequest(new { message = "Nhận xét tối đa 1200 ký tự." });
        if (!await _context.Recipes.AnyAsync(recipe => recipe.Id == recipeId)) return NotFound();
        var review = await _context.RecipeReviews.FirstOrDefaultAsync(item => item.RecipeId == recipeId && item.UserId == UserId);
        if (review == null)
        {
            review = new RecipeReview { RecipeId = recipeId, UserId = UserId };
            _context.RecipeReviews.Add(review);
        }
        review.Rating = request.Rating;
        review.Content = (request.Content ?? string.Empty).Trim();
        review.IsCooked = request.IsCooked;
        review.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(new { review.Id, review.Rating, review.Content, review.IsCooked, review.UpdatedAt });
    }

    [HttpGet("meal-plan")]
    public async Task<IActionResult> MealPlan([FromQuery] DateOnly? weekStart = null)
    {
        var monday = NormalizeWeekStart(weekStart);
        var sunday = monday.AddDays(7);
        var entries = await _context.MealPlanEntries.Where(entry => entry.UserId == UserId && entry.PlannedFor >= monday && entry.PlannedFor < sunday)
            .OrderBy(entry => entry.PlannedFor).ThenBy(entry => entry.MealType)
            .Select(entry => new { entry.Id, entry.PlannedFor, entry.MealType, entry.Servings, recipeId = entry.RecipeId, title = entry.Recipe.Title })
            .ToListAsync();
        return Ok(new { weekStart = monday, entries });
    }

    [HttpPost("meal-plan")]
    public async Task<IActionResult> AddMealPlan(MealPlanRequest request)
    {
        if (request.Servings is < 1 or > 30) return BadRequest(new { message = "Số khẩu phần cần từ 1 đến 30." });
        if (!await _context.Recipes.AnyAsync(recipe => recipe.Id == request.RecipeId)) return NotFound(new { message = "Không tìm thấy công thức." });
        var mealType = (request.MealType ?? "Bữa tối").Trim();
        if (mealType.Length > 30) return BadRequest(new { message = "Tên bữa ăn quá dài." });
        var entry = new MealPlanEntry { UserId = UserId, RecipeId = request.RecipeId, PlannedFor = request.PlannedFor, MealType = mealType, Servings = request.Servings };
        _context.MealPlanEntries.Add(entry);
        await _context.SaveChangesAsync();
        return Ok(new { entry.Id, entry.PlannedFor, entry.MealType, entry.Servings });
    }

    [HttpDelete("meal-plan/{id:guid}")]
    public async Task<IActionResult> RemoveMealPlan(Guid id)
    {
        var entry = await _context.MealPlanEntries.FirstOrDefaultAsync(item => item.Id == id && item.UserId == UserId);
        if (entry == null) return NotFound();
        _context.MealPlanEntries.Remove(entry);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("meal-plan/shopping-list")]
    public async Task<IActionResult> ShoppingList([FromQuery] DateOnly? weekStart = null)
    {
        var monday = NormalizeWeekStart(weekStart);
        var entries = await _context.MealPlanEntries.Include(entry => entry.Recipe)
            .Where(entry => entry.UserId == UserId && entry.PlannedFor >= monday && entry.PlannedFor < monday.AddDays(7))
            .ToListAsync();
        var ingredients = entries.SelectMany(entry => entry.Recipe.Ingredients)
            .Select(value => value.Trim()).Where(value => value.Length > 0)
            .GroupBy(value => value, StringComparer.OrdinalIgnoreCase)
            .Select(group => new { key = group.Key.ToUpperInvariant(), ingredient = group.Key, recipesCount = group.Count() }).ToList();
        var checkedKeys = await _context.GroceryChecks.Where(check => check.UserId == UserId && check.WeekStart == monday && check.IsChecked)
            .Select(check => check.IngredientKey).ToListAsync();
        return Ok(new { weekStart = monday, items = ingredients.Select(item => new { item.key, item.ingredient, item.recipesCount, isChecked = checkedKeys.Contains(item.key) }) });
    }

    [HttpPut("meal-plan/shopping-list")]
    public async Task<IActionResult> SetGroceryCheck(GroceryCheckRequest request)
    {
        var monday = NormalizeWeekStart(request.WeekStart);
        var ingredient = (request.Ingredient ?? string.Empty).Trim();
        if (ingredient.Length == 0 || ingredient.Length > 300) return BadRequest(new { message = "Nguyên liệu không hợp lệ." });
        var key = ingredient.ToUpperInvariant();
        var check = await _context.GroceryChecks.FindAsync(UserId, monday, key);
        if (check == null)
        {
            check = new GroceryCheck { UserId = UserId, WeekStart = monday, IngredientKey = key, Ingredient = ingredient, IsChecked = request.IsChecked };
            _context.GroceryChecks.Add(check);
        }
        else check.IsChecked = request.IsChecked;
        await _context.SaveChangesAsync();
        return Ok(new { check.Ingredient, check.IsChecked });
    }

    [HttpGet("notifications")]
    public async Task<IActionResult> Notifications()
    {
        var items = await _context.AppNotifications.Where(item => item.UserId == UserId).OrderByDescending(item => item.CreatedAt).Take(50)
            .Select(item => new { item.Id, item.Type, item.Message, item.TargetUrl, item.CreatedAt, item.ReadAt, actor = new { username = item.Actor.UserName, fullName = item.Actor.FullName, avatarUrl = item.Actor.AvatarUrl } })
            .ToListAsync();
        return Ok(new { unreadCount = items.Count(item => item.ReadAt == null), items });
    }

    [HttpPut("notifications/read-all")]
    public async Task<IActionResult> ReadAllNotifications()
    {
        await _context.AppNotifications.Where(item => item.UserId == UserId && item.ReadAt == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.ReadAt, DateTime.UtcNow));
        return NoContent();
    }

    [HttpPut("notifications/{id:guid}/read")]
    public async Task<IActionResult> ReadNotification(Guid id)
    {
        await _context.AppNotifications.Where(item => item.Id == id && item.UserId == UserId && item.ReadAt == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.ReadAt, DateTime.UtcNow));
        return NoContent();
    }

    [HttpGet("challenges")]
    [AllowAnonymous]
    public async Task<IActionResult> Challenges()
    {
        var now = DateTime.UtcNow;
        var monday = NormalizeWeekStart(null);
        var startsAt = monday.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var challenge = await _context.CookingChallenges.FirstOrDefaultAsync(item => item.StartsAt == startsAt);
        if (challenge == null)
        {
            challenge = new CookingChallenge { Title = "Thử thách tuần Bếp Nhà", Theme = "Nấu một món ngon từ nguyên liệu theo mùa.", StartsAt = startsAt, EndsAt = startsAt.AddDays(7) };
            _context.CookingChallenges.Add(challenge);
            await _context.SaveChangesAsync();
        }
        var viewerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var items = await _context.CookingChallenges.Where(item => item.EndsAt >= now).OrderBy(item => item.StartsAt)
            .Select(item => new { item.Id, item.Title, item.Theme, item.StartsAt, item.EndsAt, entriesCount = item.Submissions.Count(), enteredByMe = viewerId != null && item.Submissions.Any(submission => submission.UserId == viewerId) })
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost("challenges/{id:guid}/submit")]
    public async Task<IActionResult> SubmitChallenge(Guid id, ChallengeEntryRequest request)
    {
        var challenge = await _context.CookingChallenges.FirstOrDefaultAsync(item => item.Id == id && item.StartsAt <= DateTime.UtcNow && item.EndsAt > DateTime.UtcNow);
        if (challenge == null) return NotFound(new { message = "Thử thách không còn mở." });
        var recipe = await _context.Recipes.FirstOrDefaultAsync(item => item.Id == request.RecipeId && item.AuthorId == UserId);
        if (recipe == null) return BadRequest(new { message = "Chỉ có thể gửi công thức do bạn tạo." });
        if (!await _context.ChallengeSubmissions.AnyAsync(item => item.ChallengeId == id && item.UserId == UserId && item.RecipeId == recipe.Id))
        {
            _context.ChallengeSubmissions.Add(new ChallengeSubmission { ChallengeId = id, UserId = UserId, RecipeId = recipe.Id });
            var badgeCode = $"challenge-{id:N}";
            if (!await _context.UserBadges.AnyAsync(badge => badge.UserId == UserId && badge.Code == badgeCode))
                _context.UserBadges.Add(new UserBadge { UserId = UserId, Code = badgeCode, Name = challenge.Title });
            await _context.SaveChangesAsync();
        }
        return Ok(new { submitted = true });
    }

    [HttpGet("creator/stats")]
    public async Task<IActionResult> CreatorStats()
    {
        var recipeCount = await _context.Recipes.CountAsync(recipe => recipe.AuthorId == UserId);
        var postCount = await _context.CommunityPosts.CountAsync(post => post.AuthorId == UserId && !post.IsDraft);
        var recipeViews = await _context.RecipeViews.CountAsync(view => view.Recipe.AuthorId == UserId);
        var savedCount = await _context.RecipeBookmarks.CountAsync(bookmark => bookmark.Recipe.AuthorId == UserId);
        var receivedLikes = await _context.PostLikes.CountAsync(like => like.Post.AuthorId == UserId);
        var receivedComments = await _context.PostComments.CountAsync(comment => comment.Post.AuthorId == UserId);
        return Ok(new { recipeCount, postCount, recipeViews, savedCount, receivedLikes, receivedComments });
    }

    private static DateOnly NormalizeWeekStart(DateOnly? weekStart)
    {
        var date = weekStart ?? DateOnly.FromDateTime(DateTime.UtcNow);
        return date.AddDays(-(((int)date.DayOfWeek + 6) % 7));
    }

    public sealed class CollectionRequest { public string Name { get; set; } = string.Empty; }
    public sealed class ReviewRequest { public int Rating { get; set; } public string? Content { get; set; } public bool IsCooked { get; set; } }
    public sealed class MealPlanRequest { public Guid RecipeId { get; set; } public DateOnly PlannedFor { get; set; } public string MealType { get; set; } = "Bữa tối"; public int Servings { get; set; } = 2; }
    public sealed class GroceryCheckRequest { public DateOnly WeekStart { get; set; } public string Ingredient { get; set; } = string.Empty; public bool IsChecked { get; set; } }
    public sealed class ChallengeEntryRequest { public Guid RecipeId { get; set; } }
}