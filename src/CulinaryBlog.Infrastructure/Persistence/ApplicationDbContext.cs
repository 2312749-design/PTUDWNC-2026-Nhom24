using CulinaryBlog.Application.Interfaces; // 1. Thêm namespace chứa interface
using CulinaryBlog.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;

namespace CulinaryBlog.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext // 2. Thêm , IApplicationDbContext vào đây
{
    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<RecipeImage> RecipeImages => Set<RecipeImage>();
    public DbSet<RecipeIngredient> RecipeIngredients => Set<RecipeIngredient>();
    public DbSet<RecipeStep> RecipeSteps => Set<RecipeStep>();
    public DbSet<CommunityPost> CommunityPosts => Set<CommunityPost>();
    public DbSet<PostLike> PostLikes => Set<PostLike>();
    public DbSet<PostComment> PostComments => Set<PostComment>();
    public DbSet<UserFollow> UserFollows => Set<UserFollow>();
    public DbSet<RecipeBookmark> RecipeBookmarks => Set<RecipeBookmark>();
    public DbSet<RecipeCollection> RecipeCollections => Set<RecipeCollection>();
    public DbSet<RecipeCollectionItem> RecipeCollectionItems => Set<RecipeCollectionItem>();
    public DbSet<RecipeReview> RecipeReviews => Set<RecipeReview>();
    public DbSet<MealPlanEntry> MealPlanEntries => Set<MealPlanEntry>();
    public DbSet<GroceryCheck> GroceryChecks => Set<GroceryCheck>();
    public DbSet<AppNotification> AppNotifications => Set<AppNotification>();
    public DbSet<UserBlock> UserBlocks => Set<UserBlock>();
    public DbSet<ContentReport> ContentReports => Set<ContentReport>();
    public DbSet<CookingChallenge> CookingChallenges => Set<CookingChallenge>();
    public DbSet<ChallengeSubmission> ChallengeSubmissions => Set<ChallengeSubmission>();
    public DbSet<UserBadge> UserBadges => Set<UserBadge>();
    public DbSet<RecipeView> RecipeViews => Set<RecipeView>();
    public DbSet<BlogArticle> BlogArticles => Set<BlogArticle>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Cấu hình tên bảng chuẩn cho Identity và các thực thể
        builder.Entity<ApplicationUser>(entity => { entity.ToTable(name: "Users"); });

        builder.Entity<CommunityPost>(entity => {
            entity.ToTable("CommunityPosts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).HasMaxLength(3000);
            entity.Property(e => e.MediaUrl).HasMaxLength(2048);
            entity.Property(e => e.MediaType).HasMaxLength(10);
            entity.HasOne(e => e.Author).WithMany().HasForeignKey(e => e.AuthorId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.IsDraft, e.CreatedAt });
        });

