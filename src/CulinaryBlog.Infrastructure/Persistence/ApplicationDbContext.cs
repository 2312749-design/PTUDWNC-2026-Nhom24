using CulinaryBlog.Application.Interfaces; // 1. Thêm namespace chứa interface
using CulinaryBlog.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext // 2. Thêm , IApplicationDbContext vào đây
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Recipe> Recipes => Set<Recipe>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Cấu hình tên bảng chuẩn cho Identity và các thực thể
        builder.Entity<ApplicationUser>(entity => { entity.ToTable(name: "Users"); });

        builder.Entity<RefreshToken>(entity => {
            entity.ToTable(name: "RefreshTokens");
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình bảng Category
        builder.Entity<Category>(entity => {
            entity.ToTable(name: "Categories");
            entity.HasKey(e => e.Id);
        });

        // Cấu hình bảng Recipe và các mối quan hệ khóa ngoại
        builder.Entity<Recipe>(entity => {
            entity.ToTable(name: "Recipes");
            entity.HasKey(e => e.Id);

            // Quan hệ với Tác giả (User)
            entity.HasOne(e => e.Author)
                  .WithMany()
                  .HasForeignKey(e => e.AuthorId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Quan hệ 1-nhiều với Danh mục (Category)
            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Recipes)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict); // Không cho xóa Category nếu vẫn còn Recipe bên trong
        });
    }
}