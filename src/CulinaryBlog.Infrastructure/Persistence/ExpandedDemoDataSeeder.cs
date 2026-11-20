using CulinaryBlog.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence;

/// <summary>
/// A repeatable, deliberately large local dataset used for demonstrations.
/// It only adds records identified by stable slugs/usernames, so it never
/// deletes or duplicates a student's existing data on later starts.
/// </summary>
public static class ExpandedDemoDataSeeder
{
    private const string ExpandedMarker = "Dữ liệu demo mở rộng Bếp Nhà";
    private const string LegacyExpandedDescription = "là công thức dễ theo dõi, nguyên liệu quen thuộc";
    private const int TargetMembers = 50;
    private const int ExtraRecipeCount = 500;
    private const int TargetPosts = 50;
    private const int TargetArticles = 50;
    private const int TargetChallenges = 40;
    private const int TargetComments = 100;
    private const int TargetSubmissions = 50;

    private static readonly string[] Images =
    [
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85"
    ];

    private static readonly string[] FirstNames = ["An", "Bình", "Chi", "Duy", "Giang", "Hà", "Khang", "Linh", "Minh", "Ngọc", "Phúc", "Quỳnh", "Sơn", "Thảo", "Uyên"];
    private static readonly string[] Surnames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Võ", "Đặng", "Bùi", "Phan", "Đỗ"];
    private static readonly string[] DishBases = ["Bữa cơm", "Món ngon", "Gợi ý bếp", "Công thức nhà làm", "Món cuối tuần", "Bữa sáng nhanh", "Món ấm bụng", "Món nhẹ nhàng", "Bếp xanh", "Món đãi khách"];
    private static readonly string[] FlavorNotes = ["vị truyền thống", "rau củ theo mùa", "sốt tiêu thơm", "nước dùng trong", "gia vị nhà làm", "ít dầu", "đậm đà", "thanh mát", "dễ nấu", "cho cả gia đình"];
    private static readonly string[] PostOpeners = ["Hôm nay mình thử", "Vừa hoàn thành", "Chia sẻ một mẹo nhỏ khi làm", "Bữa tối nay có", "Cuối tuần mình nấu", "Ai có kinh nghiệm với", "Mình mới phát hiện", "Căn bếp hôm nay có"];
    private static readonly IReadOnlyDictionary<string, string[]> RecipeNames = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
    {
        ["Món Việt"] = ["Bún bò Huế", "Cơm gà Hội An", "Bún riêu cua đồng", "Mì Quảng gà", "Bánh cuốn Thanh Trì", "Hủ tiếu Nam Vang", "Bún chả Hà Nội", "Bánh canh cua", "Cá kho tộ", "Nem rán miền Bắc"],
        ["Món chay"] = ["Đậu hũ kho nấm", "Cà tím om đậu phụ", "Bún riêu chay", "Gỏi cuốn nấm chay", "Cơm chiên rau củ", "Miến xào nấm chay", "Nấm đùi gà áp chảo", "Đậu phụ sốt cà chua", "Cà ri đậu gà", "Chả giò khoai môn chay"],
        ["Món xào"] = ["Rau muống xào tỏi", "Mì xào bò rau cải", "Bò xào lúc lắc", "Tôm xào bông cải", "Mực xào cần tây", "Gà xào sả ớt", "Đậu que xào trứng", "Nấm xào dầu hào", "Thịt heo xào chua ngọt", "Bò xào hành tây"],
        ["Món nướng"] = ["Gà nướng mật ong", "Sườn nướng sả", "Cá saba nướng giấy bạc", "Bạch tuộc nướng sa tế", "Bắp nướng mỡ hành", "Cá hồi nướng chanh", "Vịt nướng riềng mẻ", "Nấm nướng phô mai", "Cá lóc nướng trui", "Tôm nướng phô mai"],
        ["Món kho"] = ["Thịt kho trứng cút", "Cá basa kho tộ", "Gà kho gừng", "Sườn non kho thơm", "Tôm rim nước dừa", "Trứng kho nước tương", "Thịt bò kho tiêu", "Cá nục kho cà", "Đậu hũ kho nấm rơm", "Thịt ba chỉ kho dừa"],
        ["Món canh"] = ["Canh chua cá lóc", "Canh rau cải thịt bằm", "Canh bí đỏ thịt bằm", "Canh rau ngót nấu tôm", "Canh khổ qua nhồi thịt", "Canh mồng tơi cua đồng", "Canh khoai mỡ tôm tươi", "Canh gà lá giang", "Canh bầu nấu nghêu", "Canh cà chua trứng"],
        ["Món súp"] = ["Súp gà nấm hương", "Súp bí đỏ kem tươi", "Súp cua trứng cút", "Súp bắp non thịt gà", "Súp khoai tây phô mai", "Súp tôm rau củ", "Súp cá hồi thì là", "Súp lơ xanh hạnh nhân", "Súp hải sản tóc tiên", "Súp gà hạt sen"],
        ["Món lẩu"] = ["Lẩu gà lá é", "Lẩu Thái hải sản", "Lẩu bò nhúng giấm", "Lẩu riêu cua bắp bò", "Lẩu nấm chay", "Lẩu cá kèo lá giang", "Lẩu dê thuốc bắc", "Lẩu kim chi Hàn Quốc", "Lẩu mắm miền Tây", "Lẩu vịt om sấu"],
        ["Bánh ngọt"] = ["Bánh bông lan cam", "Bánh tart trứng", "Bánh su kem vani", "Bánh quy bơ hạnh nhân", "Bánh chuối nướng", "Bánh mousse dâu", "Bánh flan caramel", "Bánh cupcake chocolate", "Bánh cheesecake chanh", "Bánh chiffon lá dứa"],
        ["Đồ uống"] = ["Trà đào cam sả", "Sinh tố bơ sữa chua", "Nước ép dứa cần tây", "Sữa đậu nành lá dứa", "Cà phê sữa đá", "Trà tắc mật ong", "Nước ép dưa hấu", "Sinh tố chuối yến mạch", "Matcha latte lạnh", "Trà gừng quế nóng"],
        ["Món ăn nhanh"] = ["Hamburger bò phô mai", "Gà rán giòn cay", "Khoai tây lắc phô mai", "Hotdog xúc xích nướng", "Pizza gà nấm mini", "Sandwich trứng bơ", "Mì trộn bò cay", "Bánh quesadilla gà", "Cơm cuộn cá ngừ", "Taco tôm sốt bơ"],
        ["Món thập cẩm"] = ["Cơm chiên thập cẩm", "Miến lươn trộn rau thơm", "Cháo gà nấm hạt sen", "Mì Quảng tôm thịt", "Bún măng vịt", "Cơm gà xối mỡ", "Bánh đa cua Hải Phòng", "Hủ tiếu bò viên", "Cơm niêu cá kho", "Bún chả cá Nha Trang"],
        ["Món gỏi"] = ["Gỏi đu đủ bò khô", "Gỏi xoài tôm khô", "Gỏi gà bắp cải tím", "Gỏi ngó sen tai heo", "Gỏi củ hủ dừa tôm thịt", "Gỏi bưởi cá hồi", "Gỏi sứa hoa chuối", "Gỏi bò bóp thấu", "Gỏi rau càng cua trứng", "Gỏi cuốn cá hồi"],
        ["Món cay"] = ["Bún bò cay sa tế", "Gà xào ớt xiêm xanh", "Mì kim chi cay", "Tôm rang muối ớt", "Bò sốt tiêu đen cay", "Cá nướng ớt hiểm", "Đậu hũ Tứ Xuyên", "Cánh gà sốt cay Hàn Quốc", "Lẩu Thái cay nồng", "Mực xào sa tế cay"],
        ["Món chiên"] = ["Chả giò tôm thịt", "Cá viên chiên nước mắm", "Đậu hũ chiên sả", "Gà popcorn giòn", "Tôm chiên xù", "Chuối chiên mè", "Khoai môn lệ phố", "Cá basa chiên giòn", "Bánh tôm Hồ Tây", "Mực chiên nước mắm"],
        ["Món hấp"] = ["Cá hấp xì dầu gừng", "Gà hấp lá chanh", "Trứng hấp vân", "Bí đỏ hấp thịt bằm", "Tôm hấp nước dừa", "Bánh bao nhân xá xíu", "Cá diêu hồng hấp hành", "Đậu hũ hấp nấm", "Sườn hấp tàu xì", "Bánh cuốn nhân thịt hấp"],
        ["Món tráng miệng"] = ["Chè khúc bạch nhãn", "Chè đậu đỏ nước cốt dừa", "Tàu hũ gừng nóng", "Rau câu dừa lá dứa", "Panna cotta xoài", "Yaourt nếp cẩm", "Chè sen long nhãn", "Kem chuối đậu phộng", "Bánh flan cà phê", "Thạch trái cây nhiệt đới"],
        ["Bánh mì"] = ["Bánh mì chảo pate trứng", "Bánh mì gà xé sốt bơ", "Bánh mì xíu mại Đà Lạt", "Bánh mì thịt nướng", "Bánh mì cá mòi sốt cà", "Bánh mì chả cá thì là", "Bánh mì bơ tỏi phô mai", "Bánh mì heo quay giòn bì", "Bánh mì trứng ốp la", "Bánh mì nấm áp chảo"],
        ["Món biển"] = ["Tôm sú nướng muối ớt", "Cua rang me", "Mực hấp gừng", "Cá hồi áp chảo sốt chanh", "Nghêu hấp sả", "Bạch tuộc xào cần tỏi", "Cá basa kho nghệ", "Sò điệp nướng mỡ hành", "Tôm rim nước mắm", "Cá thu sốt cà chua"],
        ["Món từ thịt"] = ["Bò lúc lắc khoai tây", "Thịt heo quay da giòn", "Gà hấp hành", "Sườn non nấu đậu", "Bò cuộn phô mai", "Gà rô ti nước dừa", "Thịt viên sốt cà", "Heo xá xíu mật ong", "Bò sốt vang kiểu Bắc", "Gà chiên mắm tỏi"]
    };

