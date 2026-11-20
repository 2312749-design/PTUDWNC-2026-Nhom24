using System.Security.Claims;
using CulinaryBlog.Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace CulinaryBlog.API.Authorization;

public sealed class RecipeOperationRequirement(string name) : IAuthorizationRequirement
{
    public string Name { get; } = name;
}

public static class RecipeOperations
{
    public static readonly RecipeOperationRequirement Read = new("Read");
    public static readonly RecipeOperationRequirement Update = new("Update");
    public static readonly RecipeOperationRequirement Delete = new("Delete");
    public static readonly RecipeOperationRequirement Publish = new("Publish");
    public static readonly RecipeOperationRequirement Archive = new("Archive");
    public static readonly RecipeOperationRequirement ManageImage = new("ManageImage");
}

public static class RecipeAuthorizationRules
{
    public static bool IsAllowed(ClaimsPrincipal user, RecipeOperationRequirement operation, Recipe recipe)
    {
        if (user.IsInRole("Admin")) return true;

        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        var isOwner = !string.IsNullOrWhiteSpace(userId) && recipe.AuthorId == userId;

        if (operation == RecipeOperations.Read)
            return isOwner || (!recipe.IsDeleted && recipe.Status == RecipeStatus.Published
                && recipe.Category?.IsDeleted != true && recipe.Category?.IsVisible != false);

        return isOwner;
    }
}

public sealed class RecipeAuthorizationHandler
    : AuthorizationHandler<RecipeOperationRequirement, Recipe>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        RecipeOperationRequirement requirement,
        Recipe resource)
    {
        if (RecipeAuthorizationRules.IsAllowed(context.User, requirement, resource))
            context.Succeed(requirement);

        return Task.CompletedTask;
    }
}
