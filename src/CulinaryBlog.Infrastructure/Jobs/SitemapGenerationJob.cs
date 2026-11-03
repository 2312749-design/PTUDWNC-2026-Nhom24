using System.Text;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

public sealed class SitemapGenerationJob(
    ApplicationDbContext context,
    IWebHostEnvironment environment,
    ILogger<SitemapGenerationJob> logger)
{
    public async Task GenerateAsync()
    {
        var slugs = await context.Recipes.AsNoTracking()
            .Where(recipe => recipe.Status == RecipeStatus.Published && !recipe.IsDeleted && !recipe.Category.IsDeleted)
            .OrderBy(recipe => recipe.Slug)
            .Select(recipe => recipe.Slug)
            .ToListAsync();

        var root = environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot");
        Directory.CreateDirectory(root);
        var xml = new StringBuilder("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
        foreach (var slug in slugs)
            xml.Append("<url><loc>/recipes/").Append(System.Security.SecurityElement.Escape(slug)).Append("</loc></url>");
        xml.Append("</urlset>");
        await File.WriteAllTextAsync(Path.Combine(root, "sitemap-recipes.xml"), xml.ToString(), Encoding.UTF8);
        logger.LogInformation("Generated recipe sitemap with {RecipeCount} published recipes.", slugs.Count);
    }
}
