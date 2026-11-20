namespace CulinaryBlog.Infrastructure.Persistence;

internal sealed record DemoRecipeContent(
    List<string> Ingredients,
    List<string> Steps,
    int PrepMinutes,
    int CookMinutes,
    string Difficulty,
    int Servings,
    bool IsVegetarian,
    string Description);

/// <summary>
/// Produces coherent demo content. Exact named drinks have their own tested
/// ratios; other dishes use a cooking-method template instead of the former
/// one-size-fits-all ingredient list.
/// </summary>
internal static class DemoRecipeContentFactory
{
    public static DemoRecipeContent Create(string title, string category, int variation = 0)
    {
        var baseTitle = StripStyle(title);
        return baseTitle switch
        {
            "Sữa đậu nành lá dứa" => Content(
                ["200g đậu nành khô", "1.5 lít nước lọc", "4 lá dứa", "70g đường phèn (tùy khẩu vị)", "1/4 thìa cà phê muối"],
                ["Nhặt bỏ hạt đậu hỏng, rửa sạch rồi ngâm đậu nành trong nhiều nước từ 6–8 giờ hoặc qua đêm.", "Xả lại đậu đã nở, chà nhẹ và đãi bớt vỏ để sữa thơm, ít chát.", "Chia đậu thành nhiều mẻ, xay thật nhuyễn với tổng cộng 1.5 lít nước lọc.", "Lọc hỗn hợp qua túi vải sạch, vắt kỹ để thu phần sữa; bỏ bã hoặc giữ lại làm món khác.", "Rửa lá dứa, buộc gọn. Cho sữa và lá dứa vào nồi đáy dày.", "Đun lửa vừa và khuấy sát đáy liên tục đến khi sữa bắt đầu sôi; hạ nhỏ lửa, hớt bọt.", "Nấu liu riu thêm 15–20 phút để đậu chín hoàn toàn, vẫn khuấy đều để không khê hoặc trào.", "Cho đường phèn và muối vào, khuấy tan rồi nếm lại. Vớt lá dứa, tắt bếp.", "Dùng nóng hoặc để nguội nhanh, rót vào chai sạch và bảo quản lạnh tối đa 2 ngày."],
                20, 25, "Easy", 6, true, "Sữa đậu nành béo nhẹ, thơm lá dứa, được xay lọc và nấu chín kỹ; thời gian ngâm đậu 6–8 giờ là thời gian chờ và không tính vào 45 phút thao tác."),
            "Trà đào cam sả" => Content(
                ["2 túi trà đào hoặc 8g hồng trà", "500ml nước", "2 nhánh sả", "1 quả cam vàng", "4 miếng đào ngâm", "40ml nước đào ngâm", "25g đường", "300g đá viên"],
                ["Rửa sả, đập dập và cắt khúc; cam rửa sạch, cắt 3 lát mỏng, phần còn lại vắt lấy nước.", "Đun 500ml nước với sả trong 5 phút rồi tắt bếp, để nước hạ còn khoảng 85–90°C.", "Cho trà vào ủ 5–7 phút, lấy túi trà hoặc lọc bã để trà không bị chát.", "Khi trà còn ấm, hòa tan đường và nước đào ngâm.", "Để trà nguội bớt rồi thêm nước cam; không cho nước cam vào lúc quá nóng để tránh vị đắng.", "Cho đào, lát cam và đá vào bình, rót trà sả vào rồi khuấy đều.", "Nếm lại vị chua ngọt và dùng ngay khi lạnh."],
                10, 12, "Easy", 4, true, "Trà đào thơm dịu, có vị cam tươi và sả; pha đúng nhiệt độ để trà không chát."),
            "Sinh tố bơ sữa chua" => Content(
                ["2 quả bơ sáp chín (khoảng 350g thịt bơ)", "2 hũ sữa chua không đường", "120ml sữa tươi không đường", "40ml sữa đặc", "1 thìa cà phê nước cốt chanh", "200g đá viên"],
                ["Bổ bơ, bỏ hạt, dùng thìa lấy phần thịt; loại bỏ phần thâm hoặc xơ.", "Cho bơ, sữa chua, sữa tươi, sữa đặc và nước cốt chanh vào máy xay.", "Xay 30 giây ở tốc độ thấp, vét thành cối để hỗn hợp hòa đều.", "Thêm đá và xay tốc độ cao 45–60 giây đến khi mịn đặc.", "Nếm và điều chỉnh độ ngọt bằng sữa đặc; rót ra ly và dùng ngay."],
                10, 2, "Easy", 3, true, "Sinh tố bơ mịn béo, cân bằng bằng sữa chua và một chút chanh để không bị ngấy."),
            "Nước ép dứa cần tây" => Content(
                ["1/2 quả dứa chín (khoảng 450g)", "4 nhánh cần tây (khoảng 180g)", "1/2 quả chanh", "10g gừng tươi", "100ml nước lọc", "Đá viên tùy thích"],
                ["Rửa kỹ cần tây, đặc biệt phần gốc; ngâm nước sạch rồi để ráo.", "Gọt dứa, bỏ mắt và phần lõi quá cứng, cắt miếng vừa miệng máy ép.", "Cắt cần tây thành khúc 4–5cm; cạo vỏ gừng và tách hạt chanh.", "Ép xen kẽ dứa, cần tây và gừng để máy chạy đều.", "Khuấy nước ép với nước cốt chanh và nước lọc; nếm lại.", "Rót ra ly có đá và dùng ngay để giữ hương vị tươi."],
                15, 0, "Easy", 2, true, "Nước ép dứa cần tây chua ngọt, thơm gừng và không sử dụng gia vị nấu ăn."),
            "Cà phê sữa đá" => Content(
                ["50g cà phê rang xay pha phin", "50ml sữa đặc", "120ml nước nóng 92–96°C", "180g đá viên"],
                ["Tráng phin và ly bằng nước nóng, cho sữa đặc vào đáy ly.", "Cho cà phê vào phin, lắc phẳng rồi đặt nắp gài và nén nhẹ.", "Châm 25ml nước nóng, ủ 30–45 giây để cà phê nở đều.", "Châm phần nước còn lại, đậy nắp và chờ cà phê nhỏ hết trong 5–7 phút.", "Khuấy cà phê với sữa đặc, rót vào ly đá và dùng ngay."],
                3, 8, "Easy", 1, true, "Cà phê phin đậm vị, cân bằng với sữa đặc và đá lạnh."),
            "Trà tắc mật ong" => Content(
                ["10g trà lài hoặc trà xanh", "500ml nước nóng 85°C", "6 quả tắc", "45ml mật ong", "20g đường phèn", "250g đá viên"],
                ["Rửa tắc, cắt đôi; vắt lấy nước và bỏ hạt để trà không đắng.", "Ủ trà với nước 85°C trong 5 phút rồi lọc bỏ lá trà.", "Hòa đường phèn khi trà còn ấm, sau đó để nguội dưới 60°C.", "Cho mật ong và nước tắc vào, khuấy đều rồi nếm lại.", "Thêm vài lát tắc, rót trà qua đá và dùng ngay."],
                8, 5, "Easy", 4, true, "Trà tắc chua dịu, thơm mật ong; mật ong được cho vào khi trà đã bớt nóng."),
            "Nước ép dưa hấu" => Content(
                ["800g thịt dưa hấu không vỏ", "1/2 quả chanh", "6 lá bạc hà", "Đá viên tùy thích"],
                ["Bỏ vỏ và hạt cứng của dưa hấu, cắt miếng vừa.", "Cho dưa hấu vào máy ép; nếu dùng máy xay thì xay nhuyễn rồi lọc theo độ mịn mong muốn.", "Vắt nước chanh, khuấy đều với nước dưa hấu.", "Rót ra ly, thêm bạc hà và đá rồi dùng ngay."],
                8, 0, "Easy", 3, true, "Nước ép dưa hấu tươi, không cần thêm đường khi dưa đã chín ngọt."),
            "Sinh tố chuối yến mạch" => Content(
                ["2 quả chuối chín", "40g yến mạch cán dẹt", "300ml sữa tươi", "1 hũ sữa chua không đường", "15ml mật ong", "1/4 thìa cà phê bột quế", "150g đá viên"],
                ["Ngâm yến mạch với 100ml sữa trong 10 phút cho mềm.", "Bóc chuối, cắt khoanh và cho vào cối xay.", "Thêm yến mạch đã ngâm, phần sữa còn lại, sữa chua, mật ong và bột quế.", "Xay mịn trong 45 giây, thêm đá rồi xay tiếp đến khi đồng nhất.", "Rót ra ly và dùng ngay; có thể rắc ít yến mạch lên mặt."],
                12, 1, "Easy", 2, true, "Sinh tố chuối yến mạch sánh mịn, phù hợp cho bữa sáng nhanh."),
            "Matcha latte lạnh" => Content(
                ["6g bột matcha", "60ml nước nóng 75–80°C", "300ml sữa tươi", "30ml siro đường", "200g đá viên"],
                ["Rây matcha vào bát để loại bỏ vón cục.", "Thêm nước 75–80°C, dùng chổi hoặc phới nhỏ đánh theo hình chữ W đến khi mịn và nổi bọt.", "Cho siro đường và sữa tươi vào ly, khuấy đều.", "Thêm đầy đá rồi rót matcha từ từ lên trên.", "Khuấy trước khi uống và điều chỉnh độ ngọt nếu cần."],
                7, 0, "Easy", 2, true, "Matcha latte lạnh có lớp trà xanh thơm, không dùng nước sôi để tránh vị đắng gắt."),
            "Trà gừng quế nóng" => Content(
                ["30g gừng tươi", "2 thanh quế nhỏ", "700ml nước", "45ml mật ong", "1/2 quả chanh"],
                ["Rửa gừng, cạo sạch vỏ và thái lát mỏng; bẻ quế thành khúc.", "Cho gừng, quế và nước vào nồi, đun sôi.", "Hạ nhỏ lửa, đậy hé nắp và nấu 10 phút để ra hương.", "Lọc trà, để nguội xuống dưới 60°C rồi mới khuấy mật ong.", "Thêm nước cốt chanh, rót ra cốc và dùng khi còn ấm."],
                5, 12, "Easy", 3, true, "Trà gừng quế ấm thơm, mật ong được thêm sau khi nước bớt nóng."),
            _ => CreateByMethod(baseTitle, category, variation)
        };
    }

