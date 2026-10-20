using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence;

/// <summary>
/// Adds realistic, repeatable local demo content. Every item has a stable title
/// or slug, so starting the application again never duplicates the sample data.
/// </summary>
public static class DemoActivitySeeder
{
    private static readonly string[] FoodImages =
    [
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85"
    ];

    private static readonly (string Title, string Category, string Diet)[] DemoRecipes =
    [
        ("Cơm gà xé rau răm cho ngày bận rộn", "Món Việt", "cân bằng"),
        ("Đậu hũ sốt nấm tiêu xanh", "Món chay", "thuần chay"),
        ("Mì udon xào rau củ", "Món xào", "ít dầu"),
        ("Cá hồi nướng sốt chanh vàng", "Món nướng", "giàu đạm"),
        ("Thịt ba chỉ kho trứng cút", "Món kho", "gia đình"),
        ("Canh bí đỏ tôm tươi", "Món canh", "nhẹ bụng"),
        ("Súp gà ngô non", "Món súp", "phục hồi"),
        ("Lẩu nấm chua cay cuối tuần", "Món lẩu", "chia sẻ"),
        ("Bánh chuối yến mạch không đường", "Bánh ngọt", "eat clean"),
        ("Trà đào cam sả mật ong", "Đồ uống", "ít ngọt"),
        ("Sandwich ức gà bơ nghiền", "Món ăn nhanh", "healthy"),
        ("Cơm rang kimchi trứng lòng đào", "Món thập cẩm", "nhanh gọn"),
        ("Gỏi bưởi tôm nướng", "Món gỏi", "tươi nhẹ"),
        ("Gà sốt cay kiểu Hàn", "Món cay", "đậm vị"),
        ("Đậu bắp chiên giòn sốt mè", "Món chiên", "chay"),
        ("Cá diêu hồng hấp hành gừng", "Món hấp", "ít dầu"),
        ("Panna cotta xoài hạt chia", "Món tráng miệng", "ít ngọt"),
        ("Bánh mì nấm áp chảo", "Bánh mì", "thuần chay"),
        ("Tôm áp chảo sốt bơ tỏi", "Món biển", "giàu đạm"),
        ("Bò cuộn rau củ nướng", "Món từ thịt", "low carb"),
        ("Miến trộn nấm đậu phụ", "Món chay", "thuần chay"),
        ("Chè khúc bạch nhãn tươi", "Món tráng miệng", "tráng miệng"),
        ("Nước ép cần tây táo xanh", "Đồ uống", "detox"),
        ("Bún cá thì là cà chua", "Món Việt", "cân bằng")
    ];

    private static readonly (string Title, string Summary)[] Articles =
    [
        ("Nấu một nồi nước dùng trong veo mà không cần quá nhiều xương", "Ba bước nhỏ để nước dùng thanh, thơm và dễ biến tấu cho bún, phở hoặc canh."),
        ("Bữa cơm 4 món trong 45 phút: cách chia bếp cho đỡ rối", "Gợi ý thứ tự sơ chế và nấu để bữa tối gia đình vẫn đủ món vào ngày thường."),
        ("Chọn rau theo mùa: vừa ngon hơn vừa tiết kiệm", "Một giỏ rau đúng mùa luôn là điểm bắt đầu dễ nhất cho căn bếp nhỏ."),
        ("Mẹo giữ rau thơm tươi cả tuần trong tủ lạnh", "Không cần dụng cụ cầu kỳ, chỉ cần đúng độ ẩm và một chiếc khăn giấy."),
        ("Một hũ sốt mè rang dùng được cho ba bữa", "Trộn salad, chấm rau hoặc làm sốt mì đều hợp với công thức nền này."),
        ("Nấu cho một người: đừng để tủ lạnh thành áp lực", "Cách chọn nguyên liệu, chia phần và tận dụng đồ còn lại thật nhẹ nhàng."),
        ("Bếp thơm hơn với hành phi tự làm", "Một mẻ hành phi vàng giòn giúp món xôi, mì hay cơm nhà hấp dẫn hơn hẳn."),
        ("Cân bằng vị chua, mặn, ngọt trong món kho", "Ghi nhớ tỷ lệ đơn giản để nồi kho nào cũng đậm đà mà không gắt vị."),
        ("Bữa sáng cuối tuần với bánh mì nóng và một ly trà", "Một thực đơn chậm rãi để cả nhà bắt đầu ngày nghỉ thật ngon."),
        ("Chụp món ăn bằng điện thoại: tìm góc sáng trong chính căn bếp", "Ánh sáng cửa sổ và vài vật dụng quen thuộc đã đủ cho một khung hình đẹp."),
        ("Tự làm sổ tay gia vị cho gia đình", "Ghi lại những tổ hợp gia vị thành công để lần sau nấu nhanh và tự tin hơn."),
        ("Khi công thức trở thành câu chuyện của cả nhà", "Mỗi lần nấu lại một món quen là một lần thêm vào đó ký ức rất riêng.")
    ];

