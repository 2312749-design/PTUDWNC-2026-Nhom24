using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace CulinaryBlog.Infrastructure.Persistence;

internal sealed record WikimediaRecipeImage
{
    public WikimediaRecipeImage(string imageUrl, string sourcePageUrl)
    {
        ImageUrl = ToDirectThumbnailUrl(imageUrl);
        SourcePageUrl = sourcePageUrl;
    }

    public string ImageUrl { get; }
    public string SourcePageUrl { get; }

    private static string ToDirectThumbnailUrl(string redirectUrl)
    {
        const string marker = "/file/";
        var markerIndex = redirectUrl.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
        if (markerIndex < 0) return redirectUrl;

        var encodedFileName = redirectUrl[(markerIndex + marker.Length)..].Split('?', 2)[0];
        var fileName = Uri.UnescapeDataString(encodedFileName).Replace(' ', '_');
        var hash = Convert.ToHexStringLower(MD5.HashData(Encoding.UTF8.GetBytes(fileName)));
        var encodedPath = Uri.EscapeDataString(fileName);
        return $"https://upload.wikimedia.org/wikipedia/commons/thumb/{hash[0]}/{hash[..2]}/{encodedPath}/960px-{encodedPath}";
    }
}

internal static class WikimediaRecipeImageCatalog
{
    private static readonly IReadOnlyDictionary<string, WikimediaRecipeImage> Items =
        new Dictionary<string, WikimediaRecipeImage>(StringComparer.OrdinalIgnoreCase)
    {
        ["Bánh canh cua"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/B%C3%A1nh_canh_cua.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AB%C3%A1nh_canh_cua.jpg"),
        ["Bánh cuốn Thanh Trì"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/B%C3%A1nh_cu%E1%BB%91n_Thanh_Tr%C3%AC.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AB%C3%A1nh_cu%E1%BB%91n_Thanh_Tr%C3%AC.jpg"),
        ["Bánh đa cua Hải Phòng"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/B%C3%A1nh_%C4%91a_cua_H%E1%BA%A3i_Ph%C3%B2ng_%2827.2_%284%29.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AB%C3%A1nh_%C4%91a_cua_H%E1%BA%A3i_Ph%C3%B2ng_%2827.2_%284%29.jpg"),
        ["Bánh mì thịt nướng"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/B%C3%A1nh_m%C3%AC_th%E1%BB%8Bt_n%C6%B0%E1%BB%9Bng.png?width=1200", "https://commons.wikimedia.org/wiki/File%3AB%C3%A1nh_m%C3%AC_th%E1%BB%8Bt_n%C6%B0%E1%BB%9Bng.png"),
        ["Bánh tôm Hồ Tây"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/L%E1%BB%85_h%E1%BB%99i_%E1%BA%A9m_th%E1%BB%B1c_C%E1%BB%ADa_Vi%E1%BB%87t_th4n2023_%C4%91%E1%BA%B7c_s%E1%BA%A3n_b%C3%A1nh_t%C3%B4m_H%E1%BB%93_T%C3%A2y_%289%29.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AL%E1%BB%85_h%E1%BB%99i_%E1%BA%A9m_th%E1%BB%B1c_C%E1%BB%ADa_Vi%E1%BB%87t_th4n2023_%C4%91%E1%BA%B7c_s%E1%BA%A3n_b%C3%A1nh_t%C3%B4m_H%E1%BB%93_T%C3%A2y_%289%29.jpg"),
        ["Bò né chảo gang"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/B%C3%B2_n%C3%A9_ch%E1%BA%A3o_gang_ng21th7n2023_%281%29.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AB%C3%B2_n%C3%A9_ch%E1%BA%A3o_gang_ng21th7n2023_%281%29.jpg"),
        ["Bún bò Huế"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/B%C3%BAn_b%C3%B2_Hu%E1%BA%BF.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AB%C3%BAn_b%C3%B2_Hu%E1%BA%BF.jpg"),
        ["Bún chả Hà Nội"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/B%C3%BAn_Ch%E1%BA%A3_H%C3%A0_N%E1%BB%99i%2C_Vi%E1%BB%87t_Nam.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AB%C3%BAn_Ch%E1%BA%A3_H%C3%A0_N%E1%BB%99i%2C_Vi%E1%BB%87t_Nam.jpg"),
        ["Bún thịt nướng sả"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Saigon_Bun_thit_nuong.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3ASaigon_Bun_thit_nuong.jpg"),
        ["Cá kho tộ"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/C%C3%A1_kho_t%E1%BB%99%2C_c%C3%A1_h%C3%BA.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AC%C3%A1_kho_t%E1%BB%99%2C_c%C3%A1_h%C3%BA.jpg"),
        ["Cá lóc nướng trui"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/C%C3%A1_l%C3%B3c_%C4%91%E1%BB%93ng_n%C6%B0%E1%BB%9Bng_trui.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AC%C3%A1_l%C3%B3c_%C4%91%E1%BB%93ng_n%C6%B0%E1%BB%9Bng_trui.jpg"),
        ["Cà phê sữa đá"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/C%C3%A0_Ph%C3%AA_S%E1%BB%AFa_%C4%90%C3%A1_-_%C4%90%E1%BA%B7c_tr%C6%B0ng_c%E1%BB%A7a_Vi%E1%BB%87t_Nam.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AC%C3%A0_Ph%C3%AA_S%E1%BB%AFa_%C4%90%C3%A1_-_%C4%90%E1%BA%B7c_tr%C6%B0ng_c%E1%BB%A7a_Vi%E1%BB%87t_Nam.jpg"),
        ["Canh chua cá lóc"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Canh_chua_c%C3%A1_l%C3%B3c_%E1%BB%9F_Th%E1%BB%A7y_Tr%C3%BAc_Qu%C3%A1n%2C_%C4%91%C6%B0%E1%BB%9Dng_Nguy%E1%BB%85n_Nh%E1%BB%AF_L%C3%A3m_%281%29.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3ACanh_chua_c%C3%A1_l%C3%B3c_%E1%BB%9F_Th%E1%BB%A7y_Tr%C3%BAc_Qu%C3%A1n%2C_%C4%91%C6%B0%E1%BB%9Dng_Nguy%E1%BB%85n_Nh%E1%BB%AF_L%C3%A3m_%281%29.jpg"),
        ["Canh khổ qua nhồi thịt"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Canh_kh%E1%BB%95_qua_nh%E1%BB%93i_th%E1%BB%8Bt.png?width=1200", "https://commons.wikimedia.org/wiki/File%3ACanh_kh%E1%BB%95_qua_nh%E1%BB%93i_th%E1%BB%8Bt.png"),
        ["Chả cá Lã Vọng"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Ch%E1%BA%A3_c%C3%A1_L%C3%A3_V%E1%BB%8Dng.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3ACh%E1%BA%A3_c%C3%A1_L%C3%A3_V%E1%BB%8Dng.jpg"),
        ["Chè bưởi"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Coc_che_buoi.jpeg?width=1200", "https://commons.wikimedia.org/wiki/File%3ACoc_che_buoi.jpeg"),
        ["Cơm gà Hội An"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Com_ga_Viet_Nam_voi_ga_luoc_com_vang_va_nuoc_cham.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3ACom_ga_Viet_Nam_voi_ga_luoc_com_vang_va_nuoc_cham.jpg"),
        ["Cơm tấm sườn nướng"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/C%C6%A1m_t%E1%BA%A5m_SG_l%E1%BB%81_%C4%91%C6%B0%E1%BB%9Dng_%28c%C6%A1m_s%C6%B0%E1%BB%9Dn%2C_mi%E1%BA%BFng_s%C6%B0%E1%BB%9Dn_n%C6%B0%E1%BB%9Bng_m%E1%BA%ADt_ong%29_ng30th7n2022_%283%29.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AC%C6%A1m_t%E1%BA%A5m_SG_l%E1%BB%81_%C4%91%C6%B0%E1%BB%9Dng_%28c%C6%A1m_s%C6%B0%E1%BB%9Dn%2C_mi%E1%BA%BFng_s%C6%B0%E1%BB%9Dn_n%C6%B0%E1%BB%9Bng_m%E1%BA%ADt_ong%29_ng30th7n2022_%283%29.jpg"),
        ["Gà nướng mật ong"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/G%C3%A0_n%C6%B0%E1%BB%9Bng_m%E1%BA%ADt_ong_v%C3%A0_heo_quay_%E1%BB%9F_BigC_ng%C3%A0y_12_th%C3%A1ng_5_n%C4%83m_2021_%281%29.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AG%C3%A0_n%C6%B0%E1%BB%9Bng_m%E1%BA%ADt_ong_v%C3%A0_heo_quay_%E1%BB%9F_BigC_ng%C3%A0y_12_th%C3%A1ng_5_n%C4%83m_2021_%281%29.jpg"),
        ["Gỏi cuốn tôm thịt"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Vietnamese_spring_roll.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AVietnamese_spring_roll.jpg"),
        ["Hủ tiếu Nam Vang"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/H%E1%BB%A7_ti%E1%BA%BFu_Nam_Vang.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AH%E1%BB%A7_ti%E1%BA%BFu_Nam_Vang.jpg"),
        ["Matcha latte lạnh"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Matcha_latte.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AMatcha_latte.jpg"),
        ["Mì Quảng gà"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Mi_Quang_1A_Danang.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AMi_Quang_1A_Danang.jpg"),
        ["Nghêu hấp sả"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/M%C3%B3n_%C4%83n_C%E1%BB%ADa_Vi%E1%BB%87t%2C_T%E1%BA%BFt_2022_%28ngh%C3%AAu_h%E1%BA%A5p_s%E1%BA%A3_n%C6%B0%E1%BB%9Bc_lai_l%C3%A1ng_trong_d%C4%A9a%29_%282%29.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AM%C3%B3n_%C4%83n_C%E1%BB%ADa_Vi%E1%BB%87t%2C_T%E1%BA%BFt_2022_%28ngh%C3%AAu_h%E1%BA%A5p_s%E1%BA%A3_n%C6%B0%E1%BB%9Bc_lai_l%C3%A1ng_trong_d%C4%A9a%29_%282%29.jpg"),
        ["Nước ép dưa hấu"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/N%C6%B0%E1%BB%9Bc_%C3%A9p_d%C6%B0a_h%E1%BA%A5u_t%E1%BA%A1i_ch%C3%A8_th%C3%A1i_Th%E1%BA%A3o_Vy_ng%C3%A0y_05_th%C3%A1ng_4_n%C4%83m_2019_%281%29.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AN%C6%B0%E1%BB%9Bc_%C3%A9p_d%C6%B0a_h%E1%BA%A5u_t%E1%BA%A1i_ch%C3%A8_th%C3%A1i_Th%E1%BA%A3o_Vy_ng%C3%A0y_05_th%C3%A1ng_4_n%C4%83m_2019_%281%29.jpg"),
        ["Phở bò Nam Định"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Vietnamese_Ph%E1%BB%9F.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AVietnamese_Ph%E1%BB%9F.jpg"),
        ["Rau muống xào tỏi"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Rau_mu%E1%BB%91ng_x%C3%A0o_t%E1%BB%8Fi%2C_th%C3%A1ng_4_n%C4%83m_2018.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3ARau_mu%E1%BB%91ng_x%C3%A0o_t%E1%BB%8Fi%2C_th%C3%A1ng_4_n%C4%83m_2018.jpg"),
        ["Tôm kho quẹt"] = new("https://commons.wikimedia.org/wiki/Special:Redirect/file/Kho_qu%E1%BA%B9t.jpg?width=1200", "https://commons.wikimedia.org/wiki/File%3AKho_qu%E1%BA%B9t.jpg"),
    };

    public static bool TryGet(string title, out WikimediaRecipeImage image) =>
        Items.TryGetValue(title, out image!);

    public static async Task ApplyToDemoRecipesAsync(ApplicationDbContext context)
    {
        var titles = Items.Keys.ToArray();
        var recipes = await context.Recipes
            .Where(recipe => !recipe.IsDeleted && titles.Contains(recipe.Title))
            .ToListAsync();

        foreach (var recipe in recipes)
        {
            if (TryGet(recipe.Title, out var image) && IsDemoPlaceholder(recipe.ImageUrl))
                recipe.SetImageUrl(image.ImageUrl);
        }

        if (recipes.Count > 0) await context.SaveChangesAsync();
    }

    private static bool IsDemoPlaceholder(string? imageUrl) =>
        string.IsNullOrWhiteSpace(imageUrl) ||
        imageUrl.StartsWith("https://images.unsplash.com/", StringComparison.OrdinalIgnoreCase) ||
        imageUrl.StartsWith("https://commons.wikimedia.org/wiki/Special:Redirect/file/", StringComparison.OrdinalIgnoreCase) ||
        imageUrl.StartsWith("https://upload.wikimedia.org/wikipedia/commons/thumb/", StringComparison.OrdinalIgnoreCase);
}