    public static async Task SeedAsync(ApplicationDbContext context, ApplicationUser admin)
    {
        // A curated real catalog replaces the generated presentation dataset.
        // Once it is present, never add, rename, normalize or republish demo
        // recipes on application restart.
        if (await context.Recipes.AnyAsync(recipe => !recipe.IsDeleted && recipe.Slug.StartsWith("real-")))
            return;

        // The previous seed revision used the slug as its sole marker. The
        // catalog normalizer could replace that slug, so remove only the
        // second copy that still has the old marker slug, then recognize the
        // original records from their description going forward.
        var accidentalDuplicates = await context.Recipes
            .Where(recipe => recipe.Slug.StartsWith("bep-nha-demo-") && recipe.Description != null && recipe.Description.Contains(LegacyExpandedDescription))
            .ToListAsync();
        if (accidentalDuplicates.Count > 0)
        {
            context.Recipes.RemoveRange(accidentalDuplicates);
            await context.SaveChangesAsync();
        }

        // Restore a representative cover image for the first revision of the
        // expanded set. A legacy catalog normalizer had cleared image URLs
        // before this seeder began protecting its own records.
        var legacyExpanded = await context.Recipes
            .Where(recipe => recipe.Description != null && recipe.Description.Contains(LegacyExpandedDescription) && string.IsNullOrWhiteSpace(recipe.ImageUrl))
            .OrderBy(recipe => recipe.Title)
            .ToListAsync();
        for (var index = 0; index < legacyExpanded.Count; index++) legacyExpanded[index].SetImageUrl(Images[index % Images.Length]);
        if (legacyExpanded.Count > 0) await context.SaveChangesAsync();

        await EnsureMembersAsync(context);
        var users = await context.Users.OrderBy(user => user.UserName).Take(TargetMembers).ToListAsync();
        var authors = users.Where(user => user.Role is "Author" or "Admin").ToList();
        if (authors.Count == 0) authors = [admin];
        var categories = await context.Categories.Where(category => !category.IsDeleted).OrderBy(category => category.Name).ToListAsync();
        if (categories.Count == 0) return;

        await EnsureRecipesAsync(context, categories, authors);
        await EnsureCategoryCoverageAsync(context, categories, authors);
        await EnsurePublicRecipeCoverageAsync(context, categories, authors);
        // The presentation catalog may deliberately keep only a compact set
        // per category. Renaming those rows again can collide with slugs that
        // belong to soft-deleted recipes retained for recovery.
        if (await context.Recipes.CountAsync(recipe => !recipe.IsDeleted) > 300)
            await NormalizeDemoRecipeNamesAsync(context);
        await WikimediaRecipeImageCatalog.ApplyToDemoRecipesAsync(context);
        var recipes = await context.Recipes.Where(recipe => !recipe.IsDeleted).OrderBy(recipe => recipe.CreatedAt).ToListAsync();
        await EnsurePostsAndArticlesAsync(context, users, recipes, admin);
        await EnsureChallengesAsync(context, users, recipes);
        await DataSeeder.EnsureStructuredRecipeContentAsync(context);
        await context.SaveChangesAsync();
    }

