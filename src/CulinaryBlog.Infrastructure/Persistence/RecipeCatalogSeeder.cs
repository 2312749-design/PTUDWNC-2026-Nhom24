using CulinaryBlog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.Infrastructure.Persistence;

public static class RecipeCatalogSeeder
{
    private static readonly (string Name, string Description)[] CategoryCatalog =
    [
        ("Món Việt", "Công thức món ăn truyền thống và đặc sản các vùng miền Việt Nam."),
        ("Món chay", "Món chay thanh đạm, nhiều rau củ và đạm thực vật."),
        ("Món xào", "Các món xào nhanh trên lửa lớn, giữ rau củ giòn ngon."),
        ("Món nướng", "Món nướng thơm ngon từ bếp than, lò nướng hoặc nồi chiên."),
        ("Món kho", "Món kho đậm đà, thích hợp dùng cùng cơm nóng."),
        ("Món canh", "Các món canh thanh mát cho bữa cơm gia đình."),
        ("Món súp", "Món súp nóng, mềm mịn và giàu dinh dưỡng."),
        ("Món lẩu", "Các món lẩu và nước dùng dùng chung tại bàn."),
        ("Bánh ngọt", "Bánh ngọt và món bánh dùng trong bữa ăn nhẹ."),
        ("Đồ uống", "Thức uống nóng, lạnh và sinh tố trái cây."),
        ("Món ăn nhanh", "Món ăn nhanh gọn cho bữa ăn bận rộn."),
        ("Món thập cẩm", "Món kết hợp nhiều nguyên liệu cho bữa ăn đầy đủ."),
        ("Món gỏi", "Món gỏi và cuốn tươi mát, ăn kèm rau thơm."),
        ("Món cay", "Món ăn có vị cay nổi bật từ ớt và gia vị."),
        ("Món chiên", "Món chiên vàng giòn, dùng làm món chính hoặc ăn vặt."),
        ("Món hấp", "Món hấp giữ độ mềm và vị tự nhiên của nguyên liệu."),
        ("Món tráng miệng", "Món ngọt nhẹ dùng sau bữa ăn."),
        ("Bánh mì", "Các món bánh mì và nhân bánh cho bữa sáng hoặc bữa nhẹ."),
        ("Món biển", "Món ăn chế biến từ cá, tôm, mực và hải sản."),
        ("Món từ thịt", "Các món từ thịt heo, bò, gà và gia cầm."),
    ];

