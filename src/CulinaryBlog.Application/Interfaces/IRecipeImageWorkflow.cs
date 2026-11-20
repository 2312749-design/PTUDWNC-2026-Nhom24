namespace CulinaryBlog.Application.Interfaces;

public sealed record RecipeImageWorkflowResult(
    Guid Id, string Url, string? ThumbnailUrl, string? MediumUrl,
    string? AltText, int OrderIndex, bool IsPrimary);

public interface IRecipeImageWorkflow
{
    Task<RecipeImageWorkflowResult> UploadAsync(Guid recipeId, byte[] content, string? altText, bool? primary, CancellationToken cancellationToken);
    Task<RecipeImageWorkflowResult> UpdateAsync(Guid recipeId, Guid imageId, string? altText, bool? isPrimary, int? orderIndex, CancellationToken cancellationToken);
    Task DeleteAsync(Guid recipeId, Guid imageId, CancellationToken cancellationToken);
}