    private static async Task EnsureMembersAsync(ApplicationDbContext context)
    {
        var existing = await context.Users.CountAsync();
        if (existing >= TargetMembers) return;
        var hasher = new PasswordHasher<ApplicationUser>();
        for (var index = existing + 1; index <= TargetMembers; index++)
        {
            var username = $"bepnhademo{index:00}";
            if (await context.Users.AnyAsync(user => user.UserName == username)) continue;
            var fullName = $"{Surnames[index % Surnames.Length]} {FirstNames[index % FirstNames.Length]}";
            var user = ApplicationUser.Create(fullName, $"{username}@culinaryblog.test", username);
            user.Role = index % 4 == 0 ? "Author" : "User";
            user.EmailConfirmed = true;
            user.NormalizedEmail = user.Email!.ToUpperInvariant();
            user.NormalizedUserName = username.ToUpperInvariant();
            user.PasswordHash = hasher.HashPassword(user, "BepNha@2026");
            user.AvatarUrl = $"https://i.pravatar.cc/160?img={20 + index}";
            user.Bio = $"Thành viên Bếp Nhà #{index}, yêu món ngon và thích chia sẻ những bữa cơm nhà.";
            context.Users.Add(user);
        }
        await context.SaveChangesAsync();
    }

    private static async Task EnsureRecipesAsync(ApplicationDbContext context, IReadOnlyList<Category> categories, IReadOnlyList<ApplicationUser> authors)
    {
        var existing = await context.Recipes.CountAsync(recipe => recipe.Description != null &&
            (recipe.Description.Contains(ExpandedMarker) || recipe.Description.Contains(LegacyExpandedDescription)));
        if (existing >= ExtraRecipeCount) return;

        var batch = new List<Recipe>();
        for (var index = existing; index < ExtraRecipeCount; index++)
        {
            var category = categories[index % categories.Count];
            var number = index + 1;
            var title = $"{DishBases[index % DishBases.Length]} {category.Name.ToLowerInvariant()} {FlavorNotes[(index / categories.Count) % FlavorNotes.Length]} {number:000}";
            var content = DemoRecipeContentFactory.Create(title, category.Name, number);
            var ingredients = content.Ingredients;
            var instructions = content.Steps;
            var recipe = Recipe.Create(title, $"{ExpandedMarker}. {content.Description}", ingredients, instructions, category.Id, authors[index % authors.Count].Id, Images[index % Images.Length], content.PrepMinutes + content.CookMinutes, content.Difficulty, content.IsVegetarian, content.PrepMinutes, content.CookMinutes, content.Servings);
            recipe.SetSlug($"bep-nha-demo-{number:000}");
            recipe.SetNutrition(new RecipeNutrition(220 + index % 260, 9 + index % 25, 18 + index % 50, 5 + index % 19, 3 + index % 9, 160 + index % 440));
            if (index % 12 != 10)
            {
                recipe.Publish(ingredients.Count, instructions.Count);
                if (index % 24 == 23) recipe.Archive();
            }
            batch.Add(recipe);
            if (batch.Count == 50)
            {
                context.Recipes.AddRange(batch);
                await context.SaveChangesAsync();
                batch.Clear();
            }
        }
        if (batch.Count > 0)
        {
            context.Recipes.AddRange(batch);
            await context.SaveChangesAsync();
        }
    }

