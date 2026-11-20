using CulinaryBlog.API.Endpoints;
using CulinaryBlog.Application.DTOs;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class ArchitectureDependencyTests
{
    [Fact]
    public void ProjectReferences_FollowTheDependencyRule()
    {
        var domain = typeof(Recipe).Assembly;
        var application = typeof(RecipeDto).Assembly;
        var infrastructure = typeof(ApplicationDbContext).Assembly;
        var api = typeof(RecipesHandlers).Assembly;

        Assert.DoesNotContain(domain.GetReferencedAssemblies(), name =>
            name.Name is "CulinaryBlog.Application" or "CulinaryBlog.Infrastructure" or "CulinaryBlog.API");
        Assert.DoesNotContain(application.GetReferencedAssemblies(), name =>
            name.Name is "CulinaryBlog.Infrastructure" or "CulinaryBlog.API" or "Microsoft.EntityFrameworkCore");
        Assert.Contains(infrastructure.GetReferencedAssemblies(), name => name.Name == "CulinaryBlog.Application");
        Assert.DoesNotContain(infrastructure.GetReferencedAssemblies(), name => name.Name == "CulinaryBlog.API");
        Assert.Contains(api.GetReferencedAssemblies(), name => name.Name == "CulinaryBlog.Application");
        Assert.Contains(api.GetReferencedAssemblies(), name => name.Name == "CulinaryBlog.Infrastructure");
    }
}