    private static readonly string[] Posts =
    [
        "Sáng nay thử thay đường bằng một ít táo xay trong ly sinh tố, vị dịu mà vẫn rất thơm. Mọi người còn mẹo nào để đồ uống ít ngọt không?",
        "Mẻ bánh chuối yến mạch đầu tiên đã thành công ngoài mong đợi. Nhà mình ăn hết veo trước khi kịp để nguội!",
        "Cuối tuần này mình nấu lẩu nấm chua cay, ai có gợi ý loại rau nào nhúng ngon thì chia sẻ giúp mình với.",
        "Món canh bí đỏ tôm này là công thức của mẹ. Chỉ cần thêm chút tiêu xay là cả bếp thơm lắm.",
        "Hôm nay mình làm meal prep cho ba ngày: ức gà, rau củ nướng và cơm gạo lứt. Nhẹ đầu hẳn khi không phải nghĩ ăn gì.",
        "Có ai cũng thích ăn bánh mì nóng giòn với bơ tỏi vào những sáng mưa như mình không?",
        "Vừa học được mẹo cho muối vào nấm sau khi nấm săn lại, nấm không ra nước nhiều nữa. Chia sẻ lại cho mọi người nè.",
        "Bữa cơm tối nay chỉ có cá hấp, rau luộc và chén nước mắm gừng mà ai cũng khen ngon.",
        "Mình đang tập làm các món chay. Đậu hũ sốt nấm là món đầu tiên khiến cả nhà xin nấu lại.",
        "Một buổi chiều dọn tủ lạnh và tìm được rất nhiều nguyên liệu hay ho. Thế là có ngay một đĩa mì xào rau củ.",
        "Ai có công thức sốt salad mè rang ngon mà không quá béo cho mình xin với ạ.",
        "Tự tay làm hành phi rồi mới hiểu vì sao món ăn nhà mình thơm hơn hẳn. Dù hơi mất công nhưng rất đáng.",
        "Hôm nay con trai mình phụ nhặt rau lần đầu. Bữa cơm vì thế vui hơn mọi ngày rất nhiều.",
        "Mẻ panna cotta xoài có hơi mềm nhưng vị ngon. Lần sau mình sẽ giảm phần nước xoài một chút.",
        "Mọi người thường nấu món gì nhanh nhất khi tan làm muộn? Mình đang hết ý tưởng cho bữa tối 30 phút.",
        "Chia sẻ niềm vui nhỏ: cuối cùng mình cũng nấu được nồi thịt kho lên màu đẹp mà không bị khét.",
        "Đầu tuần ăn nhẹ nhàng với gỏi bưởi tôm nướng. Vị chua ngọt làm mình tỉnh táo hẳn.",
        "Một ly trà đào cam sả lạnh là đủ để cứu buổi chiều nóng. Mình thêm rất ít mật ong thôi.",
        "Nhờ mọi người trong nhóm mà mình biết cách nấu nước dùng trong hơn. Cảm ơn cả nhà nhiều!",
        "Tối nay thử bún cá thì là cà chua. Mùi thì là quyện cùng cá thơm quá nên phải đăng bài khoe ngay."
    ];