    private static string GetRecipeTitle(string categoryName, int sequence)
    {
        var names = RecipeNames.TryGetValue(categoryName, out var values) ? values : ["Món ngon bếp nhà"];
        // The title is only the actual dish name. Do not append marketing or
        // serving-context phrases because they pollute full-text search (for
        // example, searching "cơm" used to return every "bữa cơm tối" item).
        return names[sequence % names.Length];
    }

    private static async Task NormalizeDemoRecipeNamesAsync(ApplicationDbContext context)
    {
        var recipes = await context.Recipes
            .Where(recipe => !recipe.IsDeleted && recipe.Description != null &&
                (recipe.Description.Contains(ExpandedMarker) || recipe.Description.Contains(LegacyExpandedDescription)))
            .Include(recipe => recipe.Category)
            .Include(recipe => recipe.StructuredIngredients)
            .Include(recipe => recipe.StructuredSteps)
            .OrderBy(recipe => recipe.Category.Name).ThenBy(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id)
            .ToListAsync();

        foreach (var group in recipes.GroupBy(recipe => recipe.Category.Name))
        {
            var sequence = 0;
            foreach (var recipe in group)
            {
                var title = GetRecipeTitle(group.Key, sequence++);
                var content = DemoRecipeContentFactory.Create(title, group.Key, sequence);
                recipe.Update(title,
                    $"{ExpandedMarker}. {content.Description}",
                    content.Ingredients, content.Steps, recipe.CategoryId, recipe.ImageUrl,
                    difficulty: content.Difficulty, isVegetarian: content.IsVegetarian,
                    prepTimeMinutes: content.PrepMinutes, cookTimeMinutes: content.CookMinutes, servings: content.Servings);
                recipe.SetSlug($"bep-nha-{Recipe.CreateSlug(title)}-{sequence:00}");

                context.RecipeIngredients.RemoveRange(recipe.StructuredIngredients);
                context.RecipeSteps.RemoveRange(recipe.StructuredSteps);
            }
        }

        if (recipes.Count > 0) await context.SaveChangesAsync();
    }

