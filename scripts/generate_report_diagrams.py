from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math

OUT = Path(r"D:\CulinaryBlog\tmp\final-report\report-assets")
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1800, 1050
NAVY = "#0D2A4A"
BLUE = "#2B6CB0"
ORANGE = "#F2A900"
GREEN = "#2E7D5B"
LIGHT = "#F4F7FA"
PALE_BLUE = "#EAF2F8"
PALE_GREEN = "#EAF3EF"
PALE_ORANGE = "#FBF3E2"
TEXT = "#243447"
MUTED = "#64748B"
WHITE = "#FFFFFF"

FONT_REG = r"C:\Windows\Fonts\arial.ttf"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def canvas(title, subtitle=""):
    im = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 115), fill=NAVY)
    d.text((70, 28), title, font=font(42, True), fill=WHITE)
    if subtitle:
        d.text((72, 78), subtitle, font=font(20), fill="#DCE7F3")
    return im, d


def box(d, xy, title, lines=(), fill=LIGHT, outline="#B7C4D1", title_fill=NAVY, radius=20):
    x1, y1, x2, y2 = xy
    d.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=3)
    d.text((x1 + 22, y1 + 16), title, font=font(27, True), fill=title_fill)
    y = y1 + 58
    for line in lines:
        d.text((x1 + 22, y), f"• {line}", font=font(20), fill=TEXT)
        y += 31


def arrow(d, start, end, color=BLUE, width=5, label=None):
    d.line((start, end), fill=color, width=width)
    ang = math.atan2(end[1] - start[1], end[0] - start[0])
    length = 18
    a1 = ang + math.pi * 0.83
    a2 = ang - math.pi * 0.83
    p1 = (end[0] + length * math.cos(a1), end[1] + length * math.sin(a1))
    p2 = (end[0] + length * math.cos(a2), end[1] + length * math.sin(a2))
    d.polygon((end, p1, p2), fill=color)
    if label:
        mx, my = (start[0] + end[0]) / 2, (start[1] + end[1]) / 2
        d.rounded_rectangle((mx - 75, my - 20, mx + 75, my + 18), radius=8, fill=WHITE)
        d.text((mx - 65, my - 15), label, font=font(17, True), fill=color)


def actor(d, x, y, name, color=NAVY):
    d.ellipse((x - 22, y, x + 22, y + 44), outline=color, width=5)
    d.line((x, y + 44, x, y + 125), fill=color, width=5)
    d.line((x - 52, y + 73, x + 52, y + 73), fill=color, width=5)
    d.line((x, y + 125, x - 43, y + 185), fill=color, width=5)
    d.line((x, y + 125, x + 43, y + 185), fill=color, width=5)
    tw = d.textbbox((0, 0), name, font=font(25, True))[2]
    d.text((x - tw / 2, y + 200), name, font=font(25, True), fill=color)


