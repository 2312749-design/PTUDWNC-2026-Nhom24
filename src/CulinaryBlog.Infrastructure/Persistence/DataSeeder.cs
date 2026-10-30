using Bogus;
using CulinaryBlog.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence;

public static class DataSeeder
{
    private static readonly string[] SupplementalIngredientNames =
    [
        "Muối", "Đường", "Tiêu xay", "Dầu ăn", "Hành tím",
        "Tỏi băm", "Rau thơm", "Nước lọc", "Nước cốt chanh", "Gia vị nêm"
    ];

    public static async Task SeedDataAsync(ApplicationDbContext context)
    {
        var passwordHasher = new PasswordHasher<ApplicationUser>();

        var defaultUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@culinaryblog.com" || u.UserName == "chefdemo");
        if (defaultUser == null)
        {
            defaultUser = ApplicationUser.Create("Chef Demo", "admin@culinaryblog.com", "chefdemo");
            defaultUser.Role = "Admin";
            defaultUser.PasswordHash = passwordHasher.HashPassword(defaultUser, "chefdemo");
            await context.Users.AddAsync(defaultUser);
        }

        // Demo credentials and the initial role are assigned only when the
        // account is created. Restarting with seed enabled must not undo an
        // administrator's password change, role change, or security decision.
        await context.SaveChangesAsync();

        var demoUsers = new[]
        {
            new { FullName = "Nguyễn Thị Lan Anh", UserName = "lananh01", Email = "lananh01@culinaryblog.test", Password = "LanAnh@123" },
            new { FullName = "Trần Minh Hoàng", UserName = "minhhoang02", Email = "minhhoang02@culinaryblog.test", Password = "MinhHoang@123" },
            new { FullName = "Lê Thị Hồng Nhung", UserName = "hongnhung03", Email = "hongnhung03@culinaryblog.test", Password = "HongNhung@123" },
            new { FullName = "Phạm Văn Dũng", UserName = "vandung04", Email = "vandung04@culinaryblog.test", Password = "VanDung@123" },
            new { FullName = "Võ Thị Thu Hà", UserName = "thuha05", Email = "thuha05@culinaryblog.test", Password = "ThuHa@123" },
            new { FullName = "Đặng Quốc Nam", UserName = "quocnam06", Email = "quocnam06@culinaryblog.test", Password = "QuocNam@123" },
            new { FullName = "Ngô Bích Ngọc", UserName = "bichngoc07", Email = "bichngoc07@culinaryblog.test", Password = "BichNgoc@123" },
            new { FullName = "Huỳnh Thanh Tùng", UserName = "thanhtung08", Email = "thanhtung08@culinaryblog.test", Password = "ThanhTung@123" },
            new { FullName = "Bùi Thị Mỹ Linh", UserName = "mylinh09", Email = "mylinh09@culinaryblog.test", Password = "MyLinh@123" },
            new { FullName = "Cao Văn Khoa", UserName = "vankhoa10", Email = "vankhoa10@culinaryblog.test", Password = "VanKhoa@123" },
            new { FullName = "Mai Xuân Thảo", UserName = "xuanthao11", Email = "xuanthao11@culinaryblog.test", Password = "XuanThao@123" },
            new { FullName = "Lý Đức Huy", UserName = "duchuy12", Email = "duchuy12@culinaryblog.test", Password = "DucHuy@123" },
            new { FullName = "Nguyễn Thảo Vy", UserName = "thaovy13", Email = "thaovy13@culinaryblog.test", Password = "ThaoVy@123" },
            new { FullName = "Phan Hữu Long", UserName = "huulong14", Email = "huulong14@culinaryblog.test", Password = "HuuLong@123" },
            new { FullName = "Trương Kim Chi", UserName = "kimchi15", Email = "kimchi15@culinaryblog.test", Password = "KimChi@123" },
            new { FullName = "Hồ Nhật Minh", UserName = "nhatminh16", Email = "nhatminh16@culinaryblog.test", Password = "NhatMinh@123" },
            new { FullName = "Đỗ Thị Yến Nhi", UserName = "yennhi17", Email = "yennhi17@culinaryblog.test", Password = "YenNhi@123" },
            new { FullName = "Kiều Anh Tú", UserName = "anhtu18", Email = "anhtu18@culinaryblog.test", Password = "AnhTu@123" },
            new { FullName = "Tạ Văn Hưng", UserName = "vanhung19", Email = "vanhung19@culinaryblog.test", Password = "VanHung@123" },
            new { FullName = "Nguyễn Thanh Trúc", UserName = "thanhtruc20", Email = "thanhtruc20@culinaryblog.test", Password = "ThanhTruc@123" }
        };

        foreach (var seed in demoUsers)
        {
            var exists = await context.Users.AnyAsync(u => u.Email == seed.Email || u.UserName == seed.UserName);
            if (exists)
            {
                continue;
            }

            var newUser = ApplicationUser.Create(seed.FullName, seed.Email, seed.UserName);
            newUser.Role = "User";
            newUser.EmailConfirmed = true;
            newUser.PasswordHash = passwordHasher.HashPassword(newUser, seed.Password);
            await context.Users.AddAsync(newUser);
        }

        await context.SaveChangesAsync();

        defaultUser = await context.Users.FirstAsync(u => u.Email == "admin@culinaryblog.com" || u.UserName == "chefdemo");

        var hasCategories = await context.Categories.AnyAsync();
        var hasRecipes = await context.Recipes.AnyAsync();

        if (hasCategories || hasRecipes)
        {
            // Existing databases used to return here, leaving legacy recipes with
            // only JSON/string arrays. Always normalize before exiting so the
            // structured Ingredient/Step APIs can render every older recipe.
            await EnsureStructuredRecipeContentAsync(context);
            await context.SaveChangesAsync();
            return;
        }

        var categorySeed = new[]
        {
            new { Name = "Món Việt", Description = "Các món ăn truyền thống, đậm hương vị Việt Nam." },
            new { Name = "Món chay", Description = "Món ăn thanh đạm, giàu dinh dưỡng và dễ ăn cho mọi đối tượng." },
            new { Name = "Món xào", Description = "Món xào nhanh, thơm ngon và phù hợp cho bữa tối gia đình." },
            new { Name = "Món nướng", Description = "Món nướng thơm lừng, có hương khói và vị ngọt tự nhiên." },
            new { Name = "Món kho", Description = "Món kho đậm đà, nấu chậm để giữ hương vị đặc trưng." },
            new { Name = "Món canh", Description = "Canh thanh mát, bổ dưỡng và dễ kết hợp với cơm trắng." },
            new { Name = "Món súp", Description = "Súp nóng, mềm và thích hợp cho những ngày thời tiết se lạnh." },
            new { Name = "Món lẩu", Description = "Lẩu đậm vị, ấm áp và rất hợp cho tiệc gia đình." },
            new { Name = "Bánh ngọt", Description = "Những món bánh ngọt hấp dẫn, thơm béo và dễ làm." },
            new { Name = "Đồ uống", Description = "Đồ uống mát lạnh và nóng, giúp bữa ăn thêm phong phú." },
            new { Name = "Món ăn nhanh", Description = "Món ăn ít tốn thời gian nhưng vẫn chắc hương vị và dinh dưỡng." },
            new { Name = "Món thập cẩm", Description = "Món đa nguyên liệu, phù hợp cho bữa ăn gia đình và tiệc tùng." },
            new { Name = "Món gỏi", Description = "Các món gỏi tươi mát, thanh mát và giàu rau củ." },
            new { Name = "Món cay", Description = "Món ăn đậm vị cay, kích thích vị giác và hương thơm." },
            new { Name = "Món chiên", Description = "Món chiên giòn, đậm vị và rất được ưa chuộng." },
            new { Name = "Món hấp", Description = "Món hấp giữ nguyên hương vị tự nhiên và mềm mịn." },
            new { Name = "Món tráng miệng", Description = "Món ăn ngọt nhẹ, tạo cảm giác thỏa mãn sau bữa ăn." },
            new { Name = "Bánh mì", Description = "Cách chế biến bánh mì sáng, ngon và tiện lợi cho bữa ăn thường ngày." },
            new { Name = "Món biển", Description = "Món ăn từ hải sản, phong phú và giàu protein." },
            new { Name = "Món từ thịt", Description = "Các món chế biến từ thịt và gia cầm, đậm đà, hấp dẫn." }
        };

        var categories = categorySeed
            .Select(c => Category.Create(c.Name, c.Description, null))
            .ToList();

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();

        var recipeTemplates = new[]
        {
            new
            {
                Title = "Bún chả Hà Nội",
                Description = "Bún chả Hà Nội với thịt nướng thơm lừng, bún tươi và nước chấm chua ngọt đặc trưng.",
                Ingredients = new[] { "200g thịt bò xay", "150g thịt lợn nướng", "1 bát bún tươi", "1 ít rau sống", "2 thìa nước mắm", "1 thìa đường", "1 quả chanh", "1 củ hành tím" },
                Instructions = new[] { "Bước 1: Ướp thịt bò và thịt lợn với gia vị, đường, mắm, tiêu và hành tỏi.", "Bước 2: Nướng thịt trên bếp than cho vàng và thơm.", "Bước 3: Pha nước chấm chua ngọt với chanh, đường và nước mắm.", "Bước 4: Xếp bún vào bát, thêm thịt nướng, rau sống và chan nước chấm." }
            },
            new
            {
                Title = "Phở bò Nam Định",
                Description = "Phở bò truyền thống với nước dùng ngọt từ xương, thịt bò mềm và hương thơm của quế, gừng.",
                Ingredients = new[] { "500g xương bò", "200g thịt bò tái", "1 bánh phở", "1 củ gừng", "3 quýt hành", "2 nhánh quế", "1 thìa hạt ngò" },
                Instructions = new[] { "Bước 1: Đun xương bò cùng gừng và quế để lấy nước dùng trong và ngọt.", "Bước 2: Chần sơ bánh phở, bỏ vào bát.", "Bước 3: Thả thịt bò và hành thơm vào nồi nước dùng.", "Bước 4: Trình bày với bánh phở, thịt bò, hành, ngò và chanh." }
            },
            new
            {
                Title = "Cơm tấm sườn nướng",
                Description = "Cơm tấm với sườn nướng, trứng ốp la và dưa leo, mang hương vị quen thuộc của miền Nam.",
                Ingredients = new[] { "2 bát cơm tấm", "200g sườn heo", "2 trứng gà", "1 ít dưa leo", "1 thìa nước mắm", "1 thìa mật ong", "1 ít rau thơm" },
                Instructions = new[] { "Bước 1: Ướp sườn heo với nước mắm, đường, mật ong, tỏi và tiêu.", "Bước 2: Nướng sườn chín mềm, có màu vàng đẹp.", "Bước 3: Chiên trứng ốp la chín vừa.", "Bước 4: Xếp cơm tấm ra đĩa, kèm sườn, trứng và rau sống." }
            },
            new
            {
                Title = "Canh chua cá rô đồng",
                Description = "Canh chua cá rô đồng với me, đậu bắp và cà chua, cay nhẹ, chua thanh.",
                Ingredients = new[] { "300g cá rô đồng", "1 quả cà chua", "100g đậu bắp", "1 nhánh rau thơm", "2 thìa me xử", "1 lát gừng", "1 nhánh hành lá" },
                Instructions = new[] { "Bước 1: Làm sạch cá, chấm muối và rửa lại với nước.", "Bước 2: Nấu nước dùng với me, cà chua và gừng.", "Bước 3: Thả cá vào nấu cho săn, rồi thêm đậu bắp.", "Bước 4: Nêm lại gia vị, thưởng thức với rau thơm." }
            },
            new
            {
                Title = "Gỏi cuốn tôm thịt",
                Description = "Gỏi cuốn thanh mát, chứa tôm, thịt, bún và rau sống, ăn kèm nước chấm đậm vị.",
                Ingredients = new[] { "10 chiếc bánh tráng", "100g bún tươi", "100g tôm luộc", "100g thịt heo luộc", "1 ít rau sống", "1 quả dưa leo", "1 ít rau húng lủi" },
                Instructions = new[] { "Bước 1: Ngâm bánh tráng mềm và chuẩn bị nguyên liệu.", "Bước 2: Xếp rau, bún, thịt và tôm lên bánh tráng.", "Bước 3: Gói kín lại vừa tay.", "Bước 4: Dùng với nước chấm mắm tỏi và chanh." }
            },
            new
            {
                Title = "Mì xào hải sản",
                Description = "Mì xào hải sản thơm nức với tôm, mực, đậu que và sốt bơ tỏi.",
                Ingredients = new[] { "200g mì sợi", "150g tôm", "100g mực", "100g đậu que", "2 tép tỏi", "1 thìa bơ", "1 thìa tương ớt", "1 thìa dầu hào" },
                Instructions = new[] { "Bước 1: Luộc mì tới mức chín vừa, vớt ra rổ cho ráo.", "Bước 2: Xào tỏi với dầu và bơ cho thơm.", "Bước 3: Thêm hải sản, đậu que và mì vào xào đều.", "Bước 4: Nêm tương ớt, dầu hào và thưởng thức nóng." }
            },
            new
            {
                Title = "Bánh xèo miền Trung",
                Description = "Bánh xèo giòn tan, nhân tôm thịt và giá đỗ, ăn kèm rau sống và nước chấm.",
                Ingredients = new[] { "150g bột bánh xèo", "100g tôm", "100g thịt heo", "100g giá đỗ", "1 củ hành lá", "1 ít nước cốt dừa", "1 chén nước lạnh" },
                Instructions = new[] { "Bước 1: Trộn bột với nước cốt dừa và nước lạnh cho mịn.", "Bước 2: Phi hành thơm, cho tôm thịt vào xào sơ.", "Bước 3: Đổ bột lên chảo, cho nhân lên và nướng cho vàng.", "Bước 4: Gấp bánh xèo lại và ăn kèm rau sống." }
            },
            new
            {
                Title = "Cà ri gà Việt Nam",
                Description = "Cà ri gà với sữa dừa, khoai tây và cà rốt, hương vị béo thơm và đậm đà.",
                Ingredients = new[] { "500g gà ta", "1 củ khoai tây", "2 củ cà rốt", "1 hộp sữa dừa", "2 thìa bột cà ri", "1 củ hành tím", "1 ít rau thơm" },
                Instructions = new[] { "Bước 1: Ướp gà với hành, tỏi, muối và tiêu.", "Bước 2: Phi bột cà ri với dầu cho thơm.", "Bước 3: Cho gà, khoai tây và cà rốt vào xào cùng bột cà ri.", "Bước 4: Thêm sữa dừa và ninh nhỏ lửa đến khi mềm." }
            },
            new
            {
                Title = "Chè bưởi",
                Description = "Chè bưởi mát lạnh với bưởi, đậu xanh và sữa đặc, thơm ngon và giải nhiệt.",
                Ingredients = new[] { "200g bưởi tươi", "100g đậu xanh", "200ml sữa đặc", "200ml nước cốt dừa", "1 ít đá", "1 thìa đường", "1 ít vừng rang" },
                Instructions = new[] { "Bước 1: Nấu đậu xanh cho mềm rồi để nguội.", "Bước 2: Cắt bưởi thành miếng vừa ăn.", "Bước 3: Trộn bưởi, đậu xanh, sữa đặc, nước cốt dừa và đá.", "Bước 4: Rắc vừng rang trước khi thưởng thức." }
            },
            new
            {
                Title = "Sinh tố xoài",
                Description = "Sinh tố xoài mát lạnh, ngọt thanh, giàu vitamin và rất phù hợp cho buổi chiều nắng nóng.",
                Ingredients = new[] { "2 trái xoài chín", "200ml sữa tươi", "1 hộp yogurt", "1 ít đá viên", "2 thìa đường", "1 ít nước lọc" },
                Instructions = new[] { "Bước 1: Gọt xoài, bỏ hạt và cắt nhỏ.", "Bước 2: Cho xoài, sữa tươi, yogurt và đường vào máy xay.", "Bước 3: Xay nhuyễn, thêm đá và xay tiếp cho mịn.", "Bước 4: Rót ra ly, thưởng thức ngay khi còn lạnh." }
            }
        };

        var recipeNumber = 0;
        var recipeFaker = new Faker<Recipe>("vi")
            .CustomInstantiator(f =>
            {
                var template = f.PickRandom(recipeTemplates);
                var ingredientList = template.Ingredients.ToList();
                var instructionList = template.Instructions.ToList();

                var recipe = Recipe.Create(
                    title: template.Title,
                    description: template.Description,
                    ingredients: ingredientList,
                    instructions: instructionList,
                    categoryId: f.PickRandom(categories).Id,
                    authorId: defaultUser.Id
                );

                // Titles intentionally repeat so RecipeCatalogSeeder can later
                // replace legacy duplicates. Keep their URL slugs unique from
                // the very first save, otherwise a fresh database violates the
                // unique Slug index before that catalog pass can run.
                recipe.SetSlug($"{recipe.Slug}-{++recipeNumber:D3}");
                return recipe;
            });

        var recipes = recipeFaker.Generate(100);
        await context.Recipes.AddRangeAsync(recipes);
        await context.SaveChangesAsync();

        await EnsureStructuredRecipeContentAsync(context);
        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Migrates legacy recipe string arrays into the structured recipe-content
    /// tables without duplicating data on subsequent application starts.
    /// </summary>
    public static async Task EnsureStructuredRecipeContentAsync(ApplicationDbContext context)
    {
        var persistedRecipes = await context.Recipes
            .Where(recipe => !recipe.IsDeleted)
            .ToListAsync();
        var addedRecipes = context.ChangeTracker.Entries<Recipe>()
            .Where(entry => entry.State == EntityState.Added && !entry.Entity.IsDeleted)
            .Select(entry => entry.Entity)
            .ToList();
        var recipes = persistedRecipes
            .Concat(addedRecipes)
            .GroupBy(recipe => recipe.Id)
            .Select(group => group.First())
            .ToList();

        if (recipes.Count == 0)
        {
            return;
        }

        var recipeIds = recipes.Select(recipe => recipe.Id).ToHashSet();
        var persistedIngredients = await context.RecipeIngredients
            .Where(ingredient => recipeIds.Contains(ingredient.RecipeId))
            .OrderBy(ingredient => ingredient.OrderIndex)
            .ToListAsync();
        var addedIngredients = context.ChangeTracker.Entries<RecipeIngredient>()
            .Where(entry => entry.State == EntityState.Added && recipeIds.Contains(entry.Entity.RecipeId))
            .Select(entry => entry.Entity)
            .ToList();
        var ingredientsByRecipe = persistedIngredients
            .Concat(addedIngredients)
            .GroupBy(ingredient => ingredient.Id)
            .Select(group => group.First())
            .GroupBy(ingredient => ingredient.RecipeId)
            .ToDictionary(group => group.Key, group => group.OrderBy(ingredient => ingredient.OrderIndex).ToList());

        var persistedSteps = await context.RecipeSteps
            .Where(step => recipeIds.Contains(step.RecipeId))
            .OrderBy(step => step.StepNumber)
            .ToListAsync();
        var addedSteps = context.ChangeTracker.Entries<RecipeStep>()
            .Where(entry => entry.State == EntityState.Added && recipeIds.Contains(entry.Entity.RecipeId))
            .Select(entry => entry.Entity)
            .ToList();
        var stepsByRecipe = persistedSteps
            .Concat(addedSteps)
            .GroupBy(step => step.Id)
            .Select(group => group.First())
            .GroupBy(step => step.RecipeId)
            .ToDictionary(group => group.Key, group => group.OrderBy(step => step.StepNumber).ToList());

        foreach (var recipe in recipes)
        {
            var legacyIngredients = NormalizeLines(recipe.Ingredients);
            var legacyInstructions = NormalizeLines(recipe.Instructions);

            EnsureLegacyMinimums(legacyIngredients, legacyInstructions);
            EnsureStructuredIngredients(context, recipe, legacyIngredients,
                ingredientsByRecipe.GetValueOrDefault(recipe.Id) ?? []);
            EnsureStructuredSteps(context, recipe, legacyInstructions,
                stepsByRecipe.GetValueOrDefault(recipe.Id) ?? []);

            // Keep the original arrays valid too, because older callers and
            // search indexing still read these persisted columns.
            if (!recipe.Ingredients.SequenceEqual(legacyIngredients) || !recipe.Instructions.SequenceEqual(legacyInstructions))
            {
                var existingSlug = recipe.Slug;
                recipe.Update(
                    recipe.Title,
                    recipe.Description,
                    legacyIngredients,
                    legacyInstructions,
                    recipe.CategoryId,
                    recipe.ImageUrl,
                    recipe.CookingTimeMinutes,
                    recipe.Difficulty,
                    recipe.IsVegetarian,
                    recipe.PrepTimeMinutes,
                    recipe.CookTimeMinutes,
                    recipe.Servings);

                // Recipe.Update derives a title slug. Preserve a previously
                // unique slug when legacy seed records intentionally share a
                // title so the normalizer never violates the unique index.
                if (!string.IsNullOrWhiteSpace(existingSlug))
                {
                    recipe.SetSlug(existingSlug);
                }
            }
        }
    }

    private static void EnsureStructuredIngredients(
        ApplicationDbContext context,
        Recipe recipe,
        IReadOnlyCollection<string> legacyIngredients,
        IReadOnlyCollection<RecipeIngredient> existingIngredients)
    {
        var validIngredients = existingIngredients
            .Where(ingredient => !string.IsNullOrWhiteSpace(ingredient.Name))
            .ToList();
        var names = validIngredients
            .Select(ingredient => ingredient.Name.Trim())
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        var nextOrderIndex = existingIngredients.Count == 0
            ? 1
            : existingIngredients.Max(ingredient => ingredient.OrderIndex) + 1;

        void AddIngredient(string name, string? quantity = null, string? unit = null, string? notes = null)
        {
            var ingredient = RecipeIngredient.Create(
                recipe.Id,
                name,
                quantity,
                unit,
                notes,
                nextOrderIndex++);
            context.RecipeIngredients.Add(ingredient);
            names.Add(name.Trim());
            validIngredients.Add(ingredient);
        }

        foreach (var legacyIngredient in legacyIngredients)
        {
            if (names.Add(legacyIngredient))
            {
                AddIngredient(legacyIngredient, notes: "Nội dung được chuyển từ công thức cũ.");
            }
        }

        var supplementIndex = 0;
        while (validIngredients.Count < Recipe.MinimumIngredientCount)
        {
            var baseName = SupplementalIngredientNames[supplementIndex % SupplementalIngredientNames.Length];
            var name = baseName;
            var duplicateNumber = 2;
            while (names.Contains(name))
            {
                name = $"{baseName} ({duplicateNumber++})";
            }

            AddIngredient(name, "vừa đủ", notes: "Nguyên liệu bổ sung cho công thức đầy đủ.");
            supplementIndex++;
        }
    }

    private static void EnsureStructuredSteps(
        ApplicationDbContext context,
        Recipe recipe,
        IReadOnlyCollection<string> legacyInstructions,
        IReadOnlyCollection<RecipeStep> existingSteps)
    {
        var validSteps = existingSteps
            .Where(step => !string.IsNullOrWhiteSpace(step.Description))
            .ToList();
        var descriptions = validSteps
            .Select(step => step.Description.Trim())
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        var nextStepNumber = existingSteps.Count == 0
            ? 1
            : existingSteps.Max(step => step.StepNumber) + 1;

        void AddStep(string description, string? title = null)
        {
            var step = RecipeStep.Create(
                recipe.Id,
                title ?? $"Bước {nextStepNumber}",
                description,
                nextStepNumber++,
                null,
                null);
            context.RecipeSteps.Add(step);
            descriptions.Add(description.Trim());
            validSteps.Add(step);
        }

        foreach (var legacyInstruction in legacyInstructions)
        {
            if (descriptions.Add(legacyInstruction))
            {
                AddStep(legacyInstruction, $"Bước {nextStepNumber}");
            }
        }

        while (validSteps.Count < Recipe.MinimumStepCount)
        {
            var description = $"Hoàn thiện món ở bước {nextStepNumber}: nêm nếm vừa ăn, trình bày đẹp mắt và dùng khi còn nóng.";
            AddStep(description);
        }
    }

    private static void EnsureLegacyMinimums(List<string> ingredients, List<string> instructions)
    {
        var supplementIndex = 0;
        while (ingredients.Count < Recipe.MinimumIngredientCount)
        {
            var baseName = SupplementalIngredientNames[supplementIndex % SupplementalIngredientNames.Length];
            var ingredient = baseName;
            var duplicateNumber = 2;
            while (ingredients.Contains(ingredient, StringComparer.OrdinalIgnoreCase))
            {
                ingredient = $"{baseName} ({duplicateNumber++})";
            }

            ingredients.Add(ingredient);
            supplementIndex++;
        }

        while (instructions.Count < Recipe.MinimumStepCount)
        {
            instructions.Add($"Bước {instructions.Count + 1}: Hoàn thiện món, nêm nếm vừa ăn và trình bày trước khi dùng.");
        }
    }

    private static List<string> NormalizeLines(IEnumerable<string>? values) => values?
        .Where(value => !string.IsNullOrWhiteSpace(value))
        .Select(value => value.Trim())
        .ToList() ?? [];
}
