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


    public override int SaveChanges()
    {
        CaptureRecipeRevisions();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        CaptureRecipeRevisions();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void CaptureRecipeRevisions()
    {
        var changedRecipes = ChangeTracker.Entries<Recipe>()
            .Where(entry => entry.State == EntityState.Modified)
            .ToList();
        foreach (var entry in changedRecipes)
        {
            var recipe = entry.Entity;
            var original = entry.OriginalValues;
            var nextVersion = RecipeRevisions.Where(item => item.RecipeId == recipe.Id).Select(item => (int?)item.Version).Max() ?? 0;
            var snapshot = new RecipeRevisionSnapshot
            {
                Title = original.GetValue<string>(nameof(Recipe.Title)),
                Description = original.GetValue<string?>(nameof(Recipe.Description)),
                ImageUrl = original.GetValue<string?>(nameof(Recipe.ImageUrl)),
                CategoryId = original.GetValue<Guid>(nameof(Recipe.CategoryId)),
                Ingredients = (original[nameof(Recipe.Ingredients)] as List<string>)?.ToList() ?? recipe.Ingredients.ToList(),
                Instructions = (original[nameof(Recipe.Instructions)] as List<string>)?.ToList() ?? recipe.Instructions.ToList(),
                PrepTimeMinutes = original.GetValue<int>(nameof(Recipe.PrepTimeMinutes)),
                CookTimeMinutes = original.GetValue<int>(nameof(Recipe.CookTimeMinutes)),
                Servings = original.GetValue<int>(nameof(Recipe.Servings)),
                Difficulty = original.GetValue<string>(nameof(Recipe.Difficulty)),
                IsVegetarian = original.GetValue<bool>(nameof(Recipe.IsVegetarian)),
                Nutrition = recipe.Nutrition
            };
            RecipeRevisions.Add(new RecipeRevision
            {
                RecipeId = recipe.Id,
                Version = nextVersion + 1,
                SnapshotJson = System.Text.Json.JsonSerializer.Serialize(snapshot),
                CreatedById = recipe.AuthorId,
                CreatedAt = DateTime.UtcNow
            });
#if false
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
#endif
        }
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
    public DbSet<AdminAuditLog> AdminAuditLogs => Set<AdminAuditLog>();
    public DbSet<TwoFactorRecoveryCode> TwoFactorRecoveryCodes => Set<TwoFactorRecoveryCode>();
    public DbSet<EmailChangeRequest> EmailChangeRequests => Set<EmailChangeRequest>();
    public DbSet<UserActivityLog> UserActivityLogs => Set<UserActivityLog>();

    public DbSet<RecipeRevision> RecipeRevisions => Set<RecipeRevision>();
    public DbSet<UserPreference> UserPreferences => Set<UserPreference>();
    public DbSet<CategoryRelationship> CategoryRelationships => Set<CategoryRelationship>();
    public DbSet<PostReaction> PostReactions => Set<PostReaction>();
    public DbSet<CookingEvent> CookingEvents => Set<CookingEvent>();
    public DbSet<CookingEventRegistration> CookingEventRegistrations => Set<CookingEventRegistration>();
    public DbSet<UserWorkspaceDraft> UserWorkspaceDrafts => Set<UserWorkspaceDraft>();
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Cấu hình tên bảng chuẩn cho Identity và các thực thể
        builder.Entity<ApplicationUser>(entity => { entity.ToTable(name: "Users"); });

        builder.Entity<AdminAuditLog>(entity => {
            entity.ToTable("AdminAuditLogs");
            entity.HasKey(log => log.Id);
            entity.Property(log => log.Action).HasMaxLength(80).IsRequired();
            entity.Property(log => log.TargetType).HasMaxLength(40).IsRequired();
            entity.Property(log => log.TargetId).HasMaxLength(100).IsRequired();
            entity.Property(log => log.Summary).HasMaxLength(1000).IsRequired();
            entity.HasIndex(log => new { log.CreatedAt, log.TargetType, log.TargetId });
            entity.HasOne(log => log.Actor).WithMany().HasForeignKey(log => log.ActorId).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<TwoFactorRecoveryCode>(entity => {
            entity.ToTable("TwoFactorRecoveryCodes");
            entity.HasKey(code => code.Id);
            entity.Property(code => code.CodeHash).HasMaxLength(64).IsRequired();
            entity.HasIndex(code => new { code.UserId, code.CodeHash }).IsUnique();
            entity.HasOne(code => code.User).WithMany().HasForeignKey(code => code.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<EmailChangeRequest>(entity => {
            entity.ToTable("EmailChangeRequests");
            entity.HasKey(request => request.Id);
            entity.Property(request => request.NewEmail).HasMaxLength(254).IsRequired();
            entity.Property(request => request.CodeHash).HasMaxLength(64).IsRequired();
            entity.HasIndex(request => new { request.UserId, request.CreatedAt });
            entity.HasOne(request => request.User).WithMany().HasForeignKey(request => request.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<UserActivityLog>(entity => {
            entity.ToTable("UserActivityLogs");
            entity.HasKey(activity => activity.Id);
            entity.Property(activity => activity.ActivityType).HasMaxLength(80).IsRequired();
            entity.Property(activity => activity.Description).HasMaxLength(500).IsRequired();
            entity.Property(activity => activity.IpAddress).HasMaxLength(64);
            entity.Property(activity => activity.UserAgent).HasMaxLength(512);
            entity.HasIndex(activity => new { activity.UserId, activity.CreatedAt });
            entity.HasOne(activity => activity.User).WithMany().HasForeignKey(activity => activity.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<RecipeRevision>(entity => {
            entity.ToTable("RecipeRevisions");
            entity.HasKey(revision => revision.Id);
            entity.Property(revision => revision.SnapshotJson).HasMaxLength(60000).IsRequired();
            entity.Property(revision => revision.CreatedById).HasMaxLength(450).IsRequired();
            entity.HasIndex(revision => new { revision.RecipeId, revision.Version }).IsUnique();
            entity.HasOne(revision => revision.Recipe).WithMany().HasForeignKey(revision => revision.RecipeId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(revision => revision.CreatedBy).WithMany().HasForeignKey(revision => revision.CreatedById).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<UserPreference>(entity => {
            entity.ToTable("UserPreferences");
            entity.HasKey(preference => preference.UserId);
            entity.Property(preference => preference.SettingsJson).HasMaxLength(12000).IsRequired();
            entity.HasOne(preference => preference.User).WithMany().HasForeignKey(preference => preference.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CategoryRelationship>(entity => {
            entity.ToTable("CategoryRelationships");
            entity.HasKey(link => link.ChildCategoryId);
            entity.HasOne(link => link.ChildCategory).WithMany().HasForeignKey(link => link.ChildCategoryId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(link => link.ParentCategory).WithMany().HasForeignKey(link => link.ParentCategoryId).OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(link => link.ParentCategoryId);
        });

        builder.Entity<PostReaction>(entity => {
            entity.ToTable("PostReactions");
            entity.HasKey(reaction => new { reaction.PostId, reaction.UserId });
            entity.Property(reaction => reaction.Type).HasMaxLength(20).IsRequired();
            entity.HasOne(reaction => reaction.Post).WithMany().HasForeignKey(reaction => reaction.PostId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(reaction => reaction.User).WithMany().HasForeignKey(reaction => reaction.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CookingEvent>(entity => {
            entity.ToTable("CookingEvents");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Title).HasMaxLength(160).IsRequired();
            entity.Property(item => item.Description).HasMaxLength(3000).IsRequired();
            entity.Property(item => item.CoverImageUrl).HasMaxLength(2048);
            entity.Property(item => item.CreatedById).HasMaxLength(450).IsRequired();
            entity.HasOne(item => item.CreatedBy).WithMany().HasForeignKey(item => item.CreatedById).OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(item => new { item.StartsAt, item.EndsAt });
        });

        builder.Entity<CookingEventRegistration>(entity => {
            entity.ToTable("CookingEventRegistrations");
            entity.HasKey(item => new { item.EventId, item.UserId });
            entity.HasOne(item => item.Event).WithMany().HasForeignKey(item => item.EventId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(item => item.User).WithMany().HasForeignKey(item => item.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(item => item.SubmittedRecipe).WithMany().HasForeignKey(item => item.SubmittedRecipeId).OnDelete(DeleteBehavior.SetNull);
            entity.HasIndex(item => item.SubmittedRecipeId);
        });

        builder.Entity<UserWorkspaceDraft>(entity => {
            entity.ToTable("UserWorkspaceDrafts");
            entity.HasKey(item => new { item.UserId, item.DraftKey });
            entity.Property(item => item.DraftKey).HasMaxLength(120);
            entity.Property(item => item.ContentJson).HasMaxLength(30000).IsRequired();
            entity.HasOne(item => item.User).WithMany().HasForeignKey(item => item.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CommunityPost>(entity => {
            entity.ToTable("CommunityPosts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).HasMaxLength(3000);
            entity.Property(e => e.MediaUrl).HasMaxLength(2048);
            entity.Property(e => e.MediaType).HasMaxLength(10);
            entity.Property(e => e.HiddenReason).HasMaxLength(500);
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
            entity.Property(e => e.PhotoUrl).HasMaxLength(2048);
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
            entity.Property(e => e.ResolutionAction).HasMaxLength(80);
            entity.Property(e => e.ResolutionNote).HasMaxLength(1000);
            entity.HasOne(e => e.Reporter).WithMany().HasForeignKey(e => e.ReporterId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.ResolvedBy).WithMany().HasForeignKey(e => e.ResolvedById).OnDelete(DeleteBehavior.Restrict);
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
            entity.Property(e => e.IpAddress).HasMaxLength(64);
            entity.Property(e => e.UserAgent).HasMaxLength(512);
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
            entity.Property(e => e.IsVisible).HasDefaultValue(true);
            entity.HasIndex(e => new { e.IsDeleted, e.IsVisible, e.DisplayOrder });
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
            entity.Property(e => e.ReviewStatus).HasMaxLength(30).HasDefaultValue("Draft");
            entity.Property(e => e.ReviewNote).HasMaxLength(1000);
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
            entity.Property<NpgsqlTsVector>("SearchVector")
                .IsRequired()
                .HasColumnType("tsvector")
                .HasDefaultValueSql("''::tsvector")
                .ValueGeneratedOnAddOrUpdate();
            entity.HasIndex("SearchVector")
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