def use_case():
    im, d = canvas("SƠ ĐỒ USE CASE TỔNG QUÁT", "Bốn vai trò và các nhóm chức năng chính của Culinary Blog")
    d.rounded_rectangle((330, 155, 1470, 970), radius=30, fill="#FBFCFE", outline="#94A3B8", width=4)
    d.text((700, 170), "HỆ THỐNG CULINARY BLOG", font=font(28, True), fill=NAVY)
    actor(d, 150, 230, "Khách")
    actor(d, 150, 620, "Người dùng")
    actor(d, 1650, 230, "Tác giả")
    actor(d, 1650, 620, "Quản trị viên")
    cases = [
        (500, 270, 790, 360, "Xem công thức\nDanh mục • Tìm kiếm"),
        (500, 470, 790, 560, "Đăng ký • Đăng nhập\nHồ sơ • Bảo mật"),
        (500, 670, 790, 760, "Lưu và tương tác\nvới nội dung"),
        (1010, 270, 1300, 360, "Tạo và chỉnh sửa\ncông thức"),
        (1010, 470, 1300, 560, "Xuất bản • Lưu trữ\nQuản lý ảnh"),
        (1010, 670, 1300, 760, "Quản lý người dùng\nDanh mục • Phiên"),
        (755, 825, 1045, 915, "2FA • Thu hồi phiên\nXóa tài khoản"),
    ]
    for x1, y1, x2, y2, text in cases:
        d.rounded_rectangle((x1, y1, x2, y2), radius=45, fill=PALE_BLUE, outline=BLUE, width=3)
        lines = text.split("\n")
        for idx, line in enumerate(lines):
            tw = d.textbbox((0, 0), line, font=font(21, idx == 0))[2]
            d.text(((x1 + x2 - tw) / 2, y1 + 17 + idx * 31), line, font=font(21, idx == 0), fill=TEXT)
    for y, target in [(320, (500, 315)), (710, (500, 715)), (710, (755, 870))]:
        arrow(d, (205, y), target, color=GREEN, width=4)
    for y, target in [(320, (1300, 315)), (470, (1300, 515)), (710, (1300, 715)), (810, (1045, 870))]:
        arrow(d, (1595, y), target, color=ORANGE, width=4)
    im.save(OUT / "so-do-use-case.png", quality=95)


def architecture():
    im, d = canvas("KIẾN TRÚC CLEAN ARCHITECTURE", "Dependency Rule: tầng trong không phụ thuộc tầng ngoài")
    layers = [
        ((120, 190, 1680, 950), "API & FRONTEND", "Minimal API • Middleware • Next.js • React", "#E8EEF7", NAVY),
        ((250, 300, 1550, 875), "INFRASTRUCTURE", "EF Core • PostgreSQL • Redis • MinIO • Hangfire", PALE_GREEN, GREEN),
        ((390, 420, 1410, 800), "APPLICATION", "CQRS • DTO • Validator • Interface • Use case", PALE_BLUE, BLUE),
        ((560, 555, 1240, 735), "DOMAIN", "Entity • Enum • Domain rule • Exception", PALE_ORANGE, ORANGE),
    ]
    for xy, title, desc, fill, color in layers:
        d.rounded_rectangle(xy, radius=30, fill=fill, outline=color, width=5)
        x1, y1, x2, _ = xy
        d.text((x1 + 28, y1 + 24), title, font=font(31, True), fill=color)
        d.text((x1 + 28, y1 + 68), desc, font=font(21), fill=TEXT)
    arrow(d, (1630, 840), (1280, 720), label="phụ thuộc")
    arrow(d, (1510, 740), (1420, 690))
    arrow(d, (1370, 650), (1250, 650))
    d.text((610, 960), "Mọi phụ thuộc hướng vào Domain; hạ tầng được thay thế qua abstraction.", font=font(22, True), fill=NAVY)
    im.save(OUT / "so-do-clean-architecture.png", quality=95)


def deployment():
    im, d = canvas("SƠ ĐỒ TRIỂN KHAI HỆ THỐNG", "Các dịch vụ trong Docker Compose và luồng truy cập chính")
    box(d, (70, 410, 300, 610), "Người dùng", ["Trình duyệt", "Desktop/Mobile"], PALE_ORANGE, ORANGE)
    box(d, (390, 380, 650, 640), "Nginx", ["Reverse proxy", "TLS/route"], PALE_BLUE, BLUE)
    box(d, (760, 195, 1070, 405), "Frontend", ["Next.js 16", "React/TypeScript"], "#EEF2FF", "#4F46E5")
    box(d, (760, 610, 1070, 850), "Backend API", ["ASP.NET Core", "Minimal API", "Hangfire server"], PALE_GREEN, GREEN)
    box(d, (1210, 160, 1510, 345), "PostgreSQL", ["Dữ liệu nghiệp vụ"], LIGHT, NAVY)
    box(d, (1210, 390, 1510, 575), "Redis", ["Cache", "Rate limit"], PALE_ORANGE, ORANGE)
    box(d, (1210, 620, 1510, 805), "MinIO", ["Ảnh công thức"], PALE_BLUE, BLUE)
    box(d, (1540, 250, 1740, 715), "Quan sát", ["Jaeger", "Prometheus", "Grafana", "Serilog"], "#F5F3FF", "#7C3AED")
    arrow(d, (300, 510), (390, 510), label="HTTP")
    arrow(d, (650, 455), (760, 300))
    arrow(d, (650, 565), (760, 720))
    arrow(d, (1070, 700), (1210, 252))
    arrow(d, (1070, 730), (1210, 482))
    arrow(d, (1070, 760), (1210, 712))
    arrow(d, (1070, 650), (1540, 500), color="#7C3AED")
    d.text((560, 930), "Docker network nội bộ • cấu hình qua biến môi trường • health check cho từng dịch vụ", font=font(23, True), fill=NAVY)
    im.save(OUT / "so-do-trien-khai.png", quality=95)