    private static DemoRecipeContent CreateByMethod(string title, string category, int variation)
    {
        if (category.Contains("canh", StringComparison.OrdinalIgnoreCase) || category.Contains("súp", StringComparison.OrdinalIgnoreCase) || category.Contains("lẩu", StringComparison.OrdinalIgnoreCase))
            return Content([$"600g nguyên liệu chính cho {title}", "1.2 lít nước dùng", "200g rau củ phù hợp", "2 củ hành tím", "2 nhánh hành lá", "1 thìa canh nước mắm hoặc nước tương", "1 thìa cà phê muối", "1/2 thìa cà phê đường", "1/4 thìa cà phê tiêu"], ["Sơ chế riêng từng nguyên liệu, rửa sạch và cắt đúng kích thước ăn.", "Chuẩn bị nước dùng; hớt bọt để nước trong.", "Phi thơm hành, cho nguyên liệu cần lâu chín vào trước.", "Châm nước dùng và nấu lửa vừa đến khi nguyên liệu gần mềm.", "Thêm rau củ nhanh chín, tiếp tục nấu vừa chín tới.", "Nêm nước mắm hoặc nước tương, muối và đường cho cân bằng.", "Tắt bếp, thêm hành tiêu và dùng nóng."], 20, 35 + variation % 20, variation % 3 == 0 ? "Medium" : "Easy", 4, category.Contains("chay", StringComparison.OrdinalIgnoreCase), $"{title} có nước dùng trong, nguyên liệu được cho vào đúng thứ tự để chín đều.");
        if (category.Equals("Bánh ngọt", StringComparison.OrdinalIgnoreCase) || category.Contains("tráng miệng", StringComparison.OrdinalIgnoreCase))
            return Content([$"250g nguyên liệu nền cho {title}", "120g đường", "2 quả trứng", "180ml sữa hoặc nước cốt dừa", "40g bơ lạt", "1/2 thìa cà phê muối", "1 thìa cà phê vani"], ["Cân chính xác toàn bộ nguyên liệu và chuẩn bị khuôn sạch.", "Trộn riêng nguyên liệu khô, rây mịn để không vón.", "Đánh đều nguyên liệu ướt nhưng không tạo quá nhiều bọt.", "Cho phần khô vào phần ướt từng ít một, trộn đến vừa hòa quyện.", "Làm nóng thiết bị nướng hoặc chuẩn bị nồi hấp theo món.", "Đổ hỗn hợp vào khuôn và làm chín đến khi phần giữa ổn định.", "Để nguội đúng thời gian rồi mới lấy khỏi khuôn.", "Trang trí vừa phải, chia phần và bảo quản kín."], 25, 40 + variation % 25, "Medium", 6, true, $"{title} dùng định lượng rõ ràng và quy trình trộn, làm chín, làm nguội theo thứ tự.");
        if (category.Contains("gỏi", StringComparison.OrdinalIgnoreCase))
            return Content([$"400g nguyên liệu chính cho {title}", "250g rau củ thái sợi", "50g rau thơm", "40ml nước mắm", "35g đường", "40ml nước cốt chanh", "2 tép tỏi", "1 quả ớt", "30g đậu phộng rang"], ["Sơ chế nguyên liệu chính và làm chín hoàn toàn nếu là thịt hoặc hải sản.", "Rửa rau củ, để thật ráo rồi thái sợi đồng đều.", "Giã tỏi ớt, hòa với đường, nước mắm và nước cốt chanh thành nước trộn.", "Cho nguyên liệu chính và rau củ vào tô lớn.", "Rưới từng phần nước trộn, đảo nhẹ và nếm trước khi thêm tiếp.", "Để thấm 5 phút, chắt bỏ phần nước dư nếu có.", "Thêm rau thơm và đậu phộng ngay trước khi dùng."], 25, 10, "Easy", 4, category.Contains("chay", StringComparison.OrdinalIgnoreCase), $"{title} giòn tươi, nước trộn chua ngọt được thêm vừa đủ ngay trước khi dùng.");
        if (category.Equals("Bánh mì", StringComparison.OrdinalIgnoreCase))
            return Content(["4 ổ bánh mì Việt Nam", $"500g phần nhân phù hợp cho {title}", "1 quả dưa leo", "100g đồ chua cà rốt củ cải", "40g rau mùi", "2 quả ớt", "80ml nước sốt theo món", "20g bơ hoặc mayonnaise"], ["Chuẩn bị phần nhân đúng theo tên món và làm chín hoàn toàn.", "Pha nước sốt, nếm cân bằng vị mặn, ngọt và chua.", "Rửa dưa leo và rau mùi, để ráo; cắt dưa leo thành lát dài.", "Làm nóng bánh mì 3–5 phút để vỏ giòn, ruột vẫn mềm.", "Rạch dọc ổ bánh, phết một lớp bơ hoặc mayonnaise mỏng.", "Xếp nhân nóng, dưa leo, đồ chua và rau mùi vào bánh.", "Rưới lượng sốt vừa đủ, thêm ớt tùy khẩu vị và dùng ngay."], 20, 20 + variation % 15, "Easy", 4, title.Contains("nấm", StringComparison.OrdinalIgnoreCase), $"{title} có bánh giòn, nhân nóng và rau đồ chua cân bằng vị.");
        var isVegetarian = category.Contains("chay", StringComparison.OrdinalIgnoreCase);
        return Content([$"500g nguyên liệu chính cho {title}", "200g rau củ ăn kèm", "3 tép tỏi", "2 củ hành tím", "1 thìa canh dầu ăn", isVegetarian ? "2 thìa canh nước tương" : "1 thìa canh nước mắm", "1 thìa cà phê đường", "1/2 thìa cà phê muối", "1/3 thìa cà phê tiêu", "30g hành lá hoặc rau thơm"], ["Sơ chế nguyên liệu chính đúng đặc tính của món, rửa sạch và để ráo.", "Cắt nguyên liệu thành miếng đồng đều để chín cùng lúc.", "Pha riêng phần gia vị gồm nước mắm hoặc nước tương, đường, muối và tiêu.", "Ướp nguyên liệu chính với một nửa hỗn hợp gia vị trong 15 phút.", "Làm nóng dụng cụ nấu phù hợp với món, cho hành tỏi vào tạo mùi thơm.", "Cho nguyên liệu chính vào chế biến, điều chỉnh nhiệt để mặt ngoài vàng nhưng bên trong không khô.", "Thêm rau củ theo thứ tự từ lâu chín đến nhanh chín.", "Cho phần gia vị còn lại vào, đảo hoặc rim đến khi nguyên liệu chín hoàn toàn.", "Nếm lại, tắt bếp và thêm hành lá hoặc rau thơm.", "Trình bày gọn, dùng ở nhiệt độ phù hợp với món."], 25, 30 + variation % 30, variation % 4 == 0 ? "Hard" : "Medium", 4, isVegetarian, $"{title} được hướng dẫn theo quy trình sơ chế, nêm ướp và kiểm soát nhiệt rõ ràng.");
    }

