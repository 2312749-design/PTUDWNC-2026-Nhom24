(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/LocaleContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocaleProvider",
    ()=>LocaleProvider,
    "useLocale",
    ()=>useLocale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const STORAGE_KEY = 'recipeDisplaySettings';
const DEFAULT_SETTINGS = {
    language: 'vi',
    unit: 'g',
    region: 'VN'
};
const englishTranslations = {
    'Bảng tin': 'Feed',
    'Công thức': 'Recipes',
    'Nấu cùng tôi': 'Cook with me',
    'Tủ lạnh': 'My fridge',
    'Khẩu phần': 'Servings',
    'Nhật ký': 'Cooking journal',
    'Hỏi đáp': 'Q&A',
    'Nấu chung': 'Cook together',
    'Sổ tay': 'Cookbook',
    'Khẩu vị': 'Taste profile',
    'AI Chat': 'AI chat',
    'Thử thách': 'Challenges',
    'Chuẩn quốc tế': 'International standard',
    'Biên tập': 'Editor picks',
    'Tác giả': 'Authors',
    'Ngôn ngữ': 'Language',
    'In ấn': 'Print',
    'Danh mục': 'Categories',
    'Thành viên': 'Members',
    'Đăng nhập': 'Log in',
    'Đăng xuất': 'Log out',
    'Tạo tài khoản': 'Create account',
    'KHÁM PHÁ': 'EXPLORE',
    'Bảng tin': 'Feed',
    'Danh mục món': 'Categories',
    'Tìm thành viên': 'Find members',
    'GÓC BẾP HÔM NAY': "TODAY'S KITCHEN NOTE",
    'Một món ngon bắt đầu từ niềm vui được chia sẻ.': 'Good food begins with the joy of sharing.',
    'BẾP NHÀ · CỘNG ĐỒNG': 'BEP NHA · COMMUNITY',
    'MỌI NGƯỜI ĐANG CHIA SẺ': 'PEOPLE ARE SHARING',
    'Khám phá': 'Discover',
    'Đang theo dõi': 'Following',
    'Mới nhất': 'Newest',
    'Nổi bật': 'Popular',
    'Hôm nay bạn vừa nấu món gì? Chia sẻ với mọi người...': 'What did you cook today? Share it with everyone...',
    'Đang tải...': 'Loading...',
    'Ảnh/video': 'Photo/video',
    'Lưu bản nháp': 'Save as draft',
    'Lưu nháp': 'Save draft',
    'Đăng bài': 'Publish',
    'Bếp vui hơn khi có bạn.': 'The kitchen is better with you.',
    'Tạo tài khoản để chia sẻ câu chuyện, lưu kết nối và trò chuyện cùng cộng đồng.': 'Create an account to share stories, connect, and chat with the community.',
    'Tham gia Bếp Nhà': 'Join Bep Nha',
    'Đang tải bảng tin...': 'Loading feed...',
    'Bảng tin đang chờ câu chuyện đầu tiên': 'The feed is waiting for its first story',
    'Hãy chia sẻ món ăn, mẹo bếp hoặc một khoảnh khắc đáng nhớ.': 'Share a dish, a kitchen tip, or a memorable moment.',
    'BẾP NHÀ CÓ GÌ?': 'WHAT IS BEP NHA?',
    'Không chỉ là công thức.': 'More than recipes.',
    'Nơi những người yêu bếp trao đổi kinh nghiệm, khám phá món mới và kể câu chuyện quanh bàn ăn.': 'A place for food lovers to share experience, discover dishes, and tell stories around the table.',
    'Khám phá cộng đồng': 'Explore the community',
    'GÓC BẾP CỦA BẠN': 'YOUR KITCHEN',
    'Công thức đã lưu': 'Saved recipes',
    'Thực đơn tuần': 'Weekly meal plan',
    'Thử thách nấu ăn': 'Cooking challenges',
    'Thống kê tác giả': 'Creator stats',
    'Bản nháp': 'Drafts',
    'An toàn cộng đồng': 'Community safety',
    'Cập nhật hồ sơ': 'Update profile',
    'Cộng đồng ẩm thực': 'Food community',
    'Chia sẻ điều ngon, mỗi ngày.': 'Share something delicious, every day.',
    'CỘNG ĐỒNG ẨM THỰC': 'FOOD COMMUNITY',
    'Nguồn bài viết': 'Feed source',
    'Sắp xếp bài viết': 'Sort posts',
    'Gỡ tệp': 'Remove file',
    'Ảnh/video': 'Photo/video',
    'Đang lưu...': 'Saving...',
    'Đăng bài': 'Publish post',
    'GÓC BẾP CỦA BẠN': 'YOUR KITCHEN',
    'BẾP NHÀ CÓ GÌ?': 'WHAT IS BEP NHA?',
    'Tủ lạnh': 'Fridge',
    'Nhật ký': 'Journal',
    'Khẩu vị': 'Taste',
    'Hỏi đáp': 'Q&A',
    'Nấu chung': 'Cook together',
    'Sổ tay': 'Cookbook',
    'Nấu cùng tôi': 'Cook with me',
    'Chuẩn quốc tế': 'International recipes',
    'Biên tập': 'Editor picks',
    'In ấn': 'Print',
    'Thử thách': 'Challenges',
    'Ngôn ngữ': 'Language',
    'Cài đặt hiển thị': 'Display settings',
    'Đơn vị nguyên liệu': 'Ingredient units',
    'Khu vực': 'Region',
    'Xem trước': 'Preview',
    'Lưu cài đặt': 'Save settings',
    'Tiếng Việt': 'Vietnamese',
    'Việt Nam': 'Vietnam',
    'Hoa Kỳ': 'United States',
    'Châu Âu': 'Europe',
    'Đơn vị:': 'Units:',
    'Tùy chỉnh ngôn ngữ & định dạng': 'Language and regional settings',
    'Chuyển đổi ngôn ngữ, đơn vị đo lường và định dạng khu vực để phù hợp với người dùng và món ăn.': 'Choose the language, measurement units, and regional formats for your recipes.',
    'Bước {step}': 'Step {step}',
    'Bắt đầu': 'Start',
    'Tạm dừng': 'Pause',
    'Đọc to': 'Read aloud',
    'Giữ sáng màn hình': 'Keep screen awake',
    'Tắt giữ sáng': 'Release screen wake lock',
    'Thời lượng': 'Duration',
    'phút': 'min',
    'giây': 'sec',
    'quả': 'pcs',
    'cây': 'stalks',
    'Cài đặt ngôn ngữ, đơn vị và khu vực đã được lưu.': 'Language, units, and region settings saved.',
    'Thông báo': 'Notifications',
    'Cài đặt tài khoản': 'Account settings',
    'Điều hướng chính': 'Main navigation',
    'Mở menu': 'Open menu',
    'Đóng menu': 'Close menu',
    'Nấu ăn': 'Cooking',
    'Cộng đồng': 'Community',
    'Tiện ích': 'Tools',
    'Tài khoản': 'Account',
    'Dành cho bạn': 'For you',
    'Gram / ml': 'Grams / ml',
    'Ounce / tbsp': 'Ounces / tbsp',
    'Cup / cup': 'Cups',
    'Món hiện tại': 'Current recipe',
    'Chế độ nấu tay': 'Guided cooking mode',
    'NẤU CÙNG TÔI': 'COOK WITH ME',
    'Mỗi bước được phóng to, lời hướng dẫn được đọc thành tiếng, đồng hồ đếm thời gian luôn hiển thị và màn hình được giữ sáng trong lúc bạn nấu.': 'Follow large step-by-step instructions, listen to them aloud, use a timer, and keep your screen awake while cooking.',
    'Mì xào rau củ chay': 'Vegetarian vegetable stir-fried noodles',
    'Mì hạt sen': 'Lotus seed noodles',
    'Đậu phụ': 'Tofu',
    'Đậu que': 'Green beans',
    'Ớt chuông': 'Bell pepper',
    'Tỏi': 'Garlic',
    'Nước tương': 'Soy sauce',
    'Chuẩn bị nguyên liệu': 'Prepare the ingredients',
    'Rửa sạch rau, cắt đậu phụ thành miếng vừa ăn và thái nhỏ hành tỏi, ớt chuông.': 'Wash the vegetables. Cut the tofu into bite-size pieces and finely chop the onion, garlic, and bell pepper.',
    'Đun nóng chảo': 'Heat the pan',
    'Cho 1 muỗng dầu vào chảo, đun ở lửa vừa đến khi dầu bắt đầu sủi nhẹ.': 'Add 1 spoonful of oil to the pan and heat over medium until it begins to shimmer.',
    'Xào rau củ': 'Stir-fry the vegetables',
    'Cho tỏi, ớt và rau vào chảo, xào khoảng 2 phút cho mềm và thơm.': 'Add the garlic, pepper, and vegetables. Stir-fry for about 2 minutes until tender and fragrant.',
    'Thêm mì và đậu phụ': 'Add the noodles and tofu',
    'Cho mì và đậu phụ vào, đảo đều, thêm nước tương và tiếp tục xào cho các nguyên liệu thấm đều.': 'Add the noodles and tofu. Toss well, add soy sauce, and continue stir-frying until evenly seasoned.',
    'Hoàn thiện': 'Finish the dish',
    'Nếm lại và điều chỉnh gia vị. Món sẵn sàng cho bữa ăn.': 'Taste and adjust the seasoning. The dish is ready to serve.',
    'Nguyên liệu đang có': 'Ingredients on hand',
    'Đề xuất món ăn': 'Suggested recipes',
    'Gợi ý món theo nguyên liệu': 'Find recipes from your ingredients',
    'TỦ LẠNH CÒN GÌ?': "WHAT'S IN YOUR FRIDGE?",
    'Nhập những gì bạn đang có trong tủ lạnh hoặc tủ đồ, hệ thống sẽ đề xuất món phù hợp và chỉ ra thứ còn thiếu.': 'Enter what you have in your fridge or pantry to find matching recipes and see what is missing.',
    'Đã có:': 'Have:',
    'Còn thiếu:': 'Missing:',
    'Không có nguyên liệu nào trùng': 'No matching ingredients',
    'Bạn đã có đủ nguyên liệu': 'You have all the ingredients',
    'Chưa có món nào phù hợp. Hãy thêm ít nguyên liệu vào tủ lạnh để nhận đề xuất.': 'No matching recipes yet. Add some ingredients to get suggestions.',
    'Tự quy đổi khẩu phần': 'Scale recipe servings',
    'Lưu khẩu phần': 'Save servings',
    'CÔNG THỨC LINH HOẠT': 'FLEXIBLE RECIPES',
    'Món hiện tại': 'Current recipe',
    'Thông tin nhanh': 'Quick facts',
    'Trang công thức chuẩn quốc tế': 'International recipe page',
    'TRANG CÔNG THỨC CHUẨN QUỐC TẾ': 'INTERNATIONAL RECIPE FORMAT',
    'Recipe standard layout': 'Standard recipe format',
    'Giao diện chuẩn cho một công thức chuyên nghiệp với thời gian, khẩu phần, nguyên liệu, độ khó, thay thế và thông tin dinh dưỡng.': 'A professional recipe format with timing, servings, ingredients, difficulty, substitutions, and nutrition.',
    'Chuẩn bị': 'Prep',
    'Nấu': 'Cook',
    'Dụng cụ': 'Equipment',
    'Dị ứng': 'Allergens',
    'Thay thế': 'Substitutions',
    'Dinh dưỡng': 'Nutrition',
    'Mì xào rau củ chay': 'Vegetarian vegetable stir-fried noodles',
    'Canh chua cá': 'Vietnamese sweet-and-sour fish soup',
    'Bánh tráng trộn': 'Vietnamese rice paper salad',
    'Gỏi đậu phụ': 'Tofu salad',
    'mì': 'noodles',
    'đậu phụ': 'tofu',
    'hành tây': 'onion',
    'tỏi': 'garlic',
    'cà chua': 'tomato',
    'bột ngọt': 'MSG',
    'ớt chuông': 'bell pepper',
    'nước tương': 'soy sauce',
    'cá': 'fish',
    'dứa': 'pineapple',
    'ngò': 'cilantro',
    'đậu bắp': 'okra',
    'giấm': 'vinegar',
    'bánh tráng': 'rice paper',
    'trứng': 'egg',
    'đồ chua': 'pickled vegetables',
    'mè rang': 'toasted sesame',
    'rau thơm': 'fresh herbs',
    'dưa leo': 'cucumber',
    'Bún chả giò rau củ': 'Vegetable spring-roll vermicelli bowl',
    'Bún chả giò rau củ': 'Vegetable spring-roll vermicelli bowl',
    'Giò chả': 'Vietnamese sausage',
    'Rau sống': 'Fresh greens',
    'Nước chấm': 'Dipping sauce',
    'Đã lưu:': 'Saved:',
    'người': 'people',
    'Đã lưu: {count} người': 'Saved: {count} people',
    'mặt hàng đang có': 'items on hand',
    'số nguyên liệu': 'ingredients',
    'Nguyên liệu đang có': 'Ingredients on hand',
    'Đề xuất món ăn': 'Suggested recipes',
    'Ví dụ: trứng, hành tây, cà chua, mì, bột ngọt, tỏi': 'Example: eggs, onion, tomatoes, noodles, MSG, garlic',
    'Nhập những gì bạn đang có trong tủ lạnh hoặc tủ đồ, hệ thống sẽ đề xuất món phù hợp và chỉ ra thứ còn thiếu.': 'Enter what you have in your fridge or pantry to find matching recipes and see what is missing.',
    'Chọn chế độ ăn, mức độ cay, độ nhanh, chi phí và yếu tố hạn chế để nhận món phù hợp với bạn.': 'Choose your diet, spice level, prep time, budget, and restrictions to get recipes that suit you.',
    'NHẬT KÝ NẤU RIÊNG': 'PRIVATE COOKING JOURNAL',
    'Ghi chép món đã thử': 'Track dishes you have cooked',
    'Lưu lại nguyên liệu, thay đổi gia vị, thời gian nấu và cảm nhận thực tế để mỗi lần nấu dần tốt hơn.': 'Record ingredients, seasoning changes, cooking time, and your notes to improve each time you cook.',
    'HỎI ĐÁP THEO CÔNG THỨC': 'RECIPE Q&A',
    'Cộng đồng trả lời bạn': 'Get answers from the community',
    'Hỏi về nguyên liệu, kỹ thuật nấu, hoặc cách thay thế để cải thiện món ăn của bạn.': 'Ask about ingredients, cooking techniques, or substitutions to improve your dish.',
    'NẤU CÙNG NHAU TRỰC TUYẾN': 'COOK TOGETHER ONLINE',
    'Tạo buổi nấu chung': 'Host a cooking session',
    'Mời bạn bè cùng nấu, theo dõi tiến độ và trò chuyện trong một buổi nấu diễn ra theo lịch.': 'Invite friends to cook, track progress, and chat during a scheduled cooking session.',
    'SỔ TAY CÔNG THỨC CHUNG': 'SHARED COOKBOOK',
    'Bộ sưu tập riêng & chia sẻ': 'Create and share collections',
    'Tạo và chia sẻ tuyển tập món ăn với gia đình, bạn bè hoặc nhóm nấu cùng nhau.': 'Create and share recipe collections with family, friends, or your cooking group.',
    'GỢI Ý THEO KHẨU VỊ': 'RECOMMENDATIONS FOR YOUR TASTE',
    'Bảng tin cá nhân hóa': 'Personalized recommendations',
    'Chọn chế độ ăn, mức độ cay, độ nhanh, chi phí và yếu tố hạn chế để nhận món phù hợp với bạn.': 'Choose your diet, spice level, prep time, budget, and restrictions to get recipes that suit you.',
    'THỬ THÁCH THEO MÙA': 'SEASONAL CHALLENGES',
    'Bếp theo mùa, ăn theo thời tiết': 'Cook with the seasons',
    'Tham gia thử thách theo mùa để thử món mới, lưu lại thành tích và khích lệ cộng đồng sáng tạo.': 'Join seasonal challenges to try new dishes, record achievements, and inspire the community.',
    'BIÊN TẬP NỔI BẬT': 'EDITOR PICKS',
    'Khám phá món ăn được chọn lọc': 'Discover curated recipes',
    'Những bài viết, mẹo nấu và chuyên đề được biên tập để khơi gợi cảm hứng mỗi ngày.': 'Explore editorial stories, cooking tips, and features to inspire you every day.',
    'HỒ SƠ TÁC GIẢ': 'COOK PROFILE',
    'Trang cá nhân chuyên nghiệp': 'Your professional creator profile',
    'Trình bày hồ sơ tác giả, dòng thời gian công thức, thành tích và các món nổi bật đã chia sẻ.': 'Showcase your profile, recipe timeline, achievements, and featured dishes.',
    'BẢN IN & XUẤT SỔ TAY': 'PRINT & EXPORT',
    'In ấn hoặc lưu dạng sổ tay': 'Print or save as a cookbook',
    'Xuất nội dung công thức thành bảng in đẹp, dễ đọc và sẵn sàng lưu vào sổ tay gia đình.': 'Format recipes as a clean, readable printout for your family cookbook.',
    'CHAT VỚI AI': 'AI CHAT',
    'Trợ lý nấu ăn thông minh': 'Your smart cooking assistant',
    'Hỏi mọi thứ về món ăn, thực đơn, nguyên liệu, khẩu vị, thời gian nấu, hay cách tối ưu hóa bữa ăn của bạn.': 'Ask about recipes, meal plans, ingredients, taste, cooking times, or how to improve your meals.',
    'CÔNG THỨC CỦA BẠN': 'YOUR RECIPES',
    'Đã lưu & bộ sưu tập': 'Saved recipes and collections',
    'Gom những món muốn nấu vào các tuyển tập của riêng bạn.': 'Organize recipes you want to cook into your own collections.',
    'LỊCH BẾP': 'MEAL PLANNER',
    'Thực đơn tuần': 'Weekly meal plan',
    'Chọn món trước, rồi mang theo danh sách nguyên liệu khi đi chợ.': 'Plan your meals and take the combined ingredient list shopping.',
    'SÂN CHƠI CỘNG ĐỒNG': 'COMMUNITY CHALLENGES',
    'Thử thách nấu ăn': 'Cooking challenges',
    'Mỗi tuần một chủ đề mới. Chọn công thức do bạn tạo để tham gia và nhận huy hiệu.': 'A new theme every week. Enter with your own recipe and earn badges.',
    'BẾP CỦA BẠN': 'YOUR KITCHEN',
    'Tổng quan tác giả': 'Creator dashboard',
    'Theo dõi những gì cộng đồng đang đón nhận từ các công thức và bài viết của bạn.': 'See how the community responds to your recipes and posts.',
    'CẬP NHẬT CỦA BẠN': 'YOUR UPDATES',
    'Thông báo': 'Notifications',
    'Lượt theo dõi, yêu thích và cuộc trò chuyện mới nhất.': 'Your latest follows, likes, and conversations.',
    'QUYỀN RIÊNG TƯ': 'PRIVACY',
    'An toàn cộng đồng': 'Community safety',
    'Quản lý thành viên bạn đã chặn và theo dõi các báo cáo đã gửi.': 'Manage blocked members and review reports you have submitted.',
    'BÀI VIẾT CỦA BẠN': 'YOUR POSTS',
    'Bản nháp': 'Drafts',
    'Lưu ý tưởng lại và đăng khi bạn đã sẵn sàng.': 'Save your ideas and publish them when you are ready.',
    'Canh chua cá': 'Vietnamese sweet-and-sour fish soup',
    'Món canh chua thanh ngọt, giàu hương vị và chuẩn bị nhanh cho bữa cơm gia đình.': 'A bright, sweet-and-sour fish soup that is quick to prepare for a family meal.',
    '500g cá basa': '500 g basa fish',
    '200g dứa': '200 g pineapple',
    '1 trái cà chua': '1 tomato',
    '1 củ hành tây': '1 onion',
    '2 nhánh ngò': '2 sprigs cilantro',
    '1 lít nước': '1 liter water',
    '1 muỗng canh giấm': '1 tbsp vinegar',
    'Nồi': 'Pot',
    'Dao': 'Knife',
    'Thớt': 'Cutting board',
    'Muôi': 'Ladle',
    'Cá': 'Fish',
    'Hạt tiêu': 'Black pepper',
    'Thay cá bằng tôm': 'Replace the fish with shrimp',
    'Dùng dứa tươi hoặc dứa đóng hộp': 'Use fresh or canned pineapple',
    'Protein: 24g': 'Protein: 24 g',
    'Vitamin C: 16%': 'Vitamin C: 16%',
    'Calorie: 285 kcal / khẩu phần': 'Calories: 285 kcal / serving',
    '15 phút': '15 min',
    '20 phút': '20 min',
    '25 phút': '25 min',
    '30 phút': '30 min',
    '40 phút': '40 min',
    '45 phút': '45 min',
    '50 phút': '50 min',
    'Gợi ý món theo nguyên liệu': 'Recipe ideas from your ingredients',
    'Đơn vị nguyên liệu': 'Ingredient units',
    'Tăng giảm khẩu phần và chỉnh lượng nguyên liệu theo tỷ lệ thực tế, rồi lưu lựa chọn riêng cho lần nấu tiếp theo.': 'Adjust serving sizes and ingredient amounts proportionally, then save your preference for next time.',
    'Bún chả rau củ': 'Vegetable spring-roll vermicelli bowl',
    'Bún': 'Rice vermicelli',
    'Giò chả': 'Vietnamese sausage',
    'Rau sống': 'Fresh greens',
    'Nước chấm': 'Dipping sauce',
    'g': 'g',
    'ml': 'ml',
    'Đang tải chi tiết món ăn...': 'Loading recipe details...',
    'Không tìm thấy món ăn.': 'Recipe not found.',
    'Quay lại danh sách': 'Back to recipes',
    'Chưa phân loại': 'Uncategorized',
    'Recipe Detail': 'Recipe details',
    'Quay lại': 'Back',
    'Sửa': 'Edit',
    'Xóa': 'Delete',
    'Published': 'Published',
    'Draft': 'Draft',
    'Danh mục:': 'Category:',
    'Tác giả:': 'Author:',
    'Độ khó:': 'Difficulty:',
    'Món chay': 'Vegetarian',
    'Mô tả': 'Description',
    'Chưa có mô tả.': 'No description available.',
    'Nguyên liệu': 'Ingredients',
    'Các bước làm': 'Instructions',
    'Không thể tải danh sách danh mục.': 'Could not load categories.',
    'Không thể tải danh sách công thức.': 'Could not load recipes.',
    'Không thể tải danh mục để gắn cho công thức.': 'Could not load recipe categories.',
    'Quản lý Danh mục': 'Manage categories',
    'Khám phá Danh mục': 'Explore categories',
    'Tên danh mục': 'Category name',
    'Phân loại': 'Type',
    'Hành động': 'Actions',
    'Đang tải danh mục...': 'Loading categories...',
    'Chưa có danh mục nào.': 'No categories yet.',
    'Quản lý Công thức': 'Manage recipes',
    'Khám phá Công thức': 'Explore recipes',
    'món ăn': 'recipes',
    'Tất cả danh mục': 'All categories',
    'Tất cả trạng thái': 'All statuses',
    'Mọi độ khó': 'Any difficulty',
    'Mọi chế độ ăn': 'Any diet',
    'Có thịt/cá': 'Contains meat/fish',
    'Tìm kiếm theo tên công thức': 'Search recipes by name',
    'Tối đa (phút)': 'Maximum (minutes)',
    'Nguyên liệu có chứa...': 'Ingredients include...',
    'Tiêu đề': 'Title',
    'Thuộc Danh mục': 'Category',
    'Không tìm thấy công thức nào.': 'No recipes found.',
    'Đang tải công thức...': 'Loading recipes...',
    'Xem': 'View',
    'Độ khó': 'Difficulty',
    'Dễ': 'Easy',
    'Trung bình': 'Medium',
    'Khó': 'Hard',
    'ID': 'ID',
    'STT': 'No.',
    'Bước trước': 'Previous step',
    'Bước sau': 'Next step',
    'Bước': 'Step',
    'Thời lượng': 'Duration',
    'Thêm mới': 'Add new',
    'Cập nhật danh mục': 'Update category',
    'Thêm danh mục mới': 'Add a category',
    'Món chính': 'Main course',
    'Khai vị': 'Starter',
    'Tráng miệng': 'Dessert',
    'Hủy': 'Cancel',
    'Lưu thay đổi': 'Save changes',
    'Món Việt': 'Vietnamese cuisine',
    'Món chay': 'Vegetarian dishes',
    'Món xào': 'Stir-fries',
    'Món nướng': 'Grilled dishes',
    'Món kho': 'Braised dishes',
    'Món canh': 'Soups',
    'Món súp': 'Soups and stews',
    'Món lẩu': 'Hot pots',
    'Bánh ngọt': 'Sweet treats',
    'Đồ uống': 'Drinks',
    'Các món ăn truyền thống, đậm hương vị Việt Nam.': 'Traditional dishes rich in Vietnamese flavor.',
    'Món ăn thanh đạm, giàu dinh dưỡng và dễ ăn cho mọi đối tượng.': 'Light, nourishing dishes for everyone.',
    'Món xào nhanh, thơm ngon và phù hợp cho bữa tối gia đình.': 'Quick, flavorful stir-fries for family dinners.',
    'Món nướng thơm lừng, có hương khói và vị ngọt tự nhiên.': 'Fragrant grilled dishes with smoky notes and natural sweetness.',
    'Món kho đậm đà, nấu chậm để giữ hương vị đặc trưng.': 'Rich, slow-braised dishes full of flavor.',
    'Canh thanh mát, bổ dưỡng và dễ kết hợp với cơm trắng.': 'Refreshing, nourishing soups that pair well with rice.',
    'Súp nóng, mềm và thích hợp cho những ngày thời tiết se lạnh.': 'Warm, comforting soups for cooler days.',
    'Lẩu đậm vị, ấm áp và rất hợp cho tiệc gia đình.': 'Flavorful hot pots, perfect for family gatherings.',
    'Những món bánh ngọt hấp dẫn, thơm béo và dễ làm.': 'Delicious, rich, easy-to-make desserts.',
    'Đồ uống mát lạnh và nóng, giúp bữa ăn thêm phong phú.': 'Hot and cold drinks to round out any meal.',
    'Bún chả Hà Nội': 'Hanoi grilled pork with vermicelli',
    'Bún chả Hà Nội với thịt nướng thơm lừng, bún tươi và nước chấm chua ngọt đặc trưng.': 'Hanoi-style grilled pork served with fresh rice vermicelli and a signature sweet-and-sour dipping sauce.',
    '200g thịt bò xay': '200 g ground beef',
    '150g thịt lợn nướng': '150 g grilled pork',
    '1 bát bún tươi': '1 bowl fresh rice vermicelli',
    '1 ít rau sống': 'A handful of fresh herbs and greens',
    '2 thìa nước mắm': '2 tbsp fish sauce',
    '1 thìa đường': '1 tbsp sugar',
    '1 quả chanh': '1 lime',
    '1 củ hành tím': '1 shallot',
    'Bước 1: Ướp thịt bò và thịt lợn với gia vị, đường, mắm, tiêu và hành tỏi.': 'Step 1: Marinate the beef and pork with seasonings, sugar, fish sauce, pepper, onion, and garlic.',
    'Bước 2: Nướng thịt trên bếp than cho vàng và thơm.': 'Step 2: Grill the meat over charcoal until golden and fragrant.',
    'Bước 3: Pha nước chấm chua ngọt với chanh, đường và nước mắm.': 'Step 3: Mix lime juice, sugar, and fish sauce to make a sweet-and-sour dipping sauce.',
    'Bước 4: Xếp bún vào bát, thêm thịt nướng, rau sống và chan nước chấm.': 'Step 4: Serve the vermicelli with grilled meat and fresh greens, then add the dipping sauce.',
    'Phở bò Nam Định': 'Nam Dinh beef pho',
    'Phở bò truyền thống với nước dùng ngọt từ xương, thịt bò mềm và hương thơm của quế, gừng.': 'Traditional beef pho with a rich bone broth, tender beef, cinnamon, and ginger.',
    '500g xương bò': '500 g beef bones',
    '200g thịt bò tái': '200 g rare beef slices',
    '1 bánh phở': 'Rice noodles for 1 serving',
    '1 củ gừng': '1 piece of ginger',
    '3 quýt hành': '3 scallions',
    '2 nhánh quế': '2 cinnamon sticks',
    '1 thìa hạt ngò': '1 tsp coriander seeds',
    'Bước 1: Đun xương bò cùng gừng và quế để lấy nước dùng trong và ngọt.': 'Step 1: Simmer the beef bones with ginger and cinnamon to make a clear, flavorful broth.',
    'Bước 2: Chần sơ bánh phở, bỏ vào bát.': 'Step 2: Briefly blanch the rice noodles and place them in a bowl.',
    'Bước 3: Thả thịt bò và hành thơm vào nồi nước dùng.': 'Step 3: Add the beef and scallions to the hot broth.',
    'Bước 4: Trình bày với bánh phở, thịt bò, hành, ngò và chanh.': 'Step 4: Serve the noodles with beef, scallions, coriander, and lime.',
    'Cơm tấm sườn nướng': 'Broken rice with grilled pork chops',
    'Cơm tấm với sườn nướng, trứng ốp la và dưa leo, mang hương vị quen thuộc của miền Nam.': 'Southern Vietnamese broken rice served with grilled pork, a fried egg, and cucumber.',
    '2 bát cơm tấm': '2 bowls cooked broken rice',
    '200g sườn heo': '200 g pork ribs',
    '2 trứng gà': '2 eggs',
    '1 ít dưa leo': 'A little cucumber',
    '1 thìa nước mắm': '1 tbsp fish sauce',
    '1 thìa mật ong': '1 tbsp honey',
    '1 ít rau thơm': 'A handful of fresh herbs',
    'Bước 1: Ướp sườn heo với nước mắm, đường, mật ong, tỏi và tiêu.': 'Step 1: Marinate the pork with fish sauce, sugar, honey, garlic, and pepper.',
    'Bước 2: Nướng sườn chín mềm, có màu vàng đẹp.': 'Step 2: Grill the pork until tender and golden.',
    'Bước 3: Chiên trứng ốp la chín vừa.': 'Step 3: Fry the eggs sunny-side up.',
    'Bước 4: Xếp cơm tấm ra đĩa, kèm sườn, trứng và rau sống.': 'Step 4: Plate the broken rice with pork, eggs, and fresh greens.',
    'Canh chua cá rô đồng': 'Sour fish soup with climbing perch',
    'Canh chua cá rô đồng với me, đậu bắp và cà chua, cay nhẹ, chua thanh.': 'Lightly spicy and tangy sour fish soup with tamarind, okra, and tomato.',
    '300g cá rô đồng': '300 g climbing perch',
    '1 quả cà chua': '1 tomato',
    '100g đậu bắp': '100 g okra',
    '1 nhánh rau thơm': 'A sprig of fresh herbs',
    '2 thìa me xử': '2 tbsp tamarind pulp',
    '1 lát gừng': '1 slice ginger',
    '1 nhánh hành lá': '1 scallion',
    'Bước 1: Làm sạch cá, chấm muối và rửa lại với nước.': 'Step 1: Clean the fish, rub with salt, then rinse.',
    'Bước 2: Nấu nước dùng với me, cà chua và gừng.': 'Step 2: Simmer the broth with tamarind, tomato, and ginger.',
    'Bước 3: Thả cá vào nấu cho săn, rồi thêm đậu bắp.': 'Step 3: Add the fish and cook until firm, then add the okra.',
    'Bước 4: Nêm lại gia vị, thưởng thức với rau thơm.': 'Step 4: Adjust the seasoning and serve with fresh herbs.',
    'Gỏi cuốn tôm thịt': 'Fresh spring rolls with shrimp and pork',
    'Gỏi cuốn thanh mát, chứa tôm, thịt, bún và rau sống, ăn kèm nước chấm đậm vị.': 'Fresh rolls filled with shrimp, pork, vermicelli, and greens, served with a savory dipping sauce.',
    '10 chiếc bánh tráng': '10 rice paper wrappers',
    '100g bún tươi': '100 g fresh rice vermicelli',
    '100g tôm luộc': '100 g cooked shrimp',
    '100g thịt heo luộc': '100 g boiled pork',
    '1 quả dưa leo': '1 cucumber',
    '1 ít rau húng lủi': 'A handful of mint',
    'Bước 1: Ngâm bánh tráng mềm và chuẩn bị nguyên liệu.': 'Step 1: Soften the rice paper and prepare the ingredients.',
    'Bước 2: Xếp rau, bún, thịt và tôm lên bánh tráng.': 'Step 2: Arrange greens, noodles, pork, and shrimp on the rice paper.',
    'Bước 3: Gói kín lại vừa tay.': 'Step 3: Roll everything up snugly.',
    'Bước 4: Dùng với nước chấm mắm tỏi và chanh.': 'Step 4: Serve with a garlic, fish sauce, and lime dip.',
    'Mì xào hải sản': 'Seafood stir-fried noodles',
    'Mì xào hải sản thơm nức với tôm, mực, đậu que và sốt bơ tỏi.': 'Fragrant stir-fried noodles with shrimp, squid, green beans, and garlic butter sauce.',
    '200g mì sợi': '200 g noodles',
    '150g tôm': '150 g shrimp',
    '100g mực': '100 g squid',
    '100g đậu que': '100 g green beans',
    '2 tép tỏi': '2 cloves garlic',
    '1 thìa bơ': '1 tbsp butter',
    '1 thìa tương ớt': '1 tbsp chili sauce',
    '1 thìa dầu hào': '1 tbsp oyster sauce',
    'Bước 1: Luộc mì tới mức chín vừa, vớt ra rổ cho ráo.': 'Step 1: Boil the noodles until just tender, then drain.',
    'Bước 2: Xào tỏi với dầu và bơ cho thơm.': 'Step 2: Stir-fry the garlic in oil and butter until fragrant.',
    'Bước 3: Thêm hải sản, đậu que và mì vào xào đều.': 'Step 3: Add the seafood, green beans, and noodles, then stir-fry together.',
    'Bước 4: Nêm tương ớt, dầu hào và thưởng thức nóng.': 'Step 4: Season with chili and oyster sauce, then serve hot.',
    'Bánh xèo miền Trung': 'Central Vietnamese sizzling pancake',
    'Bánh xèo giòn tan, nhân tôm thịt và giá đỗ, ăn kèm rau sống và nước chấm.': 'Crispy pancake filled with shrimp, pork, and bean sprouts, served with greens and dipping sauce.',
    '150g bột bánh xèo': '150 g bánh xèo pancake mix',
    '100g tôm': '100 g shrimp',
    '100g thịt heo': '100 g pork',
    '100g giá đỗ': '100 g bean sprouts',
    '1 củ hành lá': '1 scallion',
    '1 ít nước cốt dừa': 'A little coconut milk',
    '1 chén nước lạnh': '1 cup cold water',
    'Bước 1: Trộn bột với nước cốt dừa và nước lạnh cho mịn.': 'Step 1: Whisk the flour with coconut milk and cold water until smooth.',
    'Bước 2: Phi hành thơm, cho tôm thịt vào xào sơ.': 'Step 2: Sauté the scallions until fragrant, then briefly cook the shrimp and pork.',
    'Bước 3: Đổ bột lên chảo, cho nhân lên và nướng cho vàng.': 'Step 3: Pour the batter into a hot pan, add the filling, and cook until golden.',
    'Bước 4: Gấp bánh xèo lại và ăn kèm rau sống.': 'Step 4: Fold the pancake and serve with fresh greens.',
    'Cà ri gà Việt Nam': 'Vietnamese chicken curry',
    'Cà ri gà với sữa dừa, khoai tây và cà rốt, hương vị béo thơm và đậm đà.': 'Rich, aromatic chicken curry with coconut milk, potatoes, and carrots.',
    '500g gà ta': '500 g chicken',
    '1 củ khoai tây': '1 potato',
    '2 củ cà rốt': '2 carrots',
    '1 hộp sữa dừa': '1 can coconut milk',
    '2 thìa bột cà ri': '2 tbsp curry powder',
    '1 ít rau thơm': 'A handful of fresh herbs',
    'Bước 1: Ướp gà với hành, tỏi, muối và tiêu.': 'Step 1: Marinate the chicken with onion, garlic, salt, and pepper.',
    'Bước 2: Phi bột cà ri với dầu cho thơm.': 'Step 2: Toast the curry powder in oil until fragrant.',
    'Bước 3: Cho gà, khoai tây và cà rốt vào xào cùng bột cà ri.': 'Step 3: Stir-fry the chicken, potatoes, and carrots with the curry powder.',
    'Bước 4: Thêm sữa dừa và ninh nhỏ lửa đến khi mềm.': 'Step 4: Add the coconut milk and simmer until tender.',
    'Chè bưởi': 'Pomelo sweet soup',
    'Chè bưởi mát lạnh với bưởi, đậu xanh và sữa đặc, thơm ngon và giải nhiệt.': 'A chilled pomelo dessert with mung beans and condensed milk.',
    '200g bưởi tươi': '200 g fresh pomelo',
    '100g đậu xanh': '100 g mung beans',
    '200ml sữa đặc': '200 ml condensed milk',
    '200ml nước cốt dừa': '200 ml coconut milk',
    '1 ít đá': 'A little ice',
    '1 ít vừng rang': 'A little toasted sesame',
    'Bước 1: Nấu đậu xanh cho mềm rồi để nguội.': 'Step 1: Cook the mung beans until tender, then let them cool.',
    'Bước 2: Cắt bưởi thành miếng vừa ăn.': 'Step 2: Cut the pomelo into bite-size pieces.',
    'Bước 3: Trộn bưởi, đậu xanh, sữa đặc, nước cốt dừa và đá.': 'Step 3: Combine the pomelo, mung beans, condensed milk, coconut milk, and ice.',
    'Bước 4: Rắc vừng rang trước khi thưởng thức.': 'Step 4: Sprinkle with toasted sesame before serving.',
    'Sinh tố xoài': 'Mango smoothie',
    'Sinh tố xoài mát lạnh, ngọt thanh, giàu vitamin và rất phù hợp cho buổi chiều nắng nóng.': 'A refreshing, lightly sweet mango smoothie, perfect for a hot afternoon.',
    '2 trái xoài chín': '2 ripe mangoes',
    '200ml sữa tươi': '200 ml milk',
    '1 hộp yogurt': '1 cup yogurt',
    '1 ít đá viên': 'A few ice cubes',
    '2 thìa đường': '2 tbsp sugar',
    '1 ít nước lọc': 'A little water',
    'Bước 1: Gọt xoài, bỏ hạt và cắt nhỏ.': 'Step 1: Peel and pit the mangoes, then cut them into small pieces.',
    'Bước 2: Cho xoài, sữa tươi, yogurt và đường vào máy xay.': 'Step 2: Add the mango, milk, yogurt, and sugar to a blender.',
    'Bước 3: Xay nhuyễn, thêm đá và xay tiếp cho mịn.': 'Step 3: Blend until smooth, add ice, and blend again.',
    'Bước 4: Rót ra ly, thưởng thức ngay khi còn lạnh.': 'Step 4: Pour into glasses and serve chilled.'
};
function readSettings() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        return {
            language: [
                'vi',
                'en',
                'fr'
            ].includes(stored?.language) ? stored.language : DEFAULT_SETTINGS.language,
            unit: [
                'g',
                'oz',
                'cup'
            ].includes(stored?.unit) ? stored.unit : DEFAULT_SETTINGS.unit,
            region: [
                'VN',
                'US',
                'EU'
            ].includes(stored?.region) ? stored.region : DEFAULT_SETTINGS.region
        };
    } catch  {
        return DEFAULT_SETTINGS;
    }
}
const LocaleContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    settings: DEFAULT_SETTINGS,
    applySettings: ()=>{},
    t: (value)=>value,
    normalizeInput: (value)=>value
});
function LocaleProvider({ children }) {
    _s();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(readSettings);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocaleProvider.useEffect": ()=>{
            document.documentElement.lang = settings.language;
        }
    }["LocaleProvider.useEffect"], [
        settings.language
    ]);
    const applySettings = (nextSettings)=>{
        const normalized = {
            language: [
                'vi',
                'en',
                'fr'
            ].includes(nextSettings.language) ? nextSettings.language : 'vi',
            unit: [
                'g',
                'oz',
                'cup'
            ].includes(nextSettings.unit) ? nextSettings.unit : 'g',
            region: [
                'VN',
                'US',
                'EU'
            ].includes(nextSettings.region) ? nextSettings.region : 'VN'
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        setSettings(normalized);
    };
    const t = (value)=>settings.language === 'en' ? englishTranslations[value] || value : value;
    const englishToSource = new Map(Object.entries(englishTranslations).map(([source, translated])=>[
            translated.toLowerCase(),
            source.toLowerCase()
        ]));
    const normalizeInput = (value)=>settings.language === 'en' ? englishToSource.get(value.trim().toLowerCase()) || value.trim().toLowerCase() : value.trim().toLowerCase();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LocaleContext.Provider, {
        value: {
            settings,
            applySettings,
            t,
            normalizeInput
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/LocaleContext.jsx",
        lineNumber: 553,
        columnNumber: 5
    }, this);
}
_s(LocaleProvider, "We39ddN/ieu4wY6EjJ9tGtDI/bI=");
_c = LocaleProvider;
function useLocale() {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LocaleContext);
}
_s1(useLocale, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "LocaleProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "login",
    ()=>login,
    "register",
    ()=>register
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/config.js [app-client] (ecmascript)");
;
async function submitAuthRequest(action, request) {
    let response;
    try {
        response = await fetch(`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVersionedApiBaseUrl"])()}/auth/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
    } catch  {
        return {
            ok: false,
            message: 'Không thể kết nối đến máy chủ.'
        };
    }
    let payload;
    try {
        payload = await response.json();
    } catch  {
        return {
            ok: false,
            message: 'Máy chủ trả về dữ liệu không hợp lệ.'
        };
    }
    if (!response.ok) {
        return {
            ok: false,
            message: payload.message ?? ('detail' in payload ? payload.detail : undefined) ?? 'Đăng nhập thất bại.'
        };
    }
    if (!('data' in payload) || !payload.data) {
        return {
            ok: false,
            message: 'Máy chủ không trả về thông tin phiên đăng nhập.'
        };
    }
    return {
        ok: true,
        data: payload.data,
        message: payload.message
    };
}
function login(request) {
    return submitAuthRequest('login', request);
}
function register(request) {
    return submitAuthRequest('register', request);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/config.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getApiBaseUrl",
    ()=>getApiBaseUrl,
    "getSiteUrl",
    ()=>getSiteUrl,
    "getVersionedApiBaseUrl",
    ()=>getVersionedApiBaseUrl,
    "normalizeApiResponse",
    ()=>normalizeApiResponse,
    "readApiResponse",
    ()=>readApiResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function getApiBaseUrl() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:5152/api';
}
function getVersionedApiBaseUrl() {
    return `${getApiBaseUrl().replace(/\/$/, '')}/v1`;
}
function normalizeApiResponse(payload) {
    if (!payload || typeof payload !== 'object') return payload;
    if (payload.detail && !payload.message) {
        payload.message = payload.detail;
    }
    if (Object.hasOwn(payload, 'data')) {
        if (Object.hasOwn(payload, 'meta')) return {
            ...payload.meta,
            items: payload.data
        };
        if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
            return {
                ...payload.data,
                ...payload.message ? {
                    message: payload.message
                } : {}
            };
        }
        return payload.data;
    }
    return payload;
}
async function readApiResponse(response) {
    const text = await response.text();
    if (!text) return {};
    try {
        return normalizeApiResponse(JSON.parse(text));
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(text.replace(/\s+/g, ' ').trim().slice(0, 200) || 'Máy chủ trả về dữ liệu không hợp lệ.');
        }
        throw error;
    }
}
function getSiteUrl() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/routes/wizard.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-router/dist/development/chunk-OB3PAWPO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/config.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const API_BASE = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVersionedApiBaseUrl"])();
function CreateRecipeWizard() {
    _s();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        description: '',
        categoryId: '',
        prepTimeMinutes: 1,
        cookTimeMinutes: 0,
        servings: 2,
        difficulty: 'Medium',
        isVegetarian: false,
        ingredients: [
            {
                name: '',
                quantity: '',
                unit: '',
                notes: ''
            }
        ],
        steps: [
            {
                title: '',
                description: '',
                timerMinutes: ''
            }
        ]
    });
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingCategories, setLoadingCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateRecipeWizard.useEffect": ()=>{
            const loadCategories = {
                "CreateRecipeWizard.useEffect.loadCategories": async ()=>{
                    const token = localStorage.getItem('accessToken');
                    try {
                        const response = await fetch(`${API_BASE}/categories`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        if (!response.ok) {
                            throw new Error('Không thể tải danh mục.');
                        }
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"])(response);
                        setCategories(data);
                        if (data[0] && !form.categoryId) {
                            setForm({
                                "CreateRecipeWizard.useEffect.loadCategories": (current)=>({
                                        ...current,
                                        categoryId: data[0].id
                                    })
                            }["CreateRecipeWizard.useEffect.loadCategories"]);
                        }
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
                    } finally{
                        setLoadingCategories(false);
                    }
                }
            }["CreateRecipeWizard.useEffect.loadCategories"];
            loadCategories();
        }
    }["CreateRecipeWizard.useEffect"], []);
    const nextStep = ()=>{
        if (step === 1 && (!form.title.trim() || !form.categoryId)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập tiêu đề và chọn danh mục.');
            return;
        }
        if (step === 2 && form.ingredients.some((item)=>!item.name.trim())) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Tên nguyên liệu không được để trống.');
            return;
        }
        if (step === 3 && form.steps.some((item)=>!item.description.trim())) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Mỗi bước làm cần có mô tả.');
            return;
        }
        setStep((current)=>Math.min(current + 1, 3));
    };
    const prevStep = ()=>setStep((current)=>Math.max(current - 1, 1));
    const updateIngredient = (index, field, value)=>{
        setForm((current)=>({
                ...current,
                ingredients: current.ingredients.map((item, i)=>i === index ? {
                        ...item,
                        [field]: value
                    } : item)
            }));
    };
    const addIngredient = ()=>{
        setForm((current)=>({
                ...current,
                ingredients: [
                    ...current.ingredients,
                    {
                        name: '',
                        quantity: '',
                        unit: '',
                        notes: ''
                    }
                ]
            }));
    };
    const removeIngredient = (index)=>{
        setForm((current)=>({
                ...current,
                ingredients: current.ingredients.filter((_, i)=>i !== index)
            }));
    };
    const updateStep = (index, field, value)=>{
        setForm((current)=>({
                ...current,
                steps: current.steps.map((item, i)=>i === index ? {
                        ...item,
                        [field]: value
                    } : item)
            }));
    };
    const addStep = ()=>{
        setForm((current)=>({
                ...current,
                steps: [
                    ...current.steps,
                    {
                        title: '',
                        description: '',
                        timerMinutes: ''
                    }
                ]
            }));
    };
    const removeStep = (index)=>{
        setForm((current)=>({
                ...current,
                steps: current.steps.filter((_, i)=>i !== index)
            }));
    };
    const handleSubmit = async ()=>{
        const token = localStorage.getItem('accessToken');
        if (!token) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            return;
        }
        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            categoryId: form.categoryId,
            prepTimeMinutes: Number(form.prepTimeMinutes),
            cookTimeMinutes: Number(form.cookTimeMinutes),
            servings: Number(form.servings),
            difficulty: form.difficulty,
            isVegetarian: form.isVegetarian,
            ingredients: form.ingredients.map((item)=>{
                const name = item.name.trim();
                const quantity = item.quantity?.trim() || '';
                const unit = item.unit?.trim() || '';
                if (!name) return '';
                const notes = item.notes?.trim() || '';
                return [
                    quantity,
                    unit,
                    name,
                    notes
                ].filter(Boolean).join(' ');
            }).filter(Boolean),
            instructions: form.steps.map((item, index)=>{
                const title = item.title.trim();
                const description = item.description.trim();
                if (!description) return '';
                return title ? `${title}: ${description}` : description;
            }).filter(Boolean),
            recipeIngredients: form.ingredients.map((item, index)=>({
                    name: item.name.trim(),
                    quantity: item.quantity?.trim() || null,
                    unit: item.unit?.trim() || null,
                    notes: item.notes?.trim() || null,
                    orderIndex: index + 1
                })).filter((item)=>item.name),
            recipeSteps: form.steps.map((item, index)=>({
                    title: item.title.trim(),
                    description: item.description.trim(),
                    timerMinutes: item.timerMinutes ? Number(item.timerMinutes) : null
                })).filter((item)=>item.description)
        };
        try {
            const response = await fetch(`${API_BASE}/recipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readApiResponse"])(response);
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
            if (!response.ok) {
                throw new Error(data.message || 'Tạo công thức thất bại.');
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tạo công thức thành công!');
            navigate('/recipes');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "content-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "eyebrow",
                            children: "Bếp Nhà"
                        }, void 0, false, {
                            fileName: "[project]/src/routes/wizard.jsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Tạo công thức mới"
                        }, void 0, false, {
                            fileName: "[project]/src/routes/wizard.jsx",
                            lineNumber: 204,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/routes/wizard.jsx",
                    lineNumber: 202,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/routes/wizard.jsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "wizard-shell",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "wizard-progress",
                        children: [
                            1,
                            2,
                            3
                        ].map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `step-pill ${step === value ? 'active' : ''}`,
                                children: [
                                    "Bước ",
                                    value
                                ]
                            }, value, true, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/routes/wizard.jsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this),
                    step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "wizard-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "Tiêu đề"
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 220,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: form.title,
                                        onChange: (event)=>setForm({
                                                ...form,
                                                title: event.target.value
                                            }),
                                        placeholder: "Ví dụ: Bún chả Hà Nội"
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 219,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "Mô tả"
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 230,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        rows: "4",
                                        value: form.description,
                                        onChange: (event)=>setForm({
                                                ...form,
                                                description: event.target.value
                                            }),
                                        placeholder: "Mô tả ngắn gọn về món ăn..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "Danh mục"
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 240,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: form.categoryId,
                                        disabled: loadingCategories,
                                        onChange: (event)=>setForm({
                                                ...form,
                                                categoryId: event.target.value
                                            }),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "-- Chọn danh mục --"
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 246,
                                                columnNumber: 17
                                            }, this),
                                            categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: category.id,
                                                    children: category.name
                                                }, category.id, false, {
                                                    fileName: "[project]/src/routes/wizard.jsx",
                                                    lineNumber: 248,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 239,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "Prep time (phút)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: "1",
                                        value: form.prepTimeMinutes,
                                        onChange: (event)=>setForm({
                                                ...form,
                                                prepTimeMinutes: event.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "Cook time (phút)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: "0",
                                        value: form.cookTimeMinutes,
                                        onChange: (event)=>setForm({
                                                ...form,
                                                cookTimeMinutes: event.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 257,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "Servings"
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: "1",
                                        value: form.servings,
                                        onChange: (event)=>setForm({
                                                ...form,
                                                servings: event.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 259,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 253,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: "Độ khó"
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: form.difficulty,
                                        onChange: (event)=>setForm({
                                                ...form,
                                                difficulty: event.target.value
                                            }),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Easy",
                                                children: "Easy"
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 264,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Medium",
                                                children: "Medium"
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 264,
                                                columnNumber: 51
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Hard",
                                                children: "Hard"
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 264,
                                                columnNumber: 89
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Expert",
                                                children: "Expert"
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 264,
                                                columnNumber: 123
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 263,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 261,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "recipe-vegetarian-toggle",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: form.isVegetarian,
                                        onChange: (event)=>setForm({
                                                ...form,
                                                isVegetarian: event.target.checked
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 267,
                                        columnNumber: 57
                                    }, this),
                                    " Món chay"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/routes/wizard.jsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this),
                    step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "wizard-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stack-list",
                                children: form.ingredients.map((ingredient, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ingredient-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Tên nguyên liệu",
                                                value: ingredient.name,
                                                onChange: (event)=>updateIngredient(index, 'name', event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 276,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Số lượng",
                                                value: ingredient.quantity,
                                                onChange: (event)=>updateIngredient(index, 'quantity', event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 282,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Đơn vị",
                                                value: ingredient.unit,
                                                onChange: (event)=>updateIngredient(index, 'unit', event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 288,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Ghi chú (không bắt buộc)",
                                                value: ingredient.notes,
                                                onChange: (event)=>updateIngredient(index, 'notes', event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 294,
                                                columnNumber: 19
                                            }, this),
                                            form.ingredients.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "small-btn delete",
                                                onClick: ()=>removeIngredient(index),
                                                children: "Xóa"
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 296,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 275,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 273,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "secondary-btn",
                                onClick: addIngredient,
                                children: "+ Thêm nguyên liệu"
                            }, void 0, false, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 302,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/routes/wizard.jsx",
                        lineNumber: 272,
                        columnNumber: 11
                    }, this),
                    step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "wizard-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stack-list",
                                children: form.steps.map((stepItem, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: `Tên bước ${index + 1} (không bắt buộc)`,
                                                value: stepItem.title,
                                                onChange: (event)=>updateStep(index, 'title', event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 311,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                rows: "3",
                                                placeholder: "Mô tả từng bước...",
                                                value: stepItem.description,
                                                onChange: (event)=>updateStep(index, 'description', event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 312,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: "0",
                                                max: "1440",
                                                placeholder: "Thời gian hẹn giờ (phút)",
                                                value: stepItem.timerMinutes,
                                                onChange: (event)=>updateStep(index, 'timerMinutes', event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 318,
                                                columnNumber: 19
                                            }, this),
                                            form.steps.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "small-btn delete",
                                                onClick: ()=>removeStep(index),
                                                children: "Xóa"
                                            }, void 0, false, {
                                                fileName: "[project]/src/routes/wizard.jsx",
                                                lineNumber: 320,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/src/routes/wizard.jsx",
                                        lineNumber: 310,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 308,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "secondary-btn",
                                onClick: addStep,
                                children: "+ Thêm bước làm"
                            }, void 0, false, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 326,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/routes/wizard.jsx",
                        lineNumber: 307,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "wizard-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "secondary-btn",
                                onClick: prevStep,
                                disabled: step === 1,
                                children: "Quay lại"
                            }, void 0, false, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 331,
                                columnNumber: 11
                            }, this),
                            step < 3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "primary-btn",
                                onClick: nextStep,
                                children: "Tiếp tục"
                            }, void 0, false, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 333,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "primary-btn",
                                onClick: handleSubmit,
                                children: "Hoàn tất"
                            }, void 0, false, {
                                fileName: "[project]/src/routes/wizard.jsx",
                                lineNumber: 335,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/routes/wizard.jsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/routes/wizard.jsx",
                lineNumber: 208,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/routes/wizard.jsx",
        lineNumber: 200,
        columnNumber: 5
    }, this);
}
_s(CreateRecipeWizard, "DK+kjwdbwLDA/wK+zHE30zxd7r4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$OB3PAWPO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigate"]
    ];
});
_c = CreateRecipeWizard;
const __TURBOPACK__default__export__ = CreateRecipeWizard;
var _c;
__turbopack_context__.k.register(_c, "CreateRecipeWizard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0u-5xwb._.js.map