    public static async Task SeedAsync(ApplicationDbContext context, ApplicationUser admin)
    {
        var users = await context.Users.OrderBy(user => user.UserName).Take(20).ToListAsync();
        if (users.Count == 0) return;

        for (var index = 0; index < users.Count; index++)
        {
            users[index].AvatarUrl ??= $"https://i.pravatar.cc/160?img={index + 12}";
            users[index].Bio ??= $"Yêu bếp, thích thử món mới và chia sẻ những bữa ăn giản dị mỗi ngày. Thành viên Bếp Nhà #{index + 1}.";
        }

        var categories = await context.Categories.Where(category => !category.IsDeleted).ToListAsync();
        var categoryByName = categories.ToDictionary(category => category.Name, StringComparer.OrdinalIgnoreCase);
        var existingRecipeTitles = await context.Recipes.Select(recipe => recipe.Title).ToListAsync();
        var titleSet = existingRecipeTitles.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var difficulties = new[] { "Easy", "Medium", "Hard", "Expert" };

        for (var index = 0; index < DemoRecipes.Length; index++)
        {
            var demo = DemoRecipes[index];
            if (titleSet.Contains(demo.Title) || !categoryByName.TryGetValue(demo.Category, out var category)) continue;

            var recipe = Recipe.Create(
                demo.Title,
                $"Công thức {demo.Diet} với nguyên liệu dễ tìm, hướng dẫn rõ ràng và phù hợp cho bữa ăn hằng ngày.",
                ["Nguyên liệu chính 300g", "Rau củ theo mùa", "Tỏi, hành và gia vị", "Dầu ăn hoặc dầu ô liu"],
                ["Sơ chế nguyên liệu và chuẩn bị gia vị.", "Làm nóng chảo hoặc nồi, nấu phần nguyên liệu chính.", "Thêm rau củ, nêm vừa ăn rồi trình bày."],
                category.Id,
                admin.Id,
                FoodImages[index % FoodImages.Length],
                cookingTimeMinutes: 20 + index * 3 % 40,
                difficulty: difficulties[index % difficulties.Length],
                isVegetarian: demo.Diet is "thuần chay" or "chay" or "eat clean",
                prepTimeMinutes: 8 + index % 12,
                cookTimeMinutes: 12 + index % 25,
                servings: 2 + index % 4);

            recipe.SetNutrition(new RecipeNutrition(260 + index * 12, 10 + index % 18, 18 + index % 28, 6 + index % 15, 3 + index % 8, 180 + index * 10));
            if (index % 3 == 1) recipe.Publish(true, true);
            if (index % 3 == 2)
            {
                recipe.Publish(true, true);
                recipe.Archive();
            }
            context.Recipes.Add(recipe);
        }

        var existingSlugs = await context.BlogArticles.Select(article => article.Slug).ToListAsync();
        for (var index = 0; index < Articles.Length; index++)
        {
            var slug = $"chuyen-trong-bep-{index + 1:00}";
            if (existingSlugs.Contains(slug, StringComparer.OrdinalIgnoreCase)) continue;
            var article = Articles[index];
            context.BlogArticles.Add(BlogArticle.Create(
                article.Title,
                slug,
                article.Summary,
                $"{article.Summary}\n\nĐây là câu chuyện nhỏ từ căn bếp Bếp Nhà. Hãy thử điều chỉnh theo nguyên liệu và khẩu vị của gia đình bạn, sau đó ghi lại điều đã hiệu quả để lần sau nấu nhanh hơn.",
                FoodImages[index % FoodImages.Length],
                users[index % users.Count].Id));
        }

        var existingPostContents = await context.CommunityPosts.Select(post => post.Content).ToListAsync();
        var seededPosts = new List<CommunityPost>();
        for (var index = 0; index < Posts.Length; index++)
        {
            if (existingPostContents.Contains(Posts[index], StringComparer.Ordinal)) continue;
            var post = new CommunityPost
            {
                AuthorId = users[index % users.Count].Id,
                Content = Posts[index],
                MediaUrl = index % 4 == 0 ? FoodImages[index % FoodImages.Length] : null,
                MediaType = index % 4 == 0 ? "image" : null,
                CreatedAt = DateTime.UtcNow.AddHours(-index * 5 - 1),
                CommentsEnabled = true
            };
            context.CommunityPosts.Add(post);
            seededPosts.Add(post);
        }

        await context.SaveChangesAsync();

        foreach (var post in seededPosts)
        {
            var postIndex = seededPosts.IndexOf(post);
            for (var likeOffset = 1; likeOffset <= 3; likeOffset++)
            {
                var user = users[(postIndex + likeOffset) % users.Count];
                context.PostLikes.Add(new PostLike { PostId = post.Id, UserId = user.Id, CreatedAt = post.CreatedAt.AddMinutes(likeOffset * 12) });
            }
            var commenter = users[(postIndex + 4) % users.Count];
            context.PostComments.Add(new PostComment
            {
                PostId = post.Id,
                AuthorId = commenter.Id,
                Content = postIndex % 2 == 0 ? "Nghe hấp dẫn quá, mình sẽ thử vào cuối tuần này!" : "Cảm ơn bạn đã chia sẻ, mẹo này rất hữu ích cho mình.",
                CreatedAt = post.CreatedAt.AddMinutes(45)
            });
        }

        await context.SaveChangesAsync();
    }
}