    private static string StripStyle(string title)
    {
        string[] styles = [" kiểu gia đình", " nấu tại nhà", " cho bữa cơm tối", " phiên bản ít dầu"];
        foreach (var style in styles)
            if (title.EndsWith(style, StringComparison.OrdinalIgnoreCase)) return title[..^style.Length];
        return title;
    }

    private static DemoRecipeContent Content(List<string> ingredients, List<string> steps, int prep, int cook, string difficulty, int servings, bool vegetarian, string description)
    {
        // Lab 2 requires at least ten ingredient rows per seeded recipe. Keep
        // the core recipe exact, then add clearly optional, usable additions
        // instead of meaningless numbered filler rows.
        var drink = description.Contains("trà", StringComparison.OrdinalIgnoreCase)
            || description.Contains("sữa", StringComparison.OrdinalIgnoreCase)
            || description.Contains("sinh tố", StringComparison.OrdinalIgnoreCase)
            || description.Contains("nước ép", StringComparison.OrdinalIgnoreCase)
            || description.Contains("cà phê", StringComparison.OrdinalIgnoreCase)
            || description.Contains("matcha", StringComparison.OrdinalIgnoreCase);
        var optional = drink
            ? new[]
            {
                "Đá viên để dùng lạnh (tùy chọn)", "10ml siro đường để điều chỉnh độ ngọt (tùy chọn)",
                "1 lát chanh trang trí (tùy chọn)", "2 lá bạc hà trang trí (tùy chọn)",
                "1 nhúm muối nhỏ để cân bằng vị (tùy chọn)", "50ml nước lọc để điều chỉnh độ đậm (tùy chọn)"
            }
            : new[]
            {
                "50ml nước lọc để điều chỉnh độ sệt (tùy chọn)", "1 quả chanh dùng khi nêm cuối (tùy chọn)",
                "20g rau thơm ăn kèm (tùy chọn)", "1 quả ớt tươi (tùy chọn)",
                "1 thìa cà phê mè rang (tùy chọn)", "30g hành phi dùng khi trình bày (tùy chọn)"
            };
        foreach (var item in optional)
        {
            if (ingredients.Count >= 10) break;
            if (!ingredients.Contains(item, StringComparer.OrdinalIgnoreCase)) ingredients.Add(item);
        }
        if (steps.Count < 5)
        {
            steps.Add(drink
                ? "Nếm lại, điều chỉnh độ đậm hoặc độ ngọt theo khẩu vị rồi dùng ngay để giữ hương vị tươi."
                : "Nếm lại lần cuối, trình bày gọn và dùng món ở nhiệt độ phù hợp.");
        }
        return new DemoRecipeContent(ingredients, steps, prep, cook, difficulty, servings, vegetarian, description);
    }
}