    private static readonly (string Title, string Category)[] LegacyReplacements =
    [
        ("Bún thang Hà Nội", "Món Việt"), ("Bún riêu cua đồng", "Món Việt"), ("Bánh cuốn Thanh Trì", "Món Việt"),
        ("Bún bò Huế", "Món Việt"), ("Mì Quảng gà", "Món Việt"), ("Hủ tiếu Nam Vang", "Món Việt"),
        ("Bánh canh cua", "Món Việt"), ("Chả cá Lã Vọng", "Món Việt"), ("Nem rán miền Bắc", "Món Việt"),
        ("Đậu hũ kho nấm", "Món chay"), ("Nấm đùi gà áp chảo", "Món chay"), ("Cà tím om đậu phụ", "Món chay"),
        ("Bún riêu chay", "Món chay"), ("Gỏi cuốn nấm chay", "Món chay"), ("Canh rong biển đậu hũ", "Món chay"),
        ("Cơm chiên rau củ", "Món chay"), ("Đậu phụ sốt cà chua", "Món chay"), ("Miến xào nấm chay", "Món chay"),
        ("Rau muống xào tỏi", "Món xào"), ("Mì xào bò rau cải", "Món xào"), ("Bò xào lúc lắc", "Món xào"),
        ("Tôm xào bông cải", "Món xào"), ("Mực xào cần tây", "Món xào"), ("Gà xào sả ớt", "Món xào"),
        ("Đậu que xào trứng", "Món xào"), ("Nấm xào dầu hào", "Món xào"), ("Thịt heo xào chua ngọt", "Món xào"),
        ("Gà nướng mật ong", "Món nướng"), ("Sườn nướng sả", "Món nướng"), ("Cá saba nướng giấy bạc", "Món nướng"),
        ("Bạch tuộc nướng sa tế", "Món nướng"), ("Bắp nướng mỡ hành", "Món nướng"), ("Thịt xiên nướng rau củ", "Món nướng"),
        ("Cá hồi nướng chanh", "Món nướng"), ("Vịt nướng riềng mẻ", "Món nướng"), ("Nấm nướng phô mai", "Món nướng"),
        ("Thịt kho trứng cút", "Món kho"), ("Cá basa kho tộ", "Món kho"), ("Gà kho gừng", "Món kho"),
        ("Sườn non kho thơm", "Món kho"), ("Tôm rim nước dừa", "Món kho"), ("Trứng kho nước tương", "Món kho"),
        ("Thịt bò kho tiêu", "Món kho"), ("Cá nục kho cà", "Món kho"), ("Đậu hũ kho nấm rơm", "Món kho"),
        ("Canh bí đỏ thịt bằm", "Món canh"), ("Canh rau ngót nấu tôm", "Món canh"), ("Canh chua cá lóc", "Món canh"),
        ("Canh khổ qua nhồi thịt", "Món canh"), ("Canh cải nấu gừng", "Món canh"), ("Canh mồng tơi cua đồng", "Món canh"),
        ("Canh rong biển đậu phụ", "Món canh"), ("Canh khoai mỡ tôm tươi", "Món canh"), ("Canh gà lá giang", "Món canh"),
        ("Súp gà nấm hương", "Món súp"), ("Súp bí đỏ kem tươi", "Món súp"), ("Súp cua trứng cút", "Món súp"),
        ("Súp bắp non thịt gà", "Món súp"), ("Súp khoai tây phô mai", "Món súp"), ("Súp tôm rau củ", "Món súp"),
        ("Súp nấm đậu Hà Lan", "Món súp"), ("Súp cá hồi thì là", "Món súp"), ("Súp lơ xanh hạnh nhân", "Món súp"),
        ("Lẩu gà lá é", "Món lẩu"), ("Lẩu Thái hải sản", "Món lẩu"), ("Lẩu bò nhúng giấm", "Món lẩu"),
        ("Lẩu riêu cua bắp bò", "Món lẩu"), ("Lẩu nấm chay", "Món lẩu"), ("Lẩu cá kèo lá giang", "Món lẩu"),
        ("Lẩu dê thuốc bắc", "Món lẩu"), ("Lẩu kim chi Hàn Quốc", "Món lẩu"), ("Lẩu gà ớt hiểm", "Món lẩu"),
        ("Bánh bông lan cam", "Bánh ngọt"), ("Bánh tart trứng", "Bánh ngọt"), ("Bánh su kem vani", "Bánh ngọt"),
        ("Bánh quy bơ hạnh nhân", "Bánh ngọt"), ("Bánh chuối nướng", "Bánh ngọt"), ("Bánh mousse dâu", "Bánh ngọt"),
        ("Bánh flan caramel", "Bánh ngọt"), ("Bánh cupcake chocolate", "Bánh ngọt"), ("Bánh cheesecake chanh", "Bánh ngọt"),
        ("Trà đào cam sả", "Đồ uống"), ("Sinh tố bơ sữa chua", "Đồ uống"), ("Nước ép dứa cần tây", "Đồ uống"),
        ("Sữa đậu nành lá dứa", "Đồ uống"), ("Cà phê sữa đá", "Đồ uống"), ("Trà tắc mật ong", "Đồ uống"),
        ("Nước ép dưa hấu", "Đồ uống"), ("Sinh tố chuối yến mạch", "Đồ uống"), ("Matcha latte lạnh", "Đồ uống"),
    ];

