using Bogus;
using CulinaryBlog.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence;

public static class DataSeeder
{
    public static async Task SeedDataAsync(ApplicationDbContext context)
    {
        var passwordHasher = new PasswordHasher<ApplicationUser>();

        var defaultUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@culinaryblog.com" || u.UserName == "chefdemo");
        if (defaultUser == null)
        {
            defaultUser = ApplicationUser.Create("Chef Demo", "admin@culinaryblog.com", "chefdemo");
            defaultUser.PasswordHash = passwordHasher.HashPassword(defaultUser, "chefdemo");
            await context.Users.AddAsync(defaultUser);
            await context.SaveChangesAsync();
        }
        else if (!string.IsNullOrWhiteSpace(defaultUser.PasswordHash))
        {
            try
            {
                var passwordCheck = passwordHasher.VerifyHashedPassword(defaultUser, defaultUser.PasswordHash, "chefdemo");
                if (passwordCheck == PasswordVerificationResult.Failed)
                {
                    defaultUser.PasswordHash = passwordHasher.HashPassword(defaultUser, "chefdemo");
                    await context.SaveChangesAsync();
                }
            }
            catch (FormatException)
            {
                defaultUser.PasswordHash = passwordHasher.HashPassword(defaultUser, "chefdemo");
                await context.SaveChangesAsync();
            }
        }

        defaultUser = await context.Users.FirstAsync(u => u.Email == "admin@culinaryblog.com" || u.UserName == "chefdemo");

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