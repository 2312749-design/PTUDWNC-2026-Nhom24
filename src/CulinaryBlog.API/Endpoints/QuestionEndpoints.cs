using System.Security.Claims;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Endpoints;

/// <summary>Persist kitchen questions as readable community posts so existing moderation and comments continue to apply.</summary>
public static class QuestionEndpoints
{
    private const string Marker = "#hoi-dap-bep-nha\nMón: ";

    public static void MapRecipeQuestions(this IEndpointRouteBuilder app)
    {
        var questions = app.MapGroup("/api/v1/features/questions").WithTags("Recipe questions");
        questions.MapGet("", ListQuestions).AllowAnonymous();
        questions.MapPost("", CreateQuestion).RequireAuthorization();
    }

    private static async Task<ApiResponseResult> ListQuestions(ApplicationDbContext db)
    {
        var posts = await db.CommunityPosts.AsNoTracking()
            .Where(post => !post.IsDraft && !post.IsHidden && post.Content.StartsWith(Marker))
            .OrderByDescending(post => post.CreatedAt).ThenByDescending(post => post.Id)
            .Take(100)
            .Select(post => new
            {
                post.Id, post.Content, post.CommentsEnabled,
                author = post.Author.FullName,
                username = post.Author.UserName,
                answers = post.Comments.OrderBy(comment => comment.CreatedAt).ThenBy(comment => comment.Id)
                    .Select(comment => new QuestionAnswer(comment.Id, comment.Author.FullName, comment.Content)).ToList()
            }).ToListAsync();

        // Parsing after materialization preserves the full original question,
        // including decimal numbers, punctuation and line breaks.
        var items = posts.Select(post =>
        {
            var content = post.Content[Marker.Length..];
            var separator = content.IndexOf('\n');
            var recipe = separator >= 0 ? content[..separator] : content;
            var question = separator >= 0 ? content[(separator + 1)..] : string.Empty;
            return Shape(post.Id, recipe, question, post.author, post.username, post.CommentsEnabled, post.answers);
        }).ToList();
        return new ApiResponseResult(200, new { items });
    }

    private static async Task<ApiResponseResult> CreateQuestion(RecipeQuestionRequest request, HttpContext context, ApplicationDbContext db)
    {
        var recipe = request.Recipe?.Trim() ?? string.Empty;
        var question = request.Question?.Trim() ?? string.Empty;
        if (recipe.Length is < 1 or > 200 || recipe.Contains('\r') || recipe.Contains('\n'))
            return new ApiResponseResult(400, new { message = "Tên món cần từ 1 đến 200 ký tự và nằm trên một dòng." });
        if (question.Length is < 1 or > 2000)
            return new ApiResponseResult(400, new { message = "Câu hỏi cần có nội dung từ 1 đến 2000 ký tự." });

        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await db.Users.AsNoTracking().Where(candidate => candidate.Id == userId)
            .Select(candidate => new { candidate.FullName, candidate.UserName }).FirstOrDefaultAsync();
        if (user is null) return new ApiResponseResult(401, new { message = "Vui lòng đăng nhập lại để gửi câu hỏi." });

        var post = new CommunityPost
        {
            AuthorId = userId!,
            Content = Marker + recipe + "\n" + question,
            CommentsEnabled = true
        };
        db.CommunityPosts.Add(post);
        await db.SaveChangesAsync();
        return new ApiResponseResult(201, Shape(post.Id, recipe, question, user.FullName, user.UserName, true, []));
    }

    private static object Shape(Guid id, string recipe, string text, string? author, string? username, bool commentsEnabled, List<QuestionAnswer> answers) => new
    {
        id, recipe, author = string.IsNullOrWhiteSpace(author) ? username : author,
        username, text, answer = answers.FirstOrDefault()?.Text,
        answeredBy = answers.FirstOrDefault()?.Author,
        pinned = false, commentsEnabled, answers
    };

    private sealed record QuestionAnswer(Guid Id, string Author, string Text);
}

public sealed class RecipeQuestionRequest
{
    public string? Recipe { get; set; }
    public string? Question { get; set; }
}