    private static readonly (string Title, string Category)[] NewRecipes =
    [
        ("Bún cá Châu Đốc", "Món Việt"), ("Bánh hỏi heo quay", "Món Việt"), ("Cơm gà Hội An", "Món Việt"),
        ("Bún mắm miền Tây", "Món Việt"), ("Bánh bèo chén Huế", "Món Việt"), ("Bò né chảo gang", "Món Việt"),
        ("Bún thịt nướng sả", "Món Việt"), ("Bánh đúc nóng Hà Nội", "Món Việt"), ("Cá kho làng Vũ Đại", "Món Việt"),
        ("Cháo lòng miền Tây", "Món Việt"),
        ("Nấm kho tiêu xanh chay", "Món chay"), ("Cà ri đậu gà rau củ", "Món chay"), ("Mì căn xào sả", "Món chay"),
        ("Bún Huế chay", "Món chay"), ("Gỏi ngó sen đậu hũ", "Món chay"), ("Cơm cuộn rau củ", "Món chay"),
        ("Chả giò khoai môn chay", "Món chay"), ("Nấm hấp gừng chay", "Món chay"), ("Đậu hũ non sốt nấm", "Món chay"),
        ("Bún riêu nấm chay", "Món chay"),
        ("Bò xào hành tây", "Món xào"), ("Mực xào sa tế", "Món xào"), ("Mì udon xào rau củ", "Món xào"),
        ("Gà xào hạt điều", "Món xào"), ("Bông cải xào tỏi", "Món xào"), ("Heo xào kim chi", "Món xào"),
        ("Tôm xào măng tây", "Món xào"), ("Miến xào cua", "Món xào"), ("Nấm đùi gà xào bơ", "Món xào"),
        ("Bò xào bông thiên lý", "Món xào"),
        ("Cá lóc nướng trui", "Món nướng"), ("Ba chỉ nướng riềng mẻ", "Món nướng"), ("Gà nướng mắc khén", "Món nướng"),
        ("Tôm nướng phô mai", "Món nướng"), ("Sườn cốt lết nướng mật ong", "Món nướng"), ("Cá diêu hồng nướng muối ớt", "Món nướng"),
        ("Bò cuộn nấm kim châm nướng", "Món nướng"), ("Bí đỏ nướng thảo mộc", "Món nướng"), ("Mực nướng sa tế", "Món nướng"),
        ("Gà nướng lá chanh", "Món nướng"),
        ("Thịt ba chỉ kho dừa", "Món kho"), ("Cá thu kho thơm", "Món kho"), ("Gà kho sả nghệ", "Món kho"),
        ("Sườn kho củ cải", "Món kho"), ("Tôm kho quẹt", "Món kho"), ("Trứng cút kho nước dừa", "Món kho"),
        ("Thịt bò kho cà rốt", "Món kho"), ("Cá diếc kho tương", "Món kho"), ("Đậu hũ kho nấm đông cô", "Món kho"),
        ("Heo kho măng tươi", "Món kho"),
        ("Canh chua tôm bạc hà", "Món canh"), ("Canh sườn non nấu củ sen", "Món canh"), ("Canh cải xanh cá thác lác", "Món canh"),
        ("Canh bầu nấu nghêu", "Món canh"), ("Canh đu đủ hầm giò heo", "Món canh"), ("Canh nấm kim châm thịt bò", "Món canh"),
        ("Canh cà chua trứng", "Món canh"), ("Canh mướp nấu lạc", "Món canh"), ("Canh bí xanh sườn", "Món canh"),
        ("Canh cá nấu dọc mùng", "Món canh"),
        ("Súp hải sản tóc tiên", "Món súp"), ("Súp gà ngô non", "Món súp"), ("Súp cà chua đậu lăng", "Món súp"),
        ("Súp khoai lang cà rốt", "Món súp"), ("Súp măng tây cua", "Món súp"), ("Súp bí đỏ hạt sen", "Món súp"),
        ("Súp bò rau củ", "Món súp"), ("Súp đậu trắng thịt xông khói", "Món súp"), ("Súp nấm hải sản", "Món súp"),
        ("Súp gà hạt sen", "Món súp"),
        ("Lẩu mắm miền Tây", "Món lẩu"), ("Lẩu cá thác lác khổ qua", "Món lẩu"), ("Lẩu gà nấm linh chi", "Món lẩu"),
        ("Lẩu bò sa tế", "Món lẩu"), ("Lẩu hải sản chua cay", "Món lẩu"), ("Lẩu cua đồng rau mồng tơi", "Món lẩu"),
        ("Lẩu vịt om sấu", "Món lẩu"), ("Lẩu cá hồi măng chua", "Món lẩu"), ("Lẩu chay nấm thập cẩm", "Món lẩu"),
        ("Lẩu sườn sụn om chuối đậu", "Món lẩu"),
        ("Bánh chiffon lá dứa", "Bánh ngọt"), ("Bánh tart chanh vàng", "Bánh ngọt"), ("Bánh brownie óc chó", "Bánh ngọt"),
        ("Bánh madeleine mật ong", "Bánh ngọt"), ("Bánh crepe sầu riêng", "Bánh ngọt"), ("Bánh su kem trà xanh", "Bánh ngọt"),
        ("Bánh gato dâu tây", "Bánh ngọt"), ("Bánh muffin việt quất", "Bánh ngọt"), ("Bánh quy gừng quế", "Bánh ngọt"),
        ("Bánh cuộn kem dâu", "Bánh ngọt"),
        ("Trà sữa thái xanh", "Đồ uống"), ("Nước ép cà rốt táo", "Đồ uống"), ("Sữa chua uống dâu", "Đồ uống"),
        ("Trà gừng quế nóng", "Đồ uống"), ("Nước chanh dây mật ong", "Đồ uống"), ("Sinh tố dứa bạc hà", "Đồ uống"),
        ("Cacao nóng marshmallow", "Đồ uống"), ("Trà vải hoa hồng", "Đồ uống"), ("Nước ép cam cà rốt", "Đồ uống"),
        ("Sữa bắp lá dứa", "Đồ uống"),
        ("Hamburger bò phô mai", "Món ăn nhanh"), ("Gà rán giòn cay", "Món ăn nhanh"), ("Khoai tây lắc phô mai", "Món ăn nhanh"),
        ("Hotdog xúc xích nướng", "Món ăn nhanh"), ("Pizza gà nấm mini", "Món ăn nhanh"), ("Sandwich trứng bơ", "Món ăn nhanh"),
        ("Mì trộn bò cay", "Món ăn nhanh"), ("Bánh quesadilla gà", "Món ăn nhanh"), ("Cơm cuộn cá ngừ", "Món ăn nhanh"),
        ("Taco tôm sốt bơ", "Món ăn nhanh"),
        ("Cơm chiên thập cẩm", "Món thập cẩm"), ("Miến lươn trộn rau thơm", "Món thập cẩm"), ("Cháo gà nấm hạt sen", "Món thập cẩm"),
        ("Mì Quảng tôm thịt", "Món thập cẩm"), ("Bún măng vịt", "Món thập cẩm"), ("Cơm gà xối mỡ", "Món thập cẩm"),
        ("Bánh đa cua Hải Phòng", "Món thập cẩm"), ("Hủ tiếu bò viên", "Món thập cẩm"), ("Cơm niêu cá kho", "Món thập cẩm"),
        ("Bún chả cá Nha Trang", "Món thập cẩm"),
        ("Gỏi đu đủ bò khô", "Món gỏi"), ("Gỏi xoài tôm khô", "Món gỏi"), ("Gỏi gà bắp cải tím", "Món gỏi"),
        ("Gỏi ngó sen tai heo", "Món gỏi"), ("Gỏi củ hủ dừa tôm thịt", "Món gỏi"), ("Gỏi bưởi cá hồi", "Món gỏi"),
        ("Gỏi sứa hoa chuối", "Món gỏi"), ("Gỏi bò bóp thấu", "Món gỏi"), ("Gỏi rau càng cua trứng", "Món gỏi"),
        ("Gỏi cuốn cá hồi", "Món gỏi"),
        ("Bún bò cay sa tế", "Món cay"), ("Gà xào ớt xiêm xanh", "Món cay"), ("Mì kim chi cay", "Món cay"),
        ("Tôm rang muối ớt", "Món cay"), ("Bò sốt tiêu đen cay", "Món cay"), ("Cá nướng ớt hiểm", "Món cay"),
        ("Đậu hũ Tứ Xuyên", "Món cay"), ("Cánh gà sốt cay Hàn Quốc", "Món cay"), ("Lẩu thái cay nồng", "Món cay"),
        ("Mực xào sa tế cay", "Món cay"),
        ("Chả giò tôm thịt", "Món chiên"), ("Cá viên chiên nước mắm", "Món chiên"), ("Đậu hũ chiên sả", "Món chiên"),
        ("Gà popcorn giòn", "Món chiên"), ("Tôm chiên xù", "Món chiên"), ("Chuối chiên mè", "Món chiên"),
        ("Khoai môn lệ phố", "Món chiên"), ("Cá basa chiên giòn", "Món chiên"), ("Bánh tôm Hồ Tây", "Món chiên"),
        ("Mực chiên nước mắm", "Món chiên"),
        ("Cá hấp xì dầu gừng", "Món hấp"), ("Gà hấp lá chanh", "Món hấp"), ("Trứng hấp vân", "Món hấp"),
        ("Bí đỏ hấp thịt bằm", "Món hấp"), ("Tôm hấp nước dừa", "Món hấp"), ("Bánh bao nhân xá xíu", "Món hấp"),
        ("Cá diêu hồng hấp hành", "Món hấp"), ("Đậu hũ hấp nấm", "Món hấp"), ("Sườn hấp tàu xì", "Món hấp"),
        ("Bánh cuốn nhân thịt hấp", "Món hấp"),
        ("Chè khúc bạch nhãn", "Món tráng miệng"), ("Chè đậu đỏ nước cốt dừa", "Món tráng miệng"), ("Tàu hũ gừng nóng", "Món tráng miệng"),
        ("Rau câu dừa lá dứa", "Món tráng miệng"), ("Panna cotta xoài", "Món tráng miệng"), ("Yaourt nếp cẩm", "Món tráng miệng"),
        ("Chè sen long nhãn", "Món tráng miệng"), ("Kem chuối đậu phộng", "Món tráng miệng"), ("Bánh flan cà phê", "Món tráng miệng"),
        ("Thạch trái cây nhiệt đới", "Món tráng miệng"),
        ("Bánh mì chảo pate trứng", "Bánh mì"), ("Bánh mì gà xé sốt bơ", "Bánh mì"), ("Bánh mì xíu mại Đà Lạt", "Bánh mì"),
        ("Bánh mì thịt nướng", "Bánh mì"), ("Bánh mì cá mòi sốt cà", "Bánh mì"), ("Bánh mì chả cá thì là", "Bánh mì"),
        ("Bánh mì bơ tỏi phô mai", "Bánh mì"), ("Bánh mì heo quay giòn bì", "Bánh mì"), ("Bánh mì trứng ốp la", "Bánh mì"),
        ("Bánh mì nấm áp chảo", "Bánh mì"),
        ("Tôm sú nướng muối ớt", "Món biển"), ("Cua rang me", "Món biển"), ("Mực hấp gừng", "Món biển"),
        ("Cá hồi áp chảo sốt chanh", "Món biển"), ("Nghêu hấp sả", "Món biển"), ("Bạch tuộc xào cần tỏi", "Món biển"),
        ("Cá basa kho nghệ", "Món biển"), ("Sò điệp nướng mỡ hành", "Món biển"), ("Tôm rim nước mắm", "Món biển"),
        ("Cá thu sốt cà chua", "Món biển"),
        ("Bò lúc lắc khoai tây", "Món từ thịt"), ("Thịt heo quay da giòn", "Món từ thịt"), ("Gà hấp hành", "Món từ thịt"),
        ("Sườn non nấu đậu", "Món từ thịt"), ("Bò cuộn phô mai", "Món từ thịt"), ("Gà rô ti nước dừa", "Món từ thịt"),
        ("Thịt viên sốt cà", "Món từ thịt"), ("Heo xá xíu mật ong", "Món từ thịt"), ("Bò sốt vang kiểu Bắc", "Món từ thịt"),
        ("Gà chiên mắm tỏi", "Món từ thịt"),
    ];

