using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Controllers;

[Route("api/articles")]
[ApiController]
public class ArticlesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ArticlesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetArticles([FromQuery] int take = 12)
    {
        take = Math.Clamp(take, 1, 40);
        var articles = await _context.BlogArticles.AsNoTracking()
            .OrderByDescending(article => article.CreatedAt)
            .Take(take)
            .Select(article => new
            {
                article.Id,
                article.Title,
                article.Slug,
                article.Summary,
                article.CoverImageUrl,
                article.CreatedAt,
                article.UpdatedAt,
                author = new { article.Author.UserName, article.Author.FullName, article.Author.AvatarUrl }
            })
            .ToListAsync();

        return Ok(articles);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var article = await _context.BlogArticles.AsNoTracking()
            .Where(candidate => candidate.Slug == slug)
            .Select(candidate => new
            {
                candidate.Id,
                candidate.Title,
                candidate.Slug,
                candidate.Summary,
                candidate.Content,
                candidate.CoverImageUrl,
                candidate.CreatedAt,
                candidate.UpdatedAt,
                author = new { candidate.Author.UserName, candidate.Author.FullName, candidate.Author.AvatarUrl }
            })
            .FirstOrDefaultAsync();

        return article == null ? NotFound(new { message = "Không tìm thấy bài viết." }) : Ok(article);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] ArticleRequest request)
    {
        var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(authorId)) return Unauthorized();

        var slug = await CreateUniqueSlugAsync(request.Title);
        var article = BlogArticle.Create(request.Title, slug, request.Summary, request.Content, request.CoverImageUrl, authorId);
        _context.BlogArticles.Add(article);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBySlug), new { slug = article.Slug }, new
        {
            article.Id,
            article.Title,
            article.Slug,
            article.Summary,
            article.Content,
            article.CoverImageUrl,
            article.CreatedAt
        });
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromBody] ArticleRequest request)
    {
        var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var article = await _context.BlogArticles.FirstOrDefaultAsync(candidate => candidate.Id == id);
        if (article == null) return NotFound(new { message = "Không tìm thấy bài viết." });
        if (article.AuthorId != authorId) return Forbid();

        article.Update(request.Title, await CreateUniqueSlugAsync(request.Title, id), request.Summary, request.Content, request.CoverImageUrl);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var article = await _context.BlogArticles.FirstOrDefaultAsync(candidate => candidate.Id == id);
        if (article == null) return NotFound(new { message = "Không tìm thấy bài viết." });
        if (article.AuthorId != authorId) return Forbid();

        _context.BlogArticles.Remove(article);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task<string> CreateUniqueSlugAsync(string title, Guid? exceptArticleId = null)
    {
        var root = Slugify(title);
        var slug = root;
        var suffix = 2;
        while (await _context.BlogArticles.AnyAsync(article => article.Slug == slug && article.Id != exceptArticleId))
        {
            slug = $"{root}-{suffix++}";
        }
        return slug;
    }

    private static string Slugify(string value)
    {
        var normalized = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(normalized.Length);
        var previousWasSeparator = false;

        foreach (var character in normalized)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(character);
            if (category == UnicodeCategory.NonSpacingMark) continue;
            if (char.IsLetterOrDigit(character))
            {
                builder.Append(character);
                previousWasSeparator = false;
            }
            else if (!previousWasSeparator && builder.Length > 0)
            {
                builder.Append('-');
                previousWasSeparator = true;
            }
        }

        return builder.ToString().Trim('-');
    }

    public sealed class ArticleRequest
    {
        [Required, StringLength(160, MinimumLength = 5)]
        public string Title { get; set; } = string.Empty;

        [Required, StringLength(500, MinimumLength = 20)]
        public string Summary { get; set; } = string.Empty;

        [Required, StringLength(20000, MinimumLength = 80)]
        public string Content { get; set; } = string.Empty;

        [StringLength(2048)]
        public string? CoverImageUrl { get; set; }
    }
}