def erd():
    im, d = canvas("SƠ ĐỒ ERD TÓM TẮT", "Các thực thể cốt lõi và quan hệ chính")
    box(d, (70, 185, 390, 410), "Users", ["Id (PK)", "Email", "Role", "DeletedAt"], PALE_BLUE, BLUE)
    box(d, (70, 650, 390, 900), "RefreshTokens", ["Id (PK)", "UserId (FK)", "ExpiresAt", "RevokedAt"], LIGHT, NAVY)
    box(d, (525, 160, 875, 395), "Categories", ["Id (PK)", "Name", "Slug", "ImageUrl"], PALE_ORANGE, ORANGE)
    box(d, (525, 510, 925, 850), "Recipes", ["Id (PK)", "AuthorId (FK)", "CategoryId (FK)", "Title • Slug", "Status • Times"], PALE_GREEN, GREEN)
    box(d, (1080, 150, 1430, 390), "Ingredients", ["Id (PK)", "RecipeId (FK)", "Name", "Quantity • Unit"], PALE_BLUE, BLUE)
    box(d, (1080, 430, 1430, 670), "Steps", ["Id (PK)", "RecipeId (FK)", "Order", "Instruction"], PALE_ORANGE, ORANGE)
    box(d, (1080, 710, 1430, 945), "RecipeImages", ["Id (PK)", "RecipeId (FK)", "ObjectKey", "IsPrimary"], "#F5F3FF", "#7C3AED")
    box(d, (1510, 430, 1740, 675), "Quan hệ mở rộng", ["Favorites", "Comments", "Ratings", "Collections"], LIGHT, MUTED)
    arrow(d, (230, 410), (230, 650), label="1 - N")
    arrow(d, (390, 300), (610, 510), label="1 - N")
    arrow(d, (700, 395), (700, 510), label="1 - N")
    arrow(d, (925, 590), (1080, 270), label="1 - N")
    arrow(d, (925, 650), (1080, 550), label="1 - N")
    arrow(d, (925, 730), (1080, 825), label="1 - N")
    arrow(d, (1430, 550), (1510, 550), color=MUTED)
    im.save(OUT / "so-do-erd.png", quality=95)