    private static readonly IReadOnlyDictionary<string, (string[] Ingredients, string[] Instructions)> CategoryCookingGuides =
        new Dictionary<string, (string[], string[])>(StringComparer.OrdinalIgnoreCase)
        {
            ["Món Việt"] = (["300g nguyên liệu chính", "200g bún hoặc cơm", "1 củ hành", "2 thìa nước mắm", "Rau thơm", "Tiêu và gia vị"], ["Sơ chế nguyên liệu và ướp với gia vị.", "Nấu hoặc chế biến phần nguyên liệu chính đến khi chín.", "Chuẩn bị bún hoặc cơm và rau ăn kèm.", "Nêm lại vừa ăn, trình bày và dùng nóng."]),
            ["Món chay"] = (["250g đậu hũ hoặc nấm", "200g rau củ theo mùa", "1 thìa nước tương", "1 tép tỏi", "1 thìa dầu ăn", "Tiêu và mè rang"], ["Rửa sạch rau củ, cắt miếng vừa ăn.", "Áp chảo đậu hũ hoặc nấm cho vàng nhẹ.", "Thêm rau củ và gia vị, đảo hoặc om đến khi chín.", "Nêm lại vừa ăn, rắc mè và dùng nóng."]),
            ["Món xào"] = (["250g nguyên liệu chính", "200g rau củ", "2 tép tỏi", "1 thìa dầu hào", "1 thìa dầu ăn", "Tiêu và gia vị"], ["Sơ chế nguyên liệu, để ráo nước.", "Phi thơm tỏi trên chảo nóng.", "Cho nguyên liệu chính vào xào nhanh, sau đó thêm rau củ.", "Nêm dầu hào, đảo đến khi vừa chín và dùng nóng."]),
            ["Món nướng"] = (["500g nguyên liệu chính", "2 tép tỏi", "1 thìa mật ong", "1 thìa nước mắm", "Sả và tiêu", "Rau ăn kèm"], ["Ướp nguyên liệu với tỏi, sả và gia vị.", "Làm nóng lò hoặc bếp nướng.", "Nướng và trở đều đến khi chín vàng.", "Quét thêm sốt, để nghỉ vài phút rồi dùng nóng."]),
            ["Món kho"] = (["400g nguyên liệu chính", "2 thìa nước mắm", "1 thìa đường", "1 củ hành tím", "Nước dừa hoặc nước lọc", "Tiêu và ớt"], ["Ướp nguyên liệu với nước mắm, đường và tiêu.", "Phi thơm hành, cho nguyên liệu vào đảo săn.", "Thêm nước dừa hoặc nước lọc, kho lửa nhỏ.", "Kho đến khi nước sánh và nêm lại vừa ăn."]),
            ["Món canh"] = (["300g nguyên liệu chính", "1 lít nước dùng", "200g rau củ", "1 củ hành", "Hành lá", "Muối và nước mắm"], ["Sơ chế nguyên liệu và cắt rau củ.", "Đun sôi nước dùng, cho nguyên liệu chính vào nấu.", "Thêm rau củ và nấu đến khi vừa chín.", "Nêm vừa ăn, thêm hành lá và dùng nóng."]),
            ["Món súp"] = (["200g nguyên liệu chính", "500ml nước dùng", "100ml sữa tươi", "1 thìa bột bắp", "Hành tím", "Tiêu và muối"], ["Sơ chế nguyên liệu, cắt nhỏ.", "Nấu nguyên liệu với nước dùng đến khi mềm.", "Thêm sữa hoặc bột bắp pha loãng, khuấy đều.", "Nêm vừa ăn, đun sôi nhẹ và dùng nóng."]),
            ["Món lẩu"] = (["500g nguyên liệu nhúng", "1.5 lít nước dùng", "200g rau ăn lẩu", "Nấm và đậu phụ", "Sả và hành", "Bún hoặc mì"], ["Nấu nước dùng cùng sả và gia vị.", "Chuẩn bị rau, nấm và nguyên liệu nhúng.", "Đun nước lẩu sôi, lần lượt cho nguyên liệu vào.", "Dùng nóng cùng bún hoặc mì."]),
            ["Bánh ngọt"] = (["200g bột mì", "100g đường", "2 quả trứng", "100g bơ", "100ml sữa", "Bột nở và vani"], ["Cân và rây các nguyên liệu khô.", "Đánh bơ, đường và trứng đến khi hòa quyện.", "Trộn nguyên liệu khô với hỗn hợp ướt.", "Nướng ở 170 độ C đến khi bánh chín vàng."]),
            ["Đồ uống"] = (["200g trái cây hoặc nguyên liệu chính", "200ml nước hoặc sữa", "Đá viên", "1 thìa mật ong", "Nước cốt chanh", "Lá bạc hà"], ["Rửa sạch và cắt nhỏ nguyên liệu.", "Cho nguyên liệu cùng nước hoặc sữa vào máy xay.", "Xay hoặc khuấy đến khi hòa quyện.", "Thêm đá, điều chỉnh vị ngọt và dùng ngay."]),
            ["Món ăn nhanh"] = (["2 phần bánh mì hoặc mì", "200g nhân tùy chọn", "Phô mai", "Rau ăn kèm", "Sốt yêu thích", "Tiêu và gia vị"], ["Sơ chế và làm chín phần nhân.", "Chuẩn bị bánh mì hoặc mì theo hướng dẫn.", "Thêm nhân, rau và sốt.", "Dùng ngay khi còn nóng."]),
            ["Món thập cẩm"] = (["200g nguyên liệu chính", "150g rau củ", "1 phần cơm hoặc mì", "1 củ hành", "Nước dùng hoặc nước sốt", "Gia vị"], ["Sơ chế riêng từng nhóm nguyên liệu.", "Nấu phần nguyên liệu chính trước.", "Thêm rau củ và cơm hoặc mì, đảo đều.", "Nêm lại và trình bày thành phần cân đối."]),
            ["Món gỏi"] = (["200g rau hoặc củ giòn", "150g nguyên liệu chính", "2 thìa nước mắm", "1 quả chanh", "Rau thơm", "Đậu phộng rang"], ["Rửa sạch và để ráo rau củ.", "Luộc hoặc làm chín nguyên liệu chính rồi để nguội.", "Pha nước trộn chua ngọt.", "Trộn đều, thêm rau thơm và đậu phộng trước khi dùng."]),
            ["Món cay"] = (["300g nguyên liệu chính", "2 quả ớt", "1 thìa sa tế", "2 tép tỏi", "1 củ hành", "Nước mắm và đường"], ["Sơ chế nguyên liệu và băm tỏi, ớt.", "Phi thơm hành tỏi cùng sa tế.", "Cho nguyên liệu vào nấu chín và thấm gia vị.", "Nêm độ cay vừa khẩu vị, dùng nóng."]),
            ["Món chiên"] = (["300g nguyên liệu chính", "100g bột chiên", "1 quả trứng", "Dầu ăn", "Muối và tiêu", "Nước chấm"], ["Sơ chế và thấm khô nguyên liệu.", "Tẩm bột và trứng thành lớp áo mỏng.", "Chiên ngập dầu ở lửa vừa đến khi vàng giòn.", "Để ráo dầu và dùng cùng nước chấm."]),
            ["Món hấp"] = (["400g nguyên liệu chính", "1 củ gừng", "2 nhánh hành", "1 thìa nước tương", "Tiêu", "Rau ăn kèm"], ["Sơ chế nguyên liệu và ướp nhẹ gia vị.", "Đun sôi nước trong nồi hấp.", "Hấp nguyên liệu cùng gừng và hành đến khi chín.", "Rưới nước tương, thêm tiêu và dùng nóng."]),
            ["Món tráng miệng"] = (["200g trái cây hoặc nguyên liệu chính", "200ml sữa hoặc nước cốt dừa", "50g đường", "Bột rau câu hoặc gelatin", "Đá viên", "Lá thơm"], ["Sơ chế nguyên liệu và chuẩn bị khuôn hoặc ly.", "Nấu sữa hoặc nước cốt cùng đường.", "Thêm trái cây hoặc chất tạo đông, khuấy đều.", "Để nguội rồi làm lạnh trước khi dùng."]),
            ["Bánh mì"] = (["2 ổ bánh mì", "200g nhân chính", "Dưa leo và rau thơm", "Đồ chua", "Nước sốt", "Tiêu và gia vị"], ["Chuẩn bị nhân và làm nóng bánh mì.", "Nêm hoặc làm nóng phần nhân đến khi vừa chín.", "Phết sốt, thêm nhân và rau ăn kèm.", "Dùng khi bánh còn giòn."]),
            ["Món biển"] = (["300g cá hoặc hải sản", "2 tép tỏi", "1 quả chanh", "Hành lá", "Dầu ăn", "Muối và tiêu"], ["Sơ chế hải sản, để ráo và ướp nhẹ.", "Làm nóng chảo hoặc nồi cùng tỏi.", "Nấu hải sản vừa chín để giữ độ ngọt.", "Thêm chanh và hành, dùng nóng."]),
            ["Món từ thịt"] = (["400g thịt hoặc gia cầm", "1 củ hành", "2 tép tỏi", "1 thìa nước mắm", "Rau củ ăn kèm", "Tiêu và gia vị"], ["Sơ chế thịt và ướp với gia vị.", "Phi thơm hành tỏi, cho thịt vào làm săn.", "Thêm nước hoặc rau củ và nấu chín.", "Nêm lại, để nghỉ vài phút rồi dùng nóng."]),
        };

