using Bogus;
using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence;

public static class DataSeeder
{
    public static async Task SeedDataAsync(ApplicationDbContext context)
    {
        if (!await context.Users.AnyAsync())
        {
            var user = ApplicationUser.Create("Chef Demo", "admin@culinaryblog.com", "chefdemo");
            user.PasswordHash = "AQAAAAIAAYagAAAAEP2x...";
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
        }

        var defaultUser = await context.Users.FirstAsync();

        if (await context.Categories.AnyAsync() || await context.Recipes.AnyAsync())
        {
            return;
        }

        var categoryFaker = new Faker<Category>()
            .RuleFor(c => c.Id, f => Guid.NewGuid())
            .RuleFor(c => c.Name, f => f.Commerce.Categories(1)[0] + " " + f.Random.Word())
            .RuleFor(c => c.Description, f => f.Lorem.Sentence());

        var categories = categoryFaker.Generate(20);
        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();

        var recipeFaker = new Faker<Recipe>()
            .CustomInstantiator(f =>
            {
                var ingredients = Enumerable.Range(1, 10)
                    .Select(_ => $"{f.Commerce.ProductAdjective()} {f.Commerce.ProductName()}")
                    .ToList();

                var steps = Enumerable.Range(1, 5)
                    .Select(i => $"Bước {i}: {f.Lorem.Sentence()}")
                    .ToList();

                return Recipe.Create(
                    title: f.Commerce.ProductName(),
                    description: f.Lorem.Paragraph(),
                    ingredients: ingredients,
                    instructions: steps,
                    categoryId: f.PickRandom(categories).Id,
                    authorId: defaultUser.Id
                );
            });

        var recipes = recipeFaker.Generate(100);
        await context.Recipes.AddRangeAsync(recipes);
        await context.SaveChangesAsync();
    }
}