    private static async Task EnsurePublicRecipeCoverageAsync(ApplicationDbContext context, IReadOnlyList<Category> categories, IReadOnlyList<ApplicationUser> authors)
    {
        const int minimumPublishedRecipesPerCategory = 15;
        foreach (var category in categories)
        {
            var publishedCount = await context.Recipes.CountAsync(recipe => recipe.CategoryId == category.Id && !recipe.IsDeleted && recipe.Status == RecipeStatus.Published);
            if (publishedCount < minimumPublishedRecipesPerCategory)
            {
                // Publish only generated records; real user recipes retain their own status.
                var demoCandidates = await context.Recipes
                    .Where(recipe => recipe.CategoryId == category.Id && !recipe.IsDeleted && recipe.Status != RecipeStatus.Published && recipe.Description != null &&
                        (recipe.Description.Contains(ExpandedMarker) || recipe.Description.Contains(LegacyExpandedDescription)))
                    .OrderBy(recipe => recipe.CreatedAt).ToListAsync();
                foreach (var recipe in demoCandidates)
                {
                    if (recipe.Status == RecipeStatus.Archived) recipe.RestoreToDraft();
                    if (recipe.Status == RecipeStatus.Draft) recipe.Publish(recipe.Ingredients.Count, recipe.Instructions.Count);
                    publishedCount++;
                    if (publishedCount >= minimumPublishedRecipesPerCategory) break;
                }
                await context.SaveChangesAsync();
            }

            var missing = minimumPublishedRecipesPerCategory - publishedCount;
            for (var index = 0; index < missing; index++)
            {
                var title = GetRecipeTitle(category.Name, publishedCount + index);
                var content = DemoRecipeContentFactory.Create(title, category.Name, publishedCount + index);
                var ingredients = content.Ingredients;
                var instructions = content.Steps;
                var recipe = Recipe.Create(title,
                    $"{ExpandedMarker}. {content.Description}",
                    ingredients, instructions, category.Id, authors[index % authors.Count].Id,
                    Images[(publishedCount + index) % Images.Length], content.PrepMinutes + content.CookMinutes,
                    content.Difficulty, content.IsVegetarian,
                    content.PrepMinutes, content.CookMinutes, content.Servings);
                recipe.SetSlug($"bep-nha-{Recipe.CreateSlug(title)}-{publishedCount + index + 1:00}");
                recipe.Publish(ingredients.Count, instructions.Count);
                context.Recipes.Add(recipe);
            }
            if (missing > 0) await context.SaveChangesAsync();
        }
    }

