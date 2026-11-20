using System.Security;
using System.Text;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

/// <summary>Builds the complete public sitemap required by NFR-SEO-003.</summary>
public sealed class SitemapGenerationJob(
    ApplicationDbContext context,
    IWebHostEnvironment environment,
    IConfiguration configuration,
    IHttpClientFactory httpClientFactory,
    ILogger<SitemapGenerationJob> logger)
{
    private static readonly (string Path, string ChangeFrequency, decimal Priority)[] StaticPages =
    [
        ("/", "daily", 1.0m),
        ("/recipes", "daily", 0.9m),
        ("/categories", "weekly", 0.8m),
        ("/search", "weekly", 0.6m)
    ];

    public async Task GenerateAsync()
    {
        var siteUrl = (configuration["PublicSiteUrl"] ?? "http://localhost").TrimEnd('/');
        var recipes = await context.Recipes.AsNoTracking()
            .Where(recipe => recipe.Status == RecipeStatus.Published && !recipe.IsDeleted && !recipe.Category.IsDeleted)
            .OrderBy(recipe => recipe.Slug)
            .Select(recipe => new { recipe.Slug, recipe.UpdatedAt })
            .ToListAsync();
        var categories = await context.Categories.AsNoTracking()
            .Where(category => !category.IsDeleted && category.IsVisible)
            .OrderBy(category => category.Slug)
            .Select(category => new { category.Slug, category.UpdatedAt })
            .ToListAsync();

        var xml = new StringBuilder("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
        foreach (var page in StaticPages)
            AppendUrl(xml, siteUrl + page.Path, DateTime.UtcNow, page.ChangeFrequency, page.Priority);
        foreach (var category in categories)
            AppendUrl(xml, $"{siteUrl}/categories/{Uri.EscapeDataString(category.Slug)}", category.UpdatedAt, "weekly", 0.7m);
        foreach (var recipe in recipes)
            AppendUrl(xml, $"{siteUrl}/recipes/{Uri.EscapeDataString(recipe.Slug)}", recipe.UpdatedAt, "weekly", 0.8m);
        xml.Append("</urlset>");

        var root = environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot");
        Directory.CreateDirectory(root);
        var outputPath = Path.Combine(root, "sitemap.xml");
        await File.WriteAllTextAsync(outputPath, xml.ToString(), Encoding.UTF8);

        var sitemapUrl = $"{siteUrl}/sitemap.xml";
        if (configuration.GetValue<bool>("Sitemap:PingSearchEngine"))
        {
            try
            {
                var pingUrl = configuration["Sitemap:PingUrl"];
                if (!string.IsNullOrWhiteSpace(pingUrl))
                    await httpClientFactory.CreateClient().GetAsync($"{pingUrl}{Uri.EscapeDataString(sitemapUrl)}");
            }
            catch (Exception exception)
            {
                logger.LogWarning(exception, "Sitemap generated, but the optional search-engine ping failed.");
            }
        }

        logger.LogInformation(
            "Generated sitemap with {RecipeCount} recipes, {CategoryCount} categories and {StaticCount} static pages at {OutputPath}.",
            recipes.Count, categories.Count, StaticPages.Length, outputPath);
    }

    private static void AppendUrl(StringBuilder xml, string location, DateTime lastModified, string changeFrequency, decimal priority)
    {
        xml.Append("<url><loc>").Append(SecurityElement.Escape(location)).Append("</loc><lastmod>")
            .Append(lastModified.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ"))
            .Append("</lastmod><changefreq>").Append(changeFrequency)
            .Append("</changefreq><priority>").Append(priority.ToString("0.0", System.Globalization.CultureInfo.InvariantCulture))
            .Append("</priority></url>");
    }
}