def lifecycle():
    im, d = canvas("VÒNG ĐỜI CÔNG THỨC", "Trạng thái, quyền thay đổi và tác động tới dữ liệu công khai")
    states = [
        (90, 380, 390, 620, "BẢN NHÁP", ["Tác giả tạo/sửa", "Chưa hiển thị công khai"], PALE_ORANGE, ORANGE),
        (565, 380, 865, 620, "ĐÃ XUẤT BẢN", ["Public/Search/SEO", "Cache dữ liệu đọc"], PALE_GREEN, GREEN),
        (1040, 380, 1340, 620, "ĐÃ LƯU TRỮ", ["Ẩn khỏi public", "Giữ dữ liệu để phục hồi"], PALE_BLUE, BLUE),
        (1470, 380, 1730, 620, "ĐÃ XÓA", ["Soft delete", "Admin/audit"], LIGHT, MUTED),
    ]
    for x1, y1, x2, y2, title, lines, fill, color in states:
        box(d, (x1, y1, x2, y2), title, lines, fill, color, color)
    arrow(d, (390, 500), (565, 500), label="Publish")
    arrow(d, (865, 500), (1040, 500), label="Archive")
    arrow(d, (1340, 500), (1470, 500), label="Delete")
    arrow(d, (1050, 680), (840, 680), color=GREEN, label="Restore")
    d.line((1050, 680, 1050, 620), fill=GREEN, width=5)
    d.line((840, 680, 840, 620), fill=GREEN, width=5)
    arrow(d, (700, 315), (700, 380), color=ORANGE, label="Update")
    d.text((100, 790), "Quyền:", font=font(27, True), fill=NAVY)
    d.text((220, 790), "Tác giả chỉ thay đổi công thức mình sở hữu; Quản trị viên có quyền xử lý nội dung toàn hệ thống.", font=font(24), fill=TEXT)
    d.text((100, 845), "Đồng bộ:", font=font(27, True), fill=NAVY)
    d.text((245, 845), "Mọi thay đổi trạng thái phải cập nhật bộ đếm danh mục, tìm kiếm, sitemap và vô hiệu hóa cache.", font=font(24), fill=TEXT)
    im.save(OUT / "so-do-vong-doi-cong-thuc.png", quality=95)


def erd_slide():
    im = Image.new("RGB", (1600, 900), WHITE)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((10, 10, 1590, 890), radius=28, fill="#FBFCFE", outline="#CBD5E1", width=3)

    def entity(xy, name, fields, fill, color):
        x1, y1, x2, y2 = xy
        d.rounded_rectangle(xy, radius=18, fill=fill, outline=color, width=4)
        d.rectangle((x1, y1, x2, y1 + 55), fill=color)
        d.text((x1 + 18, y1 + 11), name, font=font(27, True), fill=WHITE)
        y = y1 + 70
        for field in fields:
            d.text((x1 + 18, y), f"• {field}", font=font(20), fill=TEXT)
            y += 30

    entity((60, 80, 390, 290), "USERS", ["Id (PK)", "Email", "Role"], PALE_BLUE, BLUE)
    entity((60, 345, 390, 555), "REFRESH TOKENS", ["Id (PK)", "UserId (FK)", "RevokedAt"], LIGHT, NAVY)
    entity((60, 610, 390, 820), "CATEGORIES", ["Id (PK)", "Name", "Slug"], PALE_ORANGE, ORANGE)
    entity((560, 250, 990, 665), "RECIPES", ["Id (PK)", "AuthorId (FK)", "CategoryId (FK)", "Title • Slug", "Status • Times", "Nutrition"], PALE_GREEN, GREEN)
    entity((1170, 65, 1535, 275), "INGREDIENTS", ["RecipeId (FK)", "Name", "Quantity • Unit"], PALE_BLUE, BLUE)
    entity((1170, 345, 1535, 555), "STEPS", ["RecipeId (FK)", "Order", "Instruction"], PALE_ORANGE, ORANGE)
    entity((1170, 625, 1535, 835), "RECIPE IMAGES", ["RecipeId (FK)", "ObjectKey", "IsPrimary"], "#F5F3FF", "#7C3AED")

    arrow(d, (225, 290), (225, 345), color=NAVY, label="1 - N")
    arrow(d, (390, 185), (560, 350), color=BLUE, label="1 - N")
    arrow(d, (390, 715), (560, 565), color=ORANGE, label="1 - N")
    arrow(d, (990, 345), (1170, 170), color=BLUE, label="1 - N")
    arrow(d, (990, 455), (1170, 450), color=ORANGE, label="1 - N")
    arrow(d, (990, 575), (1170, 730), color="#7C3AED", label="1 - N")
    im.save(OUT / "so-do-erd-slide.png", quality=95)


if __name__ == "__main__":
    use_case()
    architecture()
    deployment()
    erd()
    lifecycle()
    erd_slide()
    for p in sorted(OUT.glob("so-do-*.png")):
        print(p)
