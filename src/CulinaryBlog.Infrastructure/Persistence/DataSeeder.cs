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

        var hasCategories = await context.Categories.AnyAsync();
        var hasRecipes = await context.Recipes.AnyAsync();

        if (hasCategories || hasRecipes)
        {
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
            .Select(c => new Category
            {
                Id = Guid.NewGuid(),
                Name = c.Name,
                Description = c.Description
            })
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

        var recipeFaker = new Faker<Recipe>("vi")
            .CustomInstantiator(f =>
            {
                var template = f.PickRandom(recipeTemplates);
                var ingredientList = template.Ingredients.ToList();
                var instructionList = template.Instructions.ToList();

                return Recipe.Create(
                    title: template.Title,
                    description: template.Description,
                    ingredients: ingredientList,
                    instructions: instructionList,
                    categoryId: f.PickRandom(categories).Id,
                    authorId: defaultUser.Id
                );
            });

        var recipes = recipeFaker.Generate(100);
        await context.Recipes.AddRangeAsync(recipes);
        await context.SaveChangesAsync();
    }
}