    // A category can be created manually after the first seed run. Keep every
    // visible category useful in the catalog instead of leaving a zero badge.
    private static async Task EnsureCategoryCoverageAsync(ApplicationDbContext context, IReadOnlyList<Category> categories, IReadOnlyList<ApplicationUser> authors)
    {
        const int minimumRecipesPerCategory = 15;
        foreach (var category in categories)
        {
            var count = await context.Recipes.CountAsync(recipe => recipe.CategoryId == category.Id && !recipe.IsDeleted);
            if (count >= minimumRecipesPerCategory) continue;
            var missing = minimumRecipesPerCategory - count;
            var batch = new List<Recipe>();
            for (var index = 0; index < missing; index++)
            {
                var number = count + index + 1;
                var title = $"Gợi ý {category.Name.ToLowerInvariant()} cho bếp nhà {number:00}";
                var content = DemoRecipeContentFactory.Create(title, category.Name, number);
                var ingredients = content.Ingredients;
                var instructions = content.Steps;
                var recipe = Recipe.Create(title, $"{ExpandedMarker}. {content.Description}", ingredients, instructions, category.Id, authors[index % authors.Count].Id, Images[index % Images.Length], content.PrepMinutes + content.CookMinutes, content.Difficulty, content.IsVegetarian, content.PrepMinutes, content.CookMinutes, content.Servings);
                recipe.SetSlug($"bep-nha-category-{category.Id:N}-{number:00}");
                recipe.Publish(ingredients.Count, instructions.Count);
                batch.Add(recipe);
            }
            context.Recipes.AddRange(batch);
            await context.SaveChangesAsync();
        }
    }