        builder.Entity<BlogArticle>(entity => {
            entity.ToTable("BlogArticles");
            entity.HasKey(article => article.Id);
            entity.Property(article => article.Title).HasMaxLength(160).IsRequired();
            entity.Property(article => article.Slug).HasMaxLength(180).IsRequired();
            entity.Property(article => article.Summary).HasMaxLength(500).IsRequired();
            entity.Property(article => article.Content).IsRequired();
            entity.Property(article => article.CoverImageUrl).HasMaxLength(2048);
            entity.HasIndex(article => article.Slug).IsUnique();
            entity.HasIndex(article => article.CreatedAt);
            entity.HasOne(article => article.Author).WithMany().HasForeignKey(article => article.AuthorId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<PostLike>(entity => {
            entity.ToTable("PostLikes");
            entity.HasKey(e => new { e.PostId, e.UserId });
            entity.HasOne(e => e.Post).WithMany(p => p.Likes).HasForeignKey(e => e.PostId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<PostComment>(entity => {
            entity.ToTable("PostComments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).HasMaxLength(1000);
            entity.HasOne(e => e.Post).WithMany(p => p.Comments).HasForeignKey(e => e.PostId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Author).WithMany().HasForeignKey(e => e.AuthorId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.ParentComment).WithMany().HasForeignKey(e => e.ParentCommentId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<UserFollow>(entity => {
            entity.ToTable("UserFollows");
            entity.HasKey(e => new { e.FollowerId, e.FollowedId });
            entity.HasOne(e => e.Follower).WithMany().HasForeignKey(e => e.FollowerId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Followed).WithMany().HasForeignKey(e => e.FollowedId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<RecipeBookmark>(entity => {
            entity.ToTable("RecipeBookmarks");
            entity.HasKey(e => new { e.RecipeId, e.UserId });
            entity.HasOne(e => e.Recipe).WithMany().HasForeignKey(e => e.RecipeId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<RecipeCollection>(entity => {
            entity.ToTable("RecipeCollections");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(80);
            entity.HasOne(e => e.Owner).WithMany().HasForeignKey(e => e.OwnerId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<RecipeCollectionItem>(entity => {
            entity.ToTable("RecipeCollectionItems");
            entity.HasKey(e => new { e.CollectionId, e.RecipeId });
            entity.HasOne(e => e.Collection).WithMany(c => c.Items).HasForeignKey(e => e.CollectionId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Recipe).WithMany().HasForeignKey(e => e.RecipeId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<RecipeReview>(entity => {
            entity.ToTable("RecipeReviews");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).HasMaxLength(1200);
            entity.HasIndex(e => new { e.RecipeId, e.UserId }).IsUnique();
            entity.HasOne(e => e.Recipe).WithMany().HasForeignKey(e => e.RecipeId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<MealPlanEntry>(entity => {
            entity.ToTable("MealPlanEntries");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MealType).HasMaxLength(30);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Recipe).WithMany().HasForeignKey(e => e.RecipeId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.PlannedFor });
        });

        builder.Entity<GroceryCheck>(entity => {
            entity.ToTable("GroceryChecks");
            entity.HasKey(e => new { e.UserId, e.WeekStart, e.IngredientKey });
            entity.Property(e => e.IngredientKey).HasMaxLength(300);
            entity.Property(e => e.Ingredient).HasMaxLength(300);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<AppNotification>(entity => {
            entity.ToTable("AppNotifications");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Type).HasMaxLength(40);
            entity.Property(e => e.Message).HasMaxLength(300);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Actor).WithMany().HasForeignKey(e => e.ActorId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.CreatedAt });
        });

        builder.Entity<UserBlock>(entity => {
            entity.ToTable("UserBlocks");
            entity.HasKey(e => new { e.BlockerId, e.BlockedId });
            entity.HasOne(e => e.Blocker).WithMany().HasForeignKey(e => e.BlockerId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Blocked).WithMany().HasForeignKey(e => e.BlockedId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ContentReport>(entity => {
            entity.ToTable("ContentReports");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TargetType).HasMaxLength(30);
            entity.Property(e => e.TargetId).HasMaxLength(80);
            entity.Property(e => e.Reason).HasMaxLength(500);
            entity.HasOne(e => e.Reporter).WithMany().HasForeignKey(e => e.ReporterId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.TargetType, e.TargetId, e.CreatedAt });
        });

        builder.Entity<CookingChallenge>(entity => {
            entity.ToTable("CookingChallenges");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(100);
            entity.Property(e => e.Theme).HasMaxLength(1000);
        });

        builder.Entity<ChallengeSubmission>(entity => {
            entity.ToTable("ChallengeSubmissions");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ChallengeId, e.UserId, e.RecipeId }).IsUnique();
            entity.HasOne(e => e.Challenge).WithMany(challenge => challenge.Submissions).HasForeignKey(e => e.ChallengeId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Recipe).WithMany().HasForeignKey(e => e.RecipeId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<UserBadge>(entity => {
            entity.ToTable("UserBadges");
            entity.HasKey(e => new { e.UserId, e.Code });
            entity.Property(e => e.Code).HasMaxLength(60);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<RecipeView>(entity => {
            entity.ToTable("RecipeViews");
            entity.HasKey(e => new { e.RecipeId, e.UserId });
            entity.HasOne(e => e.Recipe).WithMany().HasForeignKey(e => e.RecipeId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<RefreshToken>(entity => {
            entity.ToTable(name: "RefreshTokens");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TokenHash).IsRequired().HasMaxLength(64);
            entity.Property(e => e.TokenFamilyId).IsRequired().HasMaxLength(64);
            entity.HasIndex(e => e.TokenHash).IsUnique();
            entity.HasIndex(e => new { e.UserId, e.IsRevoked, e.ExpiresAt });
            entity.HasOne(e => e.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình bảng Category
        builder.Entity<Category>(entity => {
            entity.ToTable(name: "Categories");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(160).IsRequired();
            entity.Property(e => e.ImageUrl).HasMaxLength(2048);
            entity.HasIndex(e => e.Name).IsUnique();
            entity.HasIndex(e => e.Slug).IsUnique();
        });

        // Cấu hình bảng Recipe và các mối quan hệ khóa ngoại
        builder.Entity<Recipe>(entity => {
            entity.ToTable("Recipes", table =>
            {
                table.HasCheckConstraint("CK_Recipes_PrepTimeMinutes", "\"PrepTimeMinutes\" > 0");
                table.HasCheckConstraint("CK_Recipes_CookTimeMinutes", "\"CookTimeMinutes\" >= 0");
                table.HasCheckConstraint("CK_Recipes_Servings", "\"Servings\" > 0");
                table.HasCheckConstraint("CK_Recipes_Difficulty", "\"Difficulty\" IN ('Easy', 'Medium', 'Hard', 'Expert')");
                table.HasCheckConstraint("CK_Recipes_Nutrition", "(\"Nutrition_Calories\" IS NULL OR \"Nutrition_Calories\" >= 0) AND (\"Nutrition_Protein\" IS NULL OR \"Nutrition_Protein\" >= 0) AND (\"Nutrition_Carbohydrates\" IS NULL OR \"Nutrition_Carbohydrates\" >= 0) AND (\"Nutrition_Fat\" IS NULL OR \"Nutrition_Fat\" >= 0) AND (\"Nutrition_Fiber\" IS NULL OR \"Nutrition_Fiber\" >= 0) AND (\"Nutrition_Sodium\" IS NULL OR \"Nutrition_Sodium\" >= 0)");
            });
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(160).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Difficulty).HasMaxLength(10).IsRequired();
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.OwnsOne(e => e.Nutrition, nutrition =>
            {
                nutrition.Property(value => value.Calories).HasColumnName("Nutrition_Calories").HasPrecision(12, 2);
                nutrition.Property(value => value.Protein).HasColumnName("Nutrition_Protein").HasPrecision(12, 2);
                nutrition.Property(value => value.Carbohydrates).HasColumnName("Nutrition_Carbohydrates").HasPrecision(12, 2);
                nutrition.Property(value => value.Fat).HasColumnName("Nutrition_Fat").HasPrecision(12, 2);
                nutrition.Property(value => value.Fiber).HasColumnName("Nutrition_Fiber").HasPrecision(12, 2);
                nutrition.Property(value => value.Sodium).HasColumnName("Nutrition_Sodium").HasPrecision(12, 2);
            });
            entity.Navigation(e => e.Nutrition).IsRequired(false);
            entity.Property(e => e.SearchVector)
                .HasColumnType("tsvector")
                .HasDefaultValueSql("''::tsvector")
                .ValueGeneratedOnAddOrUpdate();
            entity.HasIndex(e => e.SearchVector)
                .HasMethod("GIN");

            entity.HasOne(e => e.Author)
                  .WithMany()
                  .HasForeignKey(e => e.AuthorId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Recipes)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<RecipeIngredient>(entity => {
            entity.ToTable(name: "RecipeIngredients");
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Recipe)
                  .WithMany()
                  .HasForeignKey(e => e.RecipeId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.Quantity).HasMaxLength(100);
            entity.Property(e => e.Unit).HasMaxLength(50);
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.HasIndex(e => new { e.RecipeId, e.OrderIndex }).IsUnique();
        });

        builder.Entity<RecipeImage>(entity => {
            entity.ToTable("RecipeImages");
            entity.HasKey(image => image.Id);
            entity.Property(image => image.Url).HasMaxLength(2048).IsRequired();
            entity.Property(image => image.ThumbnailUrl).HasMaxLength(2048).IsRequired();
            entity.Property(image => image.MediumUrl).HasMaxLength(2048).IsRequired();
            entity.HasIndex(image => new { image.RecipeId, image.CreatedAt });
            entity.HasOne(image => image.Recipe).WithMany(recipe => recipe.Images)
                .HasForeignKey(image => image.RecipeId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<RecipeStep>(entity => {
            entity.ToTable(name: "RecipeSteps");
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Recipe)
                  .WithMany()
                  .HasForeignKey(e => e.RecipeId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.ImageUrl).HasMaxLength(2048);
            entity.HasIndex(e => new { e.RecipeId, e.StepNumber }).IsUnique();
        });
    }
}
