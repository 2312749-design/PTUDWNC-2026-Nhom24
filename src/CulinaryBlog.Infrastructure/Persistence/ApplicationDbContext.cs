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
            entity.HasOne(e => e.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình bảng Category
        builder.Entity<Category>(entity => {
            entity.ToTable(name: "Categories");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ImageUrl).HasMaxLength(2048);
        });

        // Cấu hình bảng Recipe và các mối quan hệ khóa ngoại
        builder.Entity<Recipe>(entity => {
            entity.ToTable(name: "Recipes");
            entity.HasKey(e => e.Id);

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
        });
    }
}