    private static async Task EnsurePostsAndArticlesAsync(ApplicationDbContext context, IReadOnlyList<ApplicationUser> users, IReadOnlyList<Recipe> recipes, ApplicationUser admin)
    {
        var postCount = await context.CommunityPosts.CountAsync();
        for (var index = postCount; index < TargetPosts; index++)
        {
            var recipe = recipes[index % recipes.Count];
            context.CommunityPosts.Add(new CommunityPost
            {
                AuthorId = users[index % users.Count].Id,
                Content = $"{PostOpeners[index % PostOpeners.Length]} {recipe.Title.ToLowerInvariant()}. {FlavorNotes[index % FlavorNotes.Length]} nên cả nhà ăn rất ngon. Mọi người có mẹo biến tấu nào không? #{index + 1}",
                MediaUrl = index % 3 == 0 ? recipe.ImageUrl : null,
                MediaType = index % 3 == 0 ? "image" : null,
                CreatedAt = DateTime.UtcNow.AddHours(-index * 3),
                CommentsEnabled = true
            });
        }

        var articleCount = await context.BlogArticles.CountAsync();
        for (var index = articleCount; index < TargetArticles; index++)
        {
            var number = index + 1;
            var title = $"Chuyện bếp nhà #{number:00}: {FlavorNotes[index % FlavorNotes.Length]}";
            context.BlogArticles.Add(BlogArticle.Create(title, $"chuyen-bep-nha-demo-{number:00}", $"Một ghi chú ngắn về {FlavorNotes[index % FlavorNotes.Length]} để việc nấu ăn mỗi ngày nhẹ nhàng hơn.", $"{title}\n\nBắt đầu từ những nguyên liệu có sẵn, chuẩn bị gọn gàng và nêm nếm từng bước. Một thay đổi nhỏ trong căn bếp có thể tạo ra bữa cơm vui hơn cho cả nhà.", Images[index % Images.Length], users[index % users.Count].Id));
        }
        await context.SaveChangesAsync();

        var posts = await context.CommunityPosts.OrderBy(post => post.CreatedAt).ToListAsync();
        var commentCount = await context.PostComments.CountAsync();
        for (var index = commentCount; index < TargetComments && posts.Count > 0; index++)
        {
            var post = posts[index % posts.Count];
            context.PostComments.Add(new PostComment { PostId = post.Id, AuthorId = users[(index + 3) % users.Count].Id, Content = index % 2 == 0 ? "Món này nhìn hấp dẫn quá, mình sẽ thử vào cuối tuần!" : "Cảm ơn bạn đã chia sẻ, mẹo này rất hữu ích.", CreatedAt = post.CreatedAt.AddMinutes(20 + index) });
        }
        await context.SaveChangesAsync();
    }

    private static async Task EnsureChallengesAsync(ApplicationDbContext context, IReadOnlyList<ApplicationUser> users, IReadOnlyList<Recipe> recipes)
    {
        var challengeCount = await context.CookingChallenges.CountAsync();
        for (var index = challengeCount; index < TargetChallenges; index++)
        {
            var number = index + 1;
            context.CookingChallenges.Add(new CookingChallenge { Title = $"Thử thách bếp nhà tuần {number:00}", Theme = $"Chia sẻ một món {FlavorNotes[index % FlavorNotes.Length]} và kể câu chuyện phía sau bữa ăn.", StartsAt = DateTime.UtcNow.Date.AddDays(-number * 7), EndsAt = DateTime.UtcNow.Date.AddDays(-number * 7 + 6) });
        }
        await context.SaveChangesAsync();

        var challenges = await context.CookingChallenges.OrderBy(challenge => challenge.CreatedAt).ToListAsync();
        var submissionCount = await context.ChallengeSubmissions.CountAsync();
        for (var index = submissionCount; index < TargetSubmissions && challenges.Count > 0 && recipes.Count > 0; index++)
        {
            context.ChallengeSubmissions.Add(new ChallengeSubmission { ChallengeId = challenges[index % challenges.Count].Id, RecipeId = recipes[(index * 7) % recipes.Count].Id, UserId = users[(index * 3) % users.Count].Id, SubmittedAt = DateTime.UtcNow.AddDays(-index) });
        }
        await context.SaveChangesAsync();
    }
}