    private static readonly IReadOnlyDictionary<string, string> LegacyCategories = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        ["Bún chả Hà Nội"] = "Món Việt",
        ["Phở bò Nam Định"] = "Món Việt",
        ["Cơm tấm sườn nướng"] = "Món Việt",
        ["Canh chua cá rô đồng"] = "Món canh",
        ["Gỏi cuốn tôm thịt"] = "Món gỏi",
        ["Mì xào hải sản"] = "Món xào",
        ["Bánh xèo miền Trung"] = "Món Việt",
        ["Cà ri gà Việt Nam"] = "Món từ thịt",
        ["Chè bưởi"] = "Món tráng miệng",
        ["Sinh tố xoài"] = "Đồ uống",
    };

    public static async Task SeedDataAsync(ApplicationDbContext context, ApplicationUser seedAuthor)
    {
        var categories = await context.Categories.ToListAsync();
        foreach (var (name, description) in CategoryCatalog)
        {
            if (categories.Any(category => string.Equals(category.Name, name, StringComparison.OrdinalIgnoreCase))) continue;
            var category = new Category { Name = name, Description = description };
            context.Categories.Add(category);
            categories.Add(category);
        }
        await context.SaveChangesAsync();

        var categoryIds = categories.ToDictionary(category => category.Name, category => category.Id, StringComparer.OrdinalIgnoreCase);
        var recipes = await context.Recipes.OrderBy(recipe => recipe.Id).ToListAsync();

        foreach (var recipe in recipes)
        {
            if (LegacyCategories.TryGetValue(recipe.Title, out var correctCategory))
            {
                recipe.Update(recipe.Title, recipe.Description, recipe.Ingredients, recipe.Instructions, categoryIds[correctCategory], recipe.Status, string.Empty, recipe.CookingTimeMinutes, recipe.Difficulty, recipe.IsVegetarian);
            }
            else if (!string.IsNullOrEmpty(recipe.ImageUrl))
            {
                recipe.Update(recipe.Title, recipe.Description, recipe.Ingredients, recipe.Instructions, recipe.CategoryId, recipe.Status, string.Empty, recipe.CookingTimeMinutes, recipe.Difficulty, recipe.IsVegetarian);
            }
        }

        var seededTitles = recipes
            .Where(recipe => recipe.AuthorId == seedAuthor.Id && LegacyCategories.ContainsKey(recipe.Title))
            .GroupBy(recipe => recipe.Title, StringComparer.OrdinalIgnoreCase)
            .Select(group => group.First())
            .Select(recipe => recipe.Title)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var usedCatalogTitles = recipes
            .Where(recipe => !seededTitles.Contains(recipe.Title))
            .Select(recipe => recipe.Title)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var replacementQueue = LegacyReplacements
            .Where(seed => !usedCatalogTitles.Contains(seed.Title))
            .GetEnumerator();

        foreach (var group in recipes
                     .Where(recipe => recipe.AuthorId == seedAuthor.Id && LegacyCategories.ContainsKey(recipe.Title))
                     .GroupBy(recipe => recipe.Title, StringComparer.OrdinalIgnoreCase))
        {
            var groupRecipes = group.ToList();
            var preservedRecipe = string.Equals(group.Key, "Phở bò Nam Định", StringComparison.OrdinalIgnoreCase)
                ? groupRecipes.FirstOrDefault(recipe => recipe.Id == Guid.Parse("126db487-f505-49cf-a365-7c9592f2dd75")) ?? groupRecipes[0]
                : groupRecipes[0];

            foreach (var duplicate in groupRecipes.Where(recipe => recipe.Id != preservedRecipe.Id))
            {
                if (!replacementQueue.MoveNext()) break;
                var replacement = replacementQueue.Current;
                var details = CategoryCookingGuides[replacement.Category];
                duplicate.Update(replacement.Title, $"{replacement.Title} dễ làm tại nhà, dùng nguyên liệu quen thuộc và cách nấu rõ ràng.", details.Ingredients.ToList(), details.Instructions.ToList(), categoryIds[replacement.Category], duplicate.Status, string.Empty, 35, "Trung bình", replacement.Category == "Món chay");
                usedCatalogTitles.Add(replacement.Title);
            }
        }

        var currentTitles = recipes.Select(recipe => recipe.Title).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var newCount = recipes.Count;
        foreach (var seed in NewRecipes)
        {
            if (newCount >= 300) break;
            if (!currentTitles.Add(seed.Title)) continue;

            var guide = CategoryCookingGuides[seed.Category];
            context.Recipes.Add(Recipe.Create(
                seed.Title,
                $"{seed.Title} thơm ngon, dễ thực hiện tại nhà với các bước nấu đơn giản.",
                guide.Ingredients.ToList(),
                guide.Instructions.ToList(),
                categoryIds[seed.Category],
                seedAuthor.Id,
                cookingTimeMinutes: 20 + (newCount % 5) * 5,
                difficulty: "Trung bình",
                isVegetarian: seed.Category == "Món chay"));
            newCount++;
        }

        await context.SaveChangesAsync();
    }
}
