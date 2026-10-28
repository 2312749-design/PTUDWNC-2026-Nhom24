using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Recipe> Recipes => Set<Recipe>();

    public DbSet<BlogUser> BlogUsers => Set<BlogUser>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

    public DbSet<RecipeIngredient> RecipeIngredients => Set<RecipeIngredient>();

    public DbSet<RecipeStep> RecipeSteps => Set<RecipeStep>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BlogUser>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(320);

            entity.HasIndex(x => x.Email)
                .IsUnique();

            entity.Property(x => x.DisplayName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.Bio)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(x => x.AvatarUrl)
                .HasMaxLength(500);

            entity.Property(x => x.PasswordHash)
                .IsRequired();

            entity.Property(x => x.Role)
                .IsRequired()
                .HasMaxLength(50);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.Slug)
                .IsRequired()
                .HasMaxLength(120);

            entity.Property(x => x.Description)
                .IsRequired()
                .HasMaxLength(500);

            entity.HasIndex(x => x.Slug)
                .IsUnique();

            entity.HasMany(x => x.Recipes)
                .WithOne(x => x.Category)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<Category>().HasData(
            new Category
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Name = "Món Việt",
                Slug = "mon-viet",
                Description = "Những món ăn đậm đà hương vị Việt Nam."
            },
            new Category
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Name = "Bữa sáng",
                Slug = "bua-sang",
                Description = "Món ăn khởi đầu ngày mới."
            },
            new Category
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                Name = "Món chay",
                Slug = "mon-chay",
                Description = "Các món ăn thanh nhẹ từ thực vật."
            },
            new Category
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                Name = "Tráng miệng",
                Slug = "trang-mieng",
                Description = "Món ngọt cho phần cuối bữa ăn."
            });

        modelBuilder.Entity<PasswordResetToken>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.TokenHash)
                .IsRequired()
                .HasMaxLength(64);

            entity.HasIndex(x => x.TokenHash)
                .IsUnique();

            entity.HasIndex(x => new { x.UserId, x.ExpiresAt });
        });

        modelBuilder.Entity<Recipe>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(x => x.Slug)
                .IsRequired()
                .HasMaxLength(250);

            entity.Property(x => x.Description)
                .HasMaxLength(2000);

            entity.Property(x => x.ImageUrl)
                .HasMaxLength(500);

            // PostgreSQL Full-Text Search
            entity.Property<NpgsqlTypes.NpgsqlTsVector>("SearchVector")
                .HasColumnName("SearchVector")
                .HasColumnType("tsvector")
                .HasComputedColumnSql(
                    """to_tsvector('simple'::regconfig, coalesce("Title", '') || ' ' || coalesce("Description", ''))""",
                    stored: true);
            entity.HasIndex("SearchVector").HasMethod("GIN");

            entity.HasMany(x => x.Ingredients)
                .WithOne(x => x.Recipe)
                .HasForeignKey(x => x.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(x => x.Steps)
                .WithOne(x => x.Recipe)
                .HasForeignKey(x => x.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RecipeIngredient>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(x => x.Unit)
                .HasMaxLength(50);

            entity.Property(x => x.Notes)
                .HasMaxLength(500);

            entity.Property(x => x.Quantity)
                .HasPrecision(10, 2);
        });

        modelBuilder.Entity<RecipeStep>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(x => x.Description)
                .IsRequired();

            entity.Property(x => x.ImageUrl)
                .HasMaxLength(500);
        });
    }
}