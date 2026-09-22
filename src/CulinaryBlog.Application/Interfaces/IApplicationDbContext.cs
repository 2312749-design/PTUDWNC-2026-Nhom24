using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Recipe> Recipes { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}