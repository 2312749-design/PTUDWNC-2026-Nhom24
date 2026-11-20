from __future__ import annotations

import copy
import os
import zipfile
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor


ROOT = Path(r"D:\CulinaryBlog")
REFERENCE = Path(r"D:\Downloads\MauThietKe_CuoiKy.docx")
OUTPUT = ROOT / "output" / "BaoCao_DoAn_CulinaryBlog_co_so_do.docx"
ASSET_DIR = ROOT / "tmp" / "final-report" / "report-assets"

NAVY = "0D2A4A"
BLUE = "2B6CB0"
ORANGE = "F2A900"
PALE_BLUE = "EAF2F8"
PALE_GREEN = "EAF3EF"
PALE_ORANGE = "FBF3E2"
LIGHT = "F3F5F7"
MID = "D6DEE8"
TEXT = "243447"


def set_cell_shading(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_border(cell, color: str = MID, size: str = "6") -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = tc_pr.first_child_found_in("w:tcBorders")
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tc_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = qn(f"w:{edge}")
        element = borders.find(tag)
        if element is None:
            element = OxmlElement(f"w:{edge}")
            borders.append(element)
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), size)
        element.set(qn("w:color"), color)


def set_repeat_table_header(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def add_field(run, instruction: str) -> None:
    fld_char = OxmlElement("w:fldChar")
    fld_char.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = instruction
    separate = OxmlElement("w:fldChar")
    separate.set(qn("w:fldCharType"), "separate")
    text = OxmlElement("w:t")
    text.text = "Cập nhật mục lục trong Microsoft Word (Ctrl+A, F9)."
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    for element in (fld_char, instr, separate, text, end):
        run._r.append(element)


def set_run(run, size=11, bold=False, color=TEXT, font="Times New Roman", italic=False):
    run.font.name = font
    run._element.rPr.rFonts.set(qn("w:eastAsia"), font)
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)


def style_paragraph(paragraph, before=0, after=6, line=1.15, align=None):
    fmt = paragraph.paragraph_format
    fmt.space_before = Pt(before)
    fmt.space_after = Pt(after)
    fmt.line_spacing = line
    if align is not None:
        paragraph.alignment = align


def add_text(doc, text, *, bold=False, italic=False, size=12.5, color=TEXT,
             align=WD_ALIGN_PARAGRAPH.JUSTIFY, before=0, after=6):
    p = doc.add_paragraph()
    style_paragraph(p, before, after, 1.3, align)
    set_run(p.add_run(text), size=size, bold=bold, color=color, italic=italic)
    return p


def add_bullets(doc, items, level=0, size=11.5):
    for item in items:
        p = doc.add_paragraph(style="List Bullet" if level == 0 else "List Bullet 2")
        style_paragraph(p, 0, 4, 1.2)
        set_run(p.add_run(item), size=size)


def add_heading(doc, text, level=1):
    p = doc.add_paragraph(style=f"Heading {min(level, 3)}")
    style_paragraph(p, 4 if level > 1 else 0, 8 if level == 1 else 5, 1.05)
    run = p.add_run(text)
    set_run(run, size={1: 16, 2: 13, 3: 11.5}.get(level, 11), bold=True,
            color=NAVY if level < 3 else BLUE, font="Arial")
    p.paragraph_format.keep_with_next = True
    return p


def page_title(doc, label, title):
    p = doc.add_paragraph()
    style_paragraph(p, 0, 2, 1.0)
    set_run(p.add_run(label.upper()), size=8.5, bold=True, color=ORANGE, font="Arial")
    # A page title is visual navigation only. Major chapters use
    # ``chapter_title`` below so the automatic TOC stays compact.
    p2 = doc.add_paragraph()
    style_paragraph(p2, 0, 10, 1.0)
    p2.paragraph_format.page_break_before = False
    set_run(p2.add_run(title), size=18, bold=True, color=NAVY, font="Arial")
    p2.paragraph_format.keep_with_next = True
    return p2


def chapter_title(doc, chapter, title):
    p = doc.add_paragraph()
    style_paragraph(p, 0, 2, 1.0)
    set_run(p.add_run(chapter.upper()), size=8.5, bold=True, color=ORANGE, font="Arial")
    p2 = doc.add_paragraph(style="Heading 1")
    style_paragraph(p2, 0, 10, 1.0)
    p2.paragraph_format.page_break_before = False
    set_run(p2.add_run(f"{chapter.upper()}. {title}"), size=18, bold=True, color=NAVY, font="Arial")
    p2.paragraph_format.keep_with_next = True
    return p2


def add_table(doc, headers, rows, widths=None, font_size=9.2):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_repeat_table_header(table.rows[0])
    for idx, header in enumerate(headers):
        cell = table.rows[0].cells[idx]
        set_cell_shading(cell, NAVY)
        set_cell_border(cell, "FFFFFF", "4")
        p = cell.paragraphs[0]
        style_paragraph(p, 0, 0, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
        set_run(p.add_run(header), size=font_size, bold=True, color="FFFFFF", font="Arial")
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    for r_idx, row in enumerate(rows):
        cells = table.add_row().cells
        for c_idx, value in enumerate(row):
            cell = cells[c_idx]
            set_cell_shading(cell, "FFFFFF" if r_idx % 2 == 0 else LIGHT)
            set_cell_border(cell)
            p = cell.paragraphs[0]
            style_paragraph(p, 0, 0, 1.02)
            set_run(p.add_run(str(value)), size=font_size, color=TEXT)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    if widths:
        for row in table.rows:
            for idx, width in enumerate(widths):
                row.cells[idx].width = Cm(width)
    doc.add_paragraph().paragraph_format.space_after = Pt(1)
    return table


def add_metric_row(doc, metrics):
    table = doc.add_table(rows=1, cols=len(metrics))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    for idx, (value, label) in enumerate(metrics):
        cell = table.cell(0, idx)
        set_cell_shading(cell, PALE_GREEN if idx % 2 == 0 else PALE_ORANGE)
        set_cell_border(cell, "FFFFFF", "8")
        p = cell.paragraphs[0]
        style_paragraph(p, 6, 1, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
        set_run(p.add_run(value), size=17, bold=True, color=NAVY, font="Arial")
        p2 = cell.add_paragraph()
        style_paragraph(p2, 0, 6, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
        set_run(p2.add_run(label), size=8.5, color=TEXT, font="Arial")
    return table


def add_placeholder(doc, title, note, height=3.0):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_shading(cell, "EEF2F5")
    set_cell_border(cell, "9AA8B5", "10")
    cell.height = Inches(height)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    p = cell.paragraphs[0]
    style_paragraph(p, 0, 4, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
    set_run(p.add_run("[CẦN CHỤP TỪ WEBSITE ĐANG CHẠY]"), size=12, bold=True, color=BLUE, font="Arial")
    p2 = cell.add_paragraph()
    style_paragraph(p2, 0, 4, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
    set_run(p2.add_run(title), size=11, bold=True, color=NAVY, font="Arial")
    p3 = cell.add_paragraph()
    style_paragraph(p3, 0, 0, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
    set_run(p3.add_run(note), size=8.5, italic=True, color="66788A")
    cap = doc.add_paragraph()
    style_paragraph(cap, 3, 8, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
    set_run(cap.add_run(f"Gợi ý chụp: {note}"), size=8.5, italic=True, color="66788A")
    return table


def add_diagram_image(doc, filename, caption):
    image_path = ASSET_DIR / filename
    p = doc.add_paragraph()
    style_paragraph(p, 4, 2, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
    p.add_run().add_picture(str(image_path), width=Cm(16.0))
    cap = doc.add_paragraph()
    style_paragraph(cap, 2, 8, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
    set_run(cap.add_run(caption), size=9.5, italic=True, color="66788A")
    return p


def add_architecture_diagram(doc):
    table = doc.add_table(rows=1, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    labels = [
        ("Domain", "Entity • Enum • Domain rule"),
        ("Application", "CQRS • Validator • DTO • Interface"),
        ("Infrastructure", "EF Core • PostgreSQL • Redis • MinIO"),
        ("API / Web", "Minimal API • Middleware • Next.js"),
    ]
    for idx, (title, desc) in enumerate(labels):
        c = table.cell(0, idx)
        set_cell_shading(c, [PALE_ORANGE, PALE_BLUE, PALE_GREEN, "E8EEF7"][idx])
        set_cell_border(c, "FFFFFF", "8")
        p = c.paragraphs[0]
        style_paragraph(p, 6, 3, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
        set_run(p.add_run(title), size=10.5, bold=True, color=NAVY, font="Arial")
        p2 = c.add_paragraph()
        style_paragraph(p2, 0, 6, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
        set_run(p2.add_run(desc), size=8.2, color=TEXT, font="Arial")
    add_text(doc, "Dependency Rule: Domain không phụ thuộc tầng ngoài; Application chỉ dùng abstraction; Infrastructure và API ghép nối tại composition root.",
             italic=True, size=9, color="66788A", align=WD_ALIGN_PARAGRAPH.CENTER)


def clear_body_keep_section(doc):
    body = doc._element.body
    sect_pr = body.sectPr
    for child in list(body):
        if child is not sect_pr:
            body.remove(child)


def add_page_break(doc):
    doc.add_page_break()


def configure_styles(doc):
    normal = doc.styles["Normal"]
    normal.font.name = "Times New Roman"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")
    normal.font.size = Pt(12.5)
    normal.font.color.rgb = RGBColor.from_string(TEXT)
    for name in ("Heading 1", "Heading 2", "Heading 3"):
        style = doc.styles[name]
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
        style.font.color.rgb = RGBColor.from_string(NAVY)
    # The supplied template makes Heading 1 start on a new page. This report
    # already uses explicit page breaks, so keeping both creates blank pages.
    doc.styles["Heading 1"].paragraph_format.page_break_before = False
    for section in doc.sections:
        section.top_margin = Cm(2.0)
        section.bottom_margin = Cm(1.8)
        section.left_margin = Cm(2.7)
        section.right_margin = Cm(2.0)
        section.header_distance = Cm(0.8)
        section.footer_distance = Cm(0.8)


def configure_header_footer(doc):
    for section in doc.sections:
        header = section.header
        hp = header.paragraphs[0]
        hp.clear()
        style_paragraph(hp, 0, 0, 1.0)
        set_run(hp.add_run("CULINARY BLOG  •  BÁO CÁO ĐỒ ÁN  •  2026"), size=8, bold=True, color=NAVY, font="Arial")
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.clear()
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_run(fp.add_run("Trường Đại học Đà Lạt  |  Khoa Công nghệ Thông tin  |  "), size=8, color="6E7D8C", font="Arial")
        r = fp.add_run()
        add_field(r, "PAGE")
        set_run(r, size=8, color="6E7D8C", font="Arial")


def set_update_fields(doc):
    settings = doc.settings._element
    update = settings.find(qn("w:updateFields"))
    if update is None:
        update = OxmlElement("w:updateFields")
        settings.append(update)
    update.set(qn("w:val"), "true")


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    logo = ASSET_DIR / "university-logo.png"
    with zipfile.ZipFile(REFERENCE) as zf:
        logo.write_bytes(zf.read("word/media/image1.png"))

    doc = Document(str(REFERENCE))
    clear_body_keep_section(doc)
    configure_styles(doc)
    configure_header_footer(doc)

    # Page 1 — cover
    section = doc.sections[0]
    section.different_first_page_header_footer = True
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run().add_picture(str(logo), width=Cm(2.8))
    add_text(doc, "TRƯỜNG ĐẠI HỌC ĐÀ LẠT", bold=True, size=14, color=NAVY,
             align=WD_ALIGN_PARAGRAPH.CENTER, after=2)
    add_text(doc, "KHOA CÔNG NGHỆ THÔNG TIN", bold=True, size=12, color=NAVY,
             align=WD_ALIGN_PARAGRAPH.CENTER, after=22)
    add_text(doc, "BÁO CÁO ĐỒ ÁN", bold=True, size=20, color=BLUE,
             align=WD_ALIGN_PARAGRAPH.CENTER, after=2)
    add_text(doc, "[TÊN MÔN HỌC]", bold=True, size=16, color=NAVY,
             align=WD_ALIGN_PARAGRAPH.CENTER, after=16)
    cover = doc.add_table(rows=1, cols=1)
    cover.alignment = WD_TABLE_ALIGNMENT.CENTER
    cc = cover.cell(0, 0)
    set_cell_shading(cc, NAVY)
    set_cell_border(cc, NAVY)
    cp = cc.paragraphs[0]
    style_paragraph(cp, 14, 6, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
    set_run(cp.add_run("ĐỀ TÀI"), size=9, bold=True, color=ORANGE, font="Arial")
    cp2 = cc.add_paragraph()
    style_paragraph(cp2, 0, 4, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
    set_run(cp2.add_run("XÂY DỰNG ỨNG DỤNG WEB BLOG ẨM THỰC VÀ NẤU ĂN"), size=17, bold=True, color="FFFFFF", font="Arial")
    cp3 = cc.add_paragraph()
    style_paragraph(cp3, 0, 14, 1.0, WD_ALIGN_PARAGRAPH.CENTER)
    set_run(cp3.add_run("DỰ ÁN: CULINARY BLOG – BẾP NHÀ"), size=13, bold=True, color=ORANGE, font="Arial")
    add_text(doc, "Giảng viên hướng dẫn: [TÊN GIẢNG VIÊN]", bold=True, size=11,
             align=WD_ALIGN_PARAGRAPH.CENTER, before=16, after=8)
    add_table(doc, ["STT", "MSSV", "Họ và tên", "Vai trò chính"], [
        ("1", "[MSSV]", "Nguyễn Đức Thành", "Backend Lead, Auth & Security"),
        ("2", "[MSSV]", "Minh Long", "Recipe, Search & Cache"),
        ("3", "[MSSV]", "Oven", "Category, Form & Integration"),
        ("4", "[MSSV]", "Kina Niê", "Media, SEO & DevOps"),
    ], [1.2, 2.4, 4.3, 7.2], 8.6)
    add_text(doc, "Đà Lạt, tháng 11 năm 2026", italic=True, size=10, color="66788A",
             align=WD_ALIGN_PARAGRAPH.CENTER, before=12)

    # Page 2 — instructor comments
    add_page_break(doc)
    page_title(doc, "Phần đầu", "NHẬN XÉT CỦA GIẢNG VIÊN HƯỚNG DẪN")
    add_text(doc, "Tên đề tài: Xây dựng ứng dụng Web Blog Ẩm thực và Nấu ăn (Culinary Blog).", bold=True)
    for label in ["1. Nội dung và mức độ hoàn thành", "2. Kiến trúc, kỹ thuật và chất lượng mã nguồn", "3. Giao diện, trải nghiệm và phần demo", "4. Báo cáo, thuyết trình và trả lời câu hỏi", "5. Nhận xét khác"]:
        add_heading(doc, label, 2)
        for _ in range(3):
            p = doc.add_paragraph("................................................................................................................................................")
            style_paragraph(p, 0, 4, 1.0)
            set_run(p.runs[0], size=10, color="9AA8B5")
    add_text(doc, "Điểm: ........../10", bold=True, align=WD_ALIGN_PARAGRAPH.RIGHT, before=8)
    add_text(doc, "Đà Lạt, ngày ..... tháng ..... năm 2026\nGIẢNG VIÊN HƯỚNG DẪN\n(Ký và ghi rõ họ tên)",
             align=WD_ALIGN_PARAGRAPH.RIGHT, before=8)

    # Page 3 — team
    add_page_break(doc)
    page_title(doc, "Phần đầu", "THÔNG TIN NHÓM VÀ PHÂN CÔNG TỔNG QUÁT")
    add_text(doc, "Nhóm tổ chức theo bốn mảng xuyên suốt, nhưng mọi thành viên đều phối hợp review API contract, migration, kiểm thử và chuẩn bị demo. Bảng dưới đây phản ánh kế hoạch phân công được cung cấp; trước khi nộp cần đối chiếu lại với commit/PR thực tế.")
    add_table(doc, ["Thành viên", "Vai trò", "Nhóm nhiệm vụ chính", "GitHub"], [
        ("Nguyễn Đức Thành", "Lead Backend", "Clean Architecture, database, JWT/refresh, authorization, API platform, security tests", "[LINK GITHUB]"),
        ("Minh Long", "Backend/Data", "Ingredient/Step, recipe lifecycle, PostgreSQL FTS, filter/sort/page, Redis cache, backend tests", "[LINK GITHUB]"),
        ("Oven", "Frontend/Integration", "Recipe wizard, validation, Problem Details/toast, category UI, author dashboard, common components", "[LINK GITHUB]"),
        ("Kina Niê", "Media/Operations", "MinIO, image validation/thumbnail, recipe detail, SEO, health, logging, Docker/CI", "[LINK GITHUB]"),
    ], [3.2, 2.5, 8.2, 3.0], 8.5)
    add_heading(doc, "Nguyên tắc phối hợp", 2)
    add_bullets(doc, [
        "Mỗi task chỉ hoàn thành khi có mã nguồn, kiểm thử và bằng chứng commit/PR.",
        "Không sửa migration đã merge; mọi thay đổi database được tạo bằng migration mới.",
        "Không commit secret, file .env, JWT secret, mật khẩu PostgreSQL/MinIO hoặc credential Google/SMTP.",
        "Thống nhất request/response, mã lỗi và phân trang trước khi frontend tích hợp.",
        "Mọi endpoint quan trọng có ít nhất một trường hợp thành công và một trường hợp lỗi.",
    ])

    # Page 4 — thanks/opening
    add_page_break(doc)
    page_title(doc, "Phần đầu", "LỜI CẢM ƠN VÀ LỜI MỞ ĐẦU")
    add_heading(doc, "Lời cảm ơn", 2)
    add_text(doc, "Nhóm xin trân trọng cảm ơn giảng viên phụ trách học phần đã cung cấp tài liệu SRS, hướng dẫn quy trình phát triển ứng dụng Web nâng cao và góp ý qua từng Lab. Những yêu cầu theo từng giai đoạn giúp nhóm hình thành tư duy phát triển có cấu trúc: bắt đầu từ domain và dữ liệu, mở rộng sang API, bảo mật, frontend, kiểm thử và triển khai.")
    add_text(doc, "Nhóm cũng cảm ơn các thành viên đã phối hợp xử lý xung đột tích hợp, rà soát bảo mật và hoàn thiện dữ liệu demo. Báo cáo này cố gắng trình bày đúng những gì có bằng chứng trong mã nguồn và kết quả kiểm thử; các phần cần tài khoản hoặc hạ tầng thật được ghi rõ là giới hạn, không xem cấu hình là bằng chứng vận hành production.")
    add_heading(doc, "Lời mở đầu", 2)
    add_text(doc, "Culinary Blog (Bếp Nhà) là nền tảng Web cho phép người dùng khám phá, tìm kiếm và chia sẻ công thức nấu ăn. Tác giả có thể tạo công thức theo cấu trúc nguyên liệu – bước nấu – hình ảnh, quản lý trạng thái Draft/Published/Archived và theo dõi nội dung trong Góc tác giả. Quản trị viên quản lý danh mục, người dùng và nội dung; người dùng phổ thông xem công thức, tìm kiếm và sử dụng các tính năng cộng đồng mở rộng.")
    add_text(doc, "Hệ thống được xây dựng bằng .NET 10, ASP.NET Core Minimal API, Entity Framework Core, PostgreSQL, Next.js App Router, React/TypeScript, Redis, MinIO và Docker Compose. Báo cáo tập trung vào phạm vi SRS và các yêu cầu Lab 2–8, đồng thời nêu các phần mở rộng như 2FA, quản lý phiên, xóa tài khoản, observability và SEO.")

    # Page 5 — automatic table of contents
    add_page_break(doc)
    page_title(doc, "Phần đầu", "MỤC LỤC")
    toc = doc.add_paragraph()
    style_paragraph(toc, 0, 10, 1.05)
    add_field(toc.add_run(), 'TOC \\o "1-3" \\h \\z \\u')
    add_text(doc, "Mục lục được tạo tự động từ hệ thống tiêu đề của báo cáo. Khi mở tài liệu trong Microsoft Word hoặc WPS Office, chọn toàn bộ tài liệu và cập nhật trường để hiển thị đúng số trang.", italic=True, size=9, color="66788A", before=8)

    # Page 6 — abbreviations and lists
    add_page_break(doc)
    page_title(doc, "Phần đầu", "DANH MỤC TỪ VIẾT TẮT, BẢNG VÀ HÌNH")
    add_heading(doc, "Từ viết tắt sử dụng trong báo cáo", 2)
    add_table(doc, ["Từ viết tắt", "Diễn giải"], [
        ("SRS", "Software Requirements Specification – Đặc tả yêu cầu phần mềm"),
        ("API", "Application Programming Interface"),
        ("CQRS", "Command Query Responsibility Segregation"),
        ("JWT", "JSON Web Token"),
        ("RBAC", "Role-Based Access Control"),
        ("FTS", "Full-Text Search"),
        ("UoW", "Unit of Work"),
        ("SEO", "Search Engine Optimization"),
        ("OTel", "OpenTelemetry"),
    ], [3.2, 12.8], 9)
    add_heading(doc, "Danh mục bảng tiêu biểu", 2)
    add_text(doc, "Bảng 1.1 – Vai trò và quyền người dùng; Bảng 1.2 – Đối chiếu Lab 2–8; Bảng 2.1 – Công nghệ sử dụng; Bảng 2.2 – Thực thể và ràng buộc; Bảng 3.1 – Nhóm API; Bảng 4.1 – Kết quả kiểm thử; Bảng 4.2 – Kết quả hiệu năng; Bảng 5.1 – Đánh giá và hướng phát triển.", size=9.5)
    add_heading(doc, "Danh mục hình minh họa cần bổ sung", 2)
    add_text(doc, "Hình 2.1 – Clean Architecture; Hình 2.2 – Sơ đồ triển khai; Hình 2.3 – ERD; Hình 3.1 – Swagger/Scalar; Hình 3.2 – Bảo mật tài khoản; Hình 3.3 – Góc tác giả; Hình 3.4 – Tìm kiếm; Hình 3.5 – Quan sát hệ thống; Hình 3.6 – Trang chủ; Hình 4.1 – Kết quả kiểm thử; Hình 4.2 – Bảng Sprint.", size=9.5)

    # Page 7
    add_page_break(doc)
    chapter_title(doc, "Chương 1", "TỔNG QUAN ĐỀ TÀI VÀ YÊU CẦU")
    add_heading(doc, "1.1. Bài toán", 2)
    add_text(doc, "Nguồn công thức trên Internet nhiều nhưng thường phân tán, thiếu cấu trúc thống nhất và khó quản lý vòng đời nội dung. Culinary Blog giải quyết bài toán bằng một nền tảng tập trung, nơi công thức được chuẩn hóa theo danh mục, thời gian, khẩu phần, độ khó, nguyên liệu, bước chế biến, dinh dưỡng và hình ảnh.")
    add_heading(doc, "1.2. Mục tiêu", 2)
    add_bullets(doc, [
        "Xây dựng ứng dụng full-stack API-driven bám SRS và Clean Architecture.",
        "Bảo đảm luồng đăng ký, đăng nhập, hồ sơ, recipe/category, tìm kiếm và upload ảnh hoạt động đúng quyền.",
        "Tạo dữ liệu demo tối thiểu theo Lab 2 và bảo đảm có thể tái tạo bằng migration/seeder.",
        "Tích hợp kiểm thử tự động, logging, health check, cache, background job và Docker Compose.",
        "Tạo giao diện dễ sử dụng, responsive và có nền tảng SEO cho công thức đã xuất bản.",
    ])
    add_heading(doc, "1.3. Phạm vi", 2)
    add_text(doc, "Phạm vi lõi gồm FR-AUTH, FR-CAT, FR-RCP, FR-SRCH, FR-FILE, FR-JOB và FR-OBS. Các tính năng cộng đồng, bài viết, bộ sưu tập, kế hoạch bữa ăn và 2FA là phần mở rộng của nhóm. Thanh toán, nhắn tin trực tiếp và ứng dụng di động native không thuộc phạm vi SRS v1.0.0.")
    add_metric_row(doc, [("4", "tầng backend"), ("20+", "danh mục seed"), ("100+", "công thức seed"), ("10/5", "nguyên liệu/bước")])

    # Continuation of Chapter 1 — content flows naturally without forced blank space.
    page_title(doc, "Chương 1", "ĐỐI TƯỢNG SỬ DỤNG VÀ CHỨC NĂNG CHÍNH")
    add_table(doc, ["Vai trò", "Nhu cầu chính", "Quyền tiêu biểu"], [
        ("Khách", "Khám phá nội dung", "Xem trang chủ, danh mục, công thức Published; tìm kiếm/lọc/phân trang"),
        ("User", "Quản lý tài khoản", "Đăng nhập, hồ sơ, đổi mật khẩu, bảo mật tài khoản, nội dung cộng đồng"),
        ("Author", "Xuất bản công thức", "Tạo/sửa recipe sở hữu; quản lý ingredient, step, ảnh và trạng thái"),
        ("Admin", "Quản trị hệ thống", "Quản lý category, user, role, phiên, nội dung; xem dashboard vận hành"),
    ], [2.8, 5.0, 8.4], 9)
    add_heading(doc, "Nhóm chức năng", 2)
    add_bullets(doc, [
        "Xác thực và tài khoản: register, login, refresh rotation, logout, profile, đổi/quên mật khẩu, 2FA, quản lý phiên và xóa tài khoản.",
        "Công thức: CRUD, Draft → Published → Archived, restore/delete, nutrition, ingredient, step và ảnh.",
        "Danh mục và tìm kiếm: CRUD danh mục theo quyền Admin; FTS tiếng Việt, filter, sort, pagination.",
        "Hạ tầng: Redis cache, MinIO object storage, Hangfire job, health checks, Serilog và OpenTelemetry.",
        "Frontend: trang chủ, danh sách/chi tiết recipe, category, search, profile, Góc tác giả và trang quản trị.",
    ])
    add_diagram_image(doc, "so-do-use-case.png", "Hình 1.1. Sơ đồ Use Case tổng quát của hệ thống Culinary Blog")

    # Continuation of Chapter 1.
    page_title(doc, "Chương 1", "ĐỐI CHIẾU YÊU CẦU LAB 2–8")
    add_table(doc, ["Lab", "Yêu cầu trọng tâm", "Kết quả trong dự án"], [
        ("Lab 2", "Clean Architecture, entity, DbContext, migration, seed", "4 project backend; EF Core/PostgreSQL; migration; seed ≥20 category, ≥100 recipe, mỗi recipe seed ≥10 ingredient và ≥5 step"),
        ("Lab 3", "Domain exception, repository/UoW, endpoint, Problem Details", "Exception middleware toàn cục; repository/UoW; API v1 và RFC 7807"),
        ("Lab 4", "Hoàn thiện API endpoints", "Auth, category, recipe, image, ingredient, step, search, health và phần mở rộng"),
        ("Lab 5", "Security, docs/versioning, frontend structure/types", "CORS allow-list, rate limit, JWT/RBAC, Swagger/Scalar, API versioning, Next.js/TypeScript"),
        ("Lab 6", "API helper, UI library, store, layout/component", "API client, error mapper, Radix/CVA/Lucide, Zustand, AppShell/Header/Footer/Pagination/State"),
        ("Lab 7", "Auth flows, profile, home/detail/search/categories", "Đầy đủ route lõi và các luồng tương ứng"),
        ("Lab 8", "Upload, recipe lifecycle, user list, logging", "MinIO, image validation/variants, author dashboard, admin user management, Serilog/OTel"),
    ], [1.4, 5.2, 10.0], 8.5)
    add_text(doc, "Lưu ý: SRS yêu cầu recipe do người dùng tạo tối thiểu một ingredient và một step; yêu cầu Lab 2 về dữ liệu seed tách biệt và giữ ngưỡng 10 ingredient/5 step cho mỗi recipe mẫu.", italic=True, size=9.5, color="66788A")

    # Page 9
    add_page_break(doc)
    chapter_title(doc, "Chương 2", "PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG")
    add_diagram_image(doc, "so-do-clean-architecture.png", "Hình 2.1. Kiến trúc Clean Architecture và quy tắc phụ thuộc")
    add_heading(doc, "2.1. Vai trò từng tầng", 2)
    add_bullets(doc, [
        "CulinaryBlog.Domain: entity, enum, value/rule miền nghiệp vụ; không phụ thuộc EF Core hay Web.",
        "CulinaryBlog.Application: use case CQRS, validator, DTO, abstraction repository/UoW/service.",
        "CulinaryBlog.Infrastructure: ApplicationDbContext, EF Core configuration, repository, cache, storage, email và jobs.",
        "CulinaryBlog.API: Minimal API endpoints, middleware, authentication, authorization, OpenAPI và composition root.",
        "Frontend Next.js: App Router, Server/Client Component, state management và tích hợp API.",
    ])
    add_heading(doc, "2.2. Luồng xử lý yêu cầu điển hình", 2)
    add_text(doc, "Client → Nginx/API → middleware (correlation, security, exception) → endpoint → validation/CQRS handler → domain rule → repository/UoW → PostgreSQL/Redis/MinIO → DTO/Problem Details → frontend. Cấu trúc này giúp cô lập nghiệp vụ, giảm phụ thuộc framework và tăng khả năng kiểm thử.")

    # Continuation of Chapter 2.
    page_title(doc, "Chương 2", "CÔNG NGHỆ VÀ MÔI TRƯỜNG TRIỂN KHAI")
    add_table(doc, ["Nhóm", "Công nghệ", "Vai trò"], [
        ("Backend", ".NET 10, ASP.NET Core Minimal API, C#", "REST API, middleware, security, health"),
        ("Application", "MediatR/CQRS, FluentValidation, Mapster", "Use case, validation, mapping"),
        ("Persistence", "EF Core, PostgreSQL 16", "ORM, migration, FTS, transaction"),
        ("Frontend", "Next.js 16, React 19, TypeScript", "App Router, SSR/ISR, UI"),
        ("State/UI", "Zustand, TanStack Query, RHF, Zod, Radix", "Auth/UI state, server state, form"),
        ("Infrastructure", "Redis 7, MinIO, Hangfire, Nginx", "Cache, storage, job, reverse proxy"),
        ("Observability", "Serilog, OpenTelemetry, Jaeger, Prometheus, Grafana", "Log, trace, metric"),
        ("Quality", "xUnit, Node test, Playwright, axe, Lighthouse, k6", "Unit/integration/E2E/accessibility/performance"),
    ], [2.6, 6.1, 8.0], 8.7)
    add_diagram_image(doc, "so-do-trien-khai.png", "Hình 2.2. Sơ đồ triển khai các dịch vụ trong Docker Compose")
    add_text(doc, "Ảnh Docker Desktop hoặc terminal chỉ nên bổ sung ở phần kiểm thử triển khai để chứng minh các container thực tế đang ở trạng thái Running/Healthy; không dùng ảnh chụp đó thay cho sơ đồ thiết kế.", italic=True, size=9.5, color="66788A")

    # Continuation of Chapter 2.
    page_title(doc, "Chương 2", "MÔ HÌNH DỮ LIỆU VÀ RÀNG BUỘC NGHIỆP VỤ")
    add_table(doc, ["Entity", "Thuộc tính/quan hệ nổi bật", "Quy tắc"], [
        ("ApplicationUser", "Identity, profile, role, 2FA, security activity", "Email/username duy nhất; trạng thái khóa; xóa tài khoản giữ nội dung công khai dưới tác giả ẩn danh"),
        ("Category", "Name, Slug, Description, ImageUrl", "Slug duy nhất; không xóa khi còn recipe hoạt động"),
        ("Recipe", "Title, Slug, Status, time, servings, difficulty, nutrition, AuthorId, CategoryId", "Recipe mới Draft; Published mới hiển thị công khai; ownership/concurrency"),
        ("RecipeIngredient", "Name, Quantity, Unit, Notes, SortOrder", "Seed Lab 2 có ít nhất 10; recipe người dùng tối thiểu 1"),
        ("RecipeStep", "StepNumber, Title/Description, Duration, Image", "Thứ tự liên tục; seed Lab 2 có ít nhất 5; recipe người dùng tối thiểu 1"),
        ("RecipeImage", "Original/medium/thumbnail, IsPrimary, metadata", "Một ảnh chính; file hợp lệ và đúng owner"),
        ("RefreshToken", "Token family, expiry, revoked/replaced", "Rotation; revoke; phát hiện replay"),
    ], [3.1, 7.0, 6.6], 8.3)
    add_diagram_image(doc, "so-do-erd.png", "Hình 2.3. ERD tóm tắt các thực thể và quan hệ cốt lõi")

    # Continuation of Chapter 2.
    page_title(doc, "Chương 2", "MIGRATION, DỮ LIỆU MẪU VÀ DANH MỤC CÔNG THỨC")
    add_text(doc, "Database được khởi tạo bằng EF Core migration. Seeder chạy idempotent: không tạo trùng khi restart, chuẩn hóa toàn bộ recipe mẫu để đạt ngưỡng Lab 2 và không tự ý đặt lại mật khẩu/quyền của tài khoản demo đã tồn tại.")
    add_metric_row(doc, [("20", "category đã đo"), ("1013", "recipe ở lần verify sạch"), ("10+", "ingredient/recipe seed"), ("5+", "step/recipe seed")])
    add_heading(doc, "Dữ liệu danh mục và nội dung", 2)
    add_text(doc, "Catalog bao phủ các nhóm phổ biến như Món Việt, Món chay, Món xào, Món nướng, Món kho, Món canh, Món súp, Món lẩu, Bánh ngọt, Đồ uống, Món ăn nhanh, Món gỏi, Món chiên, Món hấp, Món tráng miệng, Bánh mì, Món biển và Món từ thịt. Mỗi category có mô tả và ảnh minh họa; bộ đếm trên giao diện lấy từ dữ liệu thật thay vì số cố định.")
    add_placeholder(doc, "Danh sách category và số lượng recipe", "Chụp trang /categories sao cho thấy ảnh tiêu đề của category và số công thức; chụp thêm sidebar trang chủ để minh chứng bộ đếm thay đổi theo dữ liệu.", 2.4)

    # Page 13
    add_page_break(doc)
    chapter_title(doc, "Chương 3", "CÀI ĐẶT VÀ HIỆN THỰC CÁC CHỨC NĂNG")
    add_table(doc, ["Nhóm", "Endpoint tiêu biểu", "Phản hồi"], [
        ("Auth", "POST /api/v1/auth/register, login, refresh, logout", "200/201; cookie HttpOnly; 401/422/429"),
        ("Profile", "GET/PATCH /api/v1/auth/me", "ProfileDto; validation Problem Details"),
        ("Category", "GET/POST/PUT/DELETE /api/v1/categories", "Public read; Admin write"),
        ("Recipe", "GET/POST/PUT/DELETE /api/v1/recipes", "Paged list/detail; owner/Admin write"),
        ("Lifecycle", "POST .../publish, unpublish, archive, restore", "State transition + cache invalidation"),
        ("Images", "POST/PUT/DELETE .../images", "Multipart upload; primary image"),
        ("Search", "GET /api/v1/search/recipes", "items, totalCount, page, pageSize, totalPages"),
        ("Health", "GET /health, /health/live, /health/ready", "Healthy/Degraded/Unhealthy"),
    ], [2.2, 8.3, 6.2], 8.4)
    add_heading(doc, "Problem Details toàn cục", 2)
    add_text(doc, "ExceptionHandlingMiddleware ánh xạ validation/domain/not-found/conflict/authorization sang RFC 7807. Frontend dùng API client chung để chuyển 400, 401, 403, 404, 409/412, 422, 429 và 500 thành thông báo thân thiện; toast provider chỉ khởi tạo một lần ở layout.")
    add_placeholder(doc, "Swagger/Scalar API v1", "Mở tài liệu API, chụp nhóm Auth/Categories/Recipes/Search và nút Authorize; có thể mở một response Problem Details mẫu.", 2.1)

    # Continuation of Chapter 3.
    page_title(doc, "Chương 3", "XÁC THỰC, PHÂN QUYỀN VÀ BẢO MẬT TÀI KHOẢN")
    add_bullets(doc, [
        "JWT Access Token có thời hạn ngắn; Refresh Token lưu trạng thái trong database, dùng rotation, revoke và replay detection.",
        "Trình duyệt nhận cookie HttpOnly; SameSite/Secure và CSRF double-submit + kiểm tra Origin bảo vệ request thay đổi dữ liệu.",
        "RBAC phân biệt User/Author/Admin; resource-based authorization bảo đảm Author chỉ sửa/xóa recipe sở hữu.",
        "CORS dùng allow-list; Rate Limiting áp dụng cho login, register, upload và nhóm endpoint nhạy cảm.",
        "2FA TOTP: người dùng xác nhận mật khẩu, quét QR bằng Authenticator, nhập mã 6 số và nhận recovery codes.",
        "Quản lý phiên cho phép thu hồi một hoặc toàn bộ refresh sessions; xóa tài khoản thu hồi phiên và loại bỏ dữ liệu định danh.",
    ])
    add_table(doc, ["Chức năng", "Ý nghĩa trên giao diện"], [
        ("Thu hồi phiên", "Vô hiệu hóa refresh token; thiết bị bị thu hồi phải đăng nhập lại khi access token hết hạn hoặc ngay khi phiên được kiểm tra."),
        ("Xóa tài khoản", "Xóa thông tin đăng nhập/cá nhân; giữ recipe/bài viết đã công khai dưới tên “Tài khoản đã xóa” để không làm hỏng nội dung."),
        ("2FA", "Thêm lớp xác minh bằng mã TOTP sau mật khẩu; recovery code dùng khi mất thiết bị."),
    ], [4.0, 12.5], 9)
    add_placeholder(doc, "Trang Bảo mật tài khoản", "Đăng nhập tài khoản demo, mở trang bảo mật; chụp khối Cài đặt 2FA, danh sách phiên và nút Xóa tài khoản (che email/token nhạy cảm).", 2.0)

    # Continuation of Chapter 3.
    page_title(doc, "Chương 3", "VÒNG ĐỜI CÔNG THỨC VÀ GÓC TÁC GIẢ")
    add_diagram_image(doc, "so-do-vong-doi-cong-thuc.png", "Hình 3.2. Vòng đời và quy tắc chuyển trạng thái công thức")
    add_heading(doc, "3.1. Luồng tạo và xuất bản", 2)
    add_bullets(doc, [
        "Author mở Góc tác giả (/dashboard), tạo recipe bằng wizard và lưu bản Draft.",
        "Form cho phép thêm/xóa ingredient và step động, preview dữ liệu và upload ảnh.",
        "Backend validate độc lập; recipe chỉ Publish khi có ít nhất một ingredient và một step.",
        "Published xuất hiện ở trang công khai, tìm kiếm và sitemap; Archive ẩn khỏi public nhưng giữ dữ liệu.",
        "Update/delete kiểm tra owner/Admin; thay đổi content/image/category làm invalidation cache liên quan.",
    ])
    add_heading(doc, "3.2. Góc tác giả", 2)
    add_text(doc, "Menu “Công thức của tôi” được đổi thành “Góc tác giả” và liên kết tới /dashboard để phản ánh đúng phạm vi: không chỉ liệt kê recipe mà còn cho phép tạo mới, chỉnh sửa, đổi trạng thái và theo dõi nội dung của tác giả. Nút tạo công thức dư thừa ở header được loại bỏ để giao diện gọn và nhất quán.")
    add_placeholder(doc, "Góc tác giả và wizard tạo công thức", "Chụp /dashboard có các trạng thái Draft/Published/Archived; sau đó chụp bước ingredient/step của form tạo recipe.", 2.15)

    # Continuation of Chapter 3.
    page_title(doc, "Chương 3", "DANH MỤC, TÌM KIẾM VÀ BỘ NHỚ ĐỆM")
    add_heading(doc, "3.3. Danh mục", 2)
    add_text(doc, "Danh mục có slug, mô tả và ảnh đại diện. API public trả số recipe thực tế; sau khi recipe bị xóa/ẩn, bộ đếm và danh sách chi tiết được cập nhật thay vì giữ số cố định. Admin có CRUD category và hệ thống chặn xóa category còn recipe hoạt động.")
    add_heading(doc, "3.4. Tìm kiếm toàn văn", 2)
    add_text(doc, "PostgreSQL Full-Text Search sử dụng cấu hình phù hợp tiếng Việt, unaccent/pg_trgm và GIN index. Query hỗ trợ từ khóa có dấu/không dấu, category, difficulty, cook time, servings, sort và offset pagination. Kết quả luôn trả metadata để frontend hiển thị Pagination.")
    add_heading(doc, "3.5. Bộ nhớ đệm Redis", 2)
    add_text(doc, "Dữ liệu public có thể được cache theo key/tag; mutation recipe, category, ingredient, step hoặc image kích hoạt invalidation. Khi Redis không khả dụng, ứng dụng ưu tiên fallback về database thay vì làm hỏng luồng nghiệp vụ.")
    add_placeholder(doc, "Tìm kiếm có bộ lọc và phân trang", "Tìm một món tiếng Việt không dấu, chọn category/difficulty và chuyển trang; chụp cả URL query và số lượng kết quả.", 2.55)

    # Continuation of Chapter 3.
    page_title(doc, "Chương 3", "ẢNH, TÁC VỤ NỀN, SEO VÀ QUAN SÁT HỆ THỐNG")
    add_table(doc, ["Thành phần", "Cách triển khai", "Giá trị"], [
        ("MinIO", "IFileStorageService, bucket/URL từ biến môi trường", "Tách object storage khỏi API"),
        ("Image validation", "Magic bytes, MIME JPEG/PNG/WebP/AVIF, tối đa 5 MB", "Ngăn file giả mạo/quá lớn"),
        ("Image variants", "Thumbnail/medium WebP qua job", "Tối ưu card và detail"),
        ("Hangfire", "Welcome email, thumbnail, sitemap/cleanup", "Tách tác vụ chậm khỏi HTTP"),
        ("SEO", "Metadata, Open Graph, JSON-LD Recipe, sitemap", "Tăng khả năng lập chỉ mục"),
        ("Observability", "Serilog + correlation, OTel, Jaeger, Prometheus, Grafana", "Theo dõi log/trace/metric"),
    ], [3.3, 7.2, 6.2], 8.5)
    add_placeholder(doc, "Quan sát hệ thống", "Chụp một trace trên Jaeger và một dashboard Grafana/Prometheus; nếu demo ngắn, ưu tiên /health/ready + Jaeger.", 2.5)

    # Continuation of Chapter 3.
    page_title(doc, "Chương 3", "KIẾN TRÚC GIAO DIỆN VÀ TRẢI NGHIỆM NGƯỜI DÙNG")
    add_table(doc, ["Khối", "Giải pháp"], [
        ("Routing", "Next.js App Router: /, /recipes, /recipes/[id], /categories, /search, /dashboard, /profile"),
        ("Rendering", "ISR cho Home/Categories; SSR/dynamic cho listing/search; Server Component cho recipe detail"),
        ("Server state", "TanStack Query quản lý fetch/cache/invalidation ở client island"),
        ("Form", "React Hook Form + Zod + useFieldArray cho recipe wizard"),
        ("Auth/UI state", "Zustand; refresh/session qua API client và cookie HttpOnly"),
        ("Component", "Header, Footer, AppShell, Pagination, Loading/Error/Empty, Dialog, Toast"),
        ("Accessibility", "Nhãn form, keyboard/focus, contrast; axe test các trang lõi"),
    ], [4.0, 12.5], 9)
    add_heading(doc, "Responsive và tính nhất quán", 2)
    add_text(doc, "Thiết kế dùng hệ màu xanh lá – kem phù hợp chủ đề ẩm thực, card ảnh có tỷ lệ nhất quán, trạng thái loading/empty/error rõ ràng. Các action nhạy cảm dùng dialog xác nhận và mô tả hậu quả. Menu desktop/mobile đồng bộ, liên kết Góc tác giả đặt cạnh quản trị và hồ sơ theo đúng quyền.")
    add_placeholder(doc, "Trang chủ desktop và mobile", "Chụp trang chủ 1440 px có sidebar category + recipe mới; chụp thêm một ảnh mobile 390 px để minh chứng responsive.", 2.15)

    # Continuation of Chapter 3.
    page_title(doc, "Chương 3", "CÁC MÀN HÌNH MINH HỌA TIÊU BIỂU")
    add_table(doc, ["Ảnh", "Màn hình cần chụp", "Điểm cần thể hiện"], [
        ("Hình 7.1", "Trang chủ", "Header, sidebar category, recipe mới, ảnh thật"),
        ("Hình 7.2", "Danh sách category", "Ảnh category và số recipe thực"),
        ("Hình 7.3", "Chi tiết recipe", "Ảnh, tác giả, ingredient, step, nutrition"),
        ("Hình 7.4", "Tìm kiếm", "Từ khóa không dấu + filter + pagination"),
        ("Hình 7.5", "Góc tác giả", "Recipe status và action lifecycle"),
        ("Hình 7.6", "Bảo mật", "2FA, session, delete account"),
        ("Hình 7.7", "Quản trị", "User/category management và thu hồi phiên"),
    ], [2.0, 5.0, 9.5], 8.7)
    add_placeholder(doc, "Ảnh ghép các màn hình demo", "Sau khi chụp 7 ảnh trên, tạo collage 2×3 hoặc chèn 2–3 ảnh quan trọng nhất vào trang này; giữ chú thích dưới từng ảnh.", 3.65)

    # Page 20
    add_page_break(doc)
    chapter_title(doc, "Chương 4", "KIỂM THỬ, ĐÁNH GIÁ VÀ NGHIỆM THU")
    add_metric_row(doc, [("102/102", "backend pass"), ("20/20", "frontend unit"), ("86/86", "runtime API"), ("12/12", "browser flow")])
    add_table(doc, ["Lớp kiểm thử", "Mục tiêu", "Kết quả gần nhất"], [
        ("Unit/Architecture", "Domain rule, handler, Dependency Rule", "Backend Release 102/102 pass"),
        ("Integration/API", "HTTP contract, auth, ownership, cache, media", "Runtime API 86/86 kiểm tra đạt"),
        ("Frontend unit", "Schema/form/API client/session", "20/20 pass"),
        ("Browser", "Luồng thực trên Chromium", "12/12 bước đạt; editor regression 7/7"),
        ("Accessibility", "axe WCAG A/AA trang lõi", "4/4 trang không có lỗi serious/critical"),
        ("Coverage", "Application line/branch", "90,12% line; 73,04% branch"),
        ("Build", "Docker Node 22 + Next production", "Build thành công; ISR/SSR đúng route"),
        ("Backup/Restore", "Khả năng phục hồi dữ liệu", "Số recipe/category/user/ingredient/step khớp"),
    ], [3.1, 7.5, 6.0], 8.4)
    add_placeholder(doc, "Kết quả test", "Chụp terminal có dòng test pass hoặc trang CI; không chụp token/secret. Ưu tiên backend 102/102 và frontend 20/20.", 2.0)

    # Continuation of Chapter 4.
    page_title(doc, "Chương 4", "BẢO MẬT, HIỆU NĂNG VÀ GIỚI HẠN PHÉP ĐO")
    add_heading(doc, "4.1. Kết quả hiệu năng có điều kiện", 2)
    add_table(doc, ["Phép đo", "Kết quả", "Cách diễn giải đúng"], [
        ("k6 mặc định 100 VU", "5800/6000 request lỗi, chủ yếu 429", "Rate limit chặn 100 VU chung IP; không dùng latency này để kết luận nhanh"),
        ("k6 capacity 100 VU", "5892 request; 0% lỗi; p50 7,31 ms; p95 58,79 ms; p99 120,59 ms", "Chỉ bài GET 30 giây với permit 20000 trong cấu hình test"),
        ("Redis hit rate", "Lần đầu 50% raw keyspace; đã sửa generation key", "Cần đo lại dưới tải thật, không tự ghi đạt 80%"),
        ("SMTP local", "Welcome/reset nhận thành công", "Không thay cho SMTP production"),
    ], [3.3, 6.2, 7.1], 8.5)
    add_heading(doc, "4.2. Kiểm soát bảo mật", 2)
    add_bullets(doc, [
        "Secret chỉ lấy từ environment/user-secrets; không lưu trong repository.",
        "Upload ảnh kiểm tra nội dung thực, loại file và dung lượng; endpoint kiểm tra owner/Admin.",
        "Swagger/Hangfire/test endpoint được giới hạn theo môi trường/quyền.",
        "Google OAuth/SMTP/domain/TLS production chưa được tuyên bố hoàn tất khi chưa có credential và hạ tầng thật.",
    ])

    # Continuation of Chapter 4.
    page_title(doc, "Chương 4", "PHÂN CÔNG THEO ĐỢT VÀ SẢN PHẨM BÀN GIAO")
    add_table(doc, ["Thành viên", "Sprint 1–2", "Sprint 3–4"], [
        ("Nguyễn Đức Thành", "TH-01..06: solution, entity/DbContext, register/login, refresh/CORS, OAuth, authorization", "TH-07..09: logout/profile, versioning/error/rate limit, seed/security tests"),
        ("Minh Long", "ML-01..05: ingredient/step, CRUD, FTS database, API search, search UI", "ML-06..08: recipe lifecycle, Redis/invalidation, automated tests"),
        ("Oven", "OV-01..05: validation, recipe wizard, error/toast, Hangfire, welcome email", "OV-06..08: category, author dashboard, common components/integration tests"),
        ("Kina Niê", "KN-01..05: MinIO, upload/delete, detail UI, SEO/image", "KN-06..08: thumbnail, sitemap/SEO, health/logging/Docker/CI"),
    ], [3.0, 6.7, 6.7], 8.5)
    add_heading(doc, "Minh chứng cần đính kèm trước khi nộp", 2)
    add_bullets(doc, [
        "Link repository, branch/PR và commit tiêu biểu của từng thành viên.",
        "Ảnh endpoint/feature tương ứng với task được giao.",
        "Kết quả test hoặc log runtime của phần phụ trách.",
        "Mỗi thành viên chuẩn bị đoạn trình bày 60–90 giây: use case, request flow, test, lỗi khó và giới hạn.",
    ])
    add_placeholder(doc, "Timeline/board phân công", "Chụp GitHub Issues/Projects hoặc bảng Sprint có Task ID TH/ML/OV/KN; bảo đảm trạng thái phản ánh commit thực tế.", 2.45)

    # Continuation of Chapter 4.
    page_title(doc, "Chương 4", "KỊCH BẢN TRÌNH DIỄN 8–10 PHÚT")
    add_table(doc, ["Thời lượng", "Thao tác", "Kết quả mong đợi"], [
        ("0:00–0:40", "Mở /health/ready và trang chủ", "Hệ thống Healthy; dữ liệu/ảnh hiển thị"),
        ("0:40–1:30", "Đăng ký/đăng nhập Author", "Cookie session; chuyển tới Góc tác giả"),
        ("1:30–3:20", "Tạo recipe có ingredient/step và upload ảnh", "Draft được lưu; validation hoạt động"),
        ("3:20–4:00", "Publish recipe", "Xuất hiện public/search/category"),
        ("4:00–5:00", "Search không dấu + filter + pagination", "Kết quả đúng và URL query rõ"),
        ("5:00–5:50", "Sửa/xóa recipe hoặc đổi trạng thái", "Bộ đếm/category/cache cập nhật"),
        ("5:50–6:50", "Bật 2FA hoặc quản lý phiên", "Giải thích mã TOTP/thu hồi phiên"),
        ("6:50–7:50", "Admin: user/category", "Role, khóa/thu hồi phiên, xóa tài khoản"),
        ("7:50–9:00", "Swagger + Jaeger/Grafana", "API docs, trace/metric/log"),
        ("9:00–10:00", "Kết quả test và kết luận", "Nêu số liệu và giới hạn trung thực"),
    ], [2.0, 6.2, 8.2], 8.5)
    add_heading(doc, "Chuẩn bị trước khi trình bày", 2)
    add_bullets(doc, [
        "Đặt báo cáo, slide, source và video/ảnh dự phòng trên cùng một máy.",
        "Chạy docker compose up -d --build; kiểm tra port, tài khoản demo và dữ liệu seed.",
        "Mở sẵn tab theo thứ tự demo; tắt thông báo và che secret/cookie/token.",
        "Nếu mạng/Google/SMTP thật không hoạt động, dùng luồng local đã xác minh và nói rõ giới hạn.",
    ])

    # Page 24
    add_page_break(doc)
    chapter_title(doc, "Chương 5", "KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN")
    add_table(doc, ["Nội dung", "Đánh giá"], [
        ("Điểm mạnh", "Kiến trúc phân lớp rõ; API/Frontend đầy đủ; dữ liệu demo lớn; bảo mật nhiều lớp; test và observability tốt; giao diện có ảnh và trạng thái UX."),
        ("Hạn chế", "Google OAuth/SMTP/domain/TLS production cần credential; Redis hit rate cần đo lại; tải mặc định bị rate limit khi 100 VU cùng IP; báo cáo PR/review cần bằng chứng tài khoản thật."),
        ("Rủi ro", "Dữ liệu demo và phần mở rộng làm hệ thống lớn; cần kiểm soát scope, migration và cache invalidation khi tiếp tục phát triển."),
        ("Hướng gần", "Hoàn tất credential thật, HTTPS/domain, đo lại cache hit/load, lưu dashboard/trace, hoàn chỉnh PR/review và ảnh demo."),
        ("Hướng dài", "Recommendation, rating/comment theo kiểm duyệt, realtime notification, mobile/PWA, CDN/image pipeline và triển khai cloud."),
    ], [3.4, 13.0], 9)
    add_heading(doc, "Bài học kinh nghiệm", 2)
    add_text(doc, "Các lỗi khó nhất không nằm riêng ở giao diện hay backend mà ở ranh giới tích hợp: refresh cookie và CSRF, ownership và UI action, cache và mutation, file database và object storage, seed và dữ liệu người dùng. Việc dùng contract, migration mới, kiểm thử hồi quy và quan sát hệ thống giúp nhóm sửa lỗi có căn cứ thay vì chỉ kiểm tra bằng mắt.")

    # Continuation of Chapter 5.
    page_title(doc, "Chương 5", "KẾT LUẬN VÀ TÀI LIỆU THAM KHẢO")
    add_heading(doc, "Kết luận", 2)
    add_text(doc, "Đồ án Culinary Blog đã hiện thực phần lõi của SRS bằng hệ thống full-stack có Clean Architecture, API versioning, bảo mật, dữ liệu mẫu, tìm kiếm, media, cache, background jobs, frontend hiện đại và observability. Các yêu cầu Lab 2–8 đều có thành phần tương ứng trong mã nguồn và được hỗ trợ bởi kết quả test/build/runtime. Phần mở rộng 2FA, quản lý phiên, xóa tài khoản và trải nghiệm Góc tác giả giúp sản phẩm hoàn chỉnh hơn cho demo cuối kỳ.")
    add_text(doc, "Nhóm cam kết rà soát lại ảnh chụp, link GitHub, MSSV, tên môn và giảng viên trước khi nộp. Những tiêu chí phụ thuộc tài khoản/hạ tầng thật tiếp tục được ghi đúng trạng thái để bảo đảm tính trung thực của báo cáo.")
    add_heading(doc, "Tài liệu tham khảo", 2)
    refs = [
        "[1] SRS Culinary Blog v1.0.0, 04/06/2026, theo IEEE 830 / ISO/IEC/IEEE 29148:2018.",
        "[2] Microsoft Learn, ASP.NET Core 10, Minimal APIs, Authentication/Authorization, EF Core.",
        "[3] Next.js Documentation, App Router, Server Components, Metadata và Image Optimization.",
        "[4] PostgreSQL 16 Documentation, Full-Text Search, unaccent và pg_trgm.",
        "[5] Redis, MinIO, Hangfire và OpenTelemetry documentation.",
        "[6] Mã nguồn, tài liệu nghiệm thu và kết quả kiểm thử trong repository CulinaryBlog của nhóm.",
    ]
    for ref in refs:
        add_text(doc, ref, size=10, align=WD_ALIGN_PARAGRAPH.LEFT, after=5)
    add_heading(doc, "Checklist hoàn thiện nhanh", 2)
    add_bullets(doc, [
        "Điền [TÊN MÔN HỌC], [TÊN GIẢNG VIÊN], MSSV và link GitHub.",
        "Thay toàn bộ khung [ẢNH DEMO / MINH HỌA] bằng ảnh chụp đúng gợi ý, giữ chú thích.",
        "Trong Word: Ctrl+A → F9 để cập nhật mục lục, danh mục và số trang.",
        "Xuất PDF, xem lại 100% trang và kiểm tra ảnh không mờ/cắt chữ trước khi nộp.",
    ])

    # Page 27 — appendix A
    add_page_break(doc)
    page_title(doc, "Phụ lục A", "MA TRẬN TRUY VẾT SRS VÀ YÊU CẦU LAB")
    add_text(doc, "Ma trận truy vết liên kết yêu cầu với thành phần hiện thực và bằng chứng nghiệm thu. Cách trình bày này giúp người chấm đối chiếu nhanh giữa tài liệu SRS, mã nguồn và kết quả chạy, đồng thời hạn chế việc mô tả tính năng chung chung mà không có minh chứng.")
    add_table(doc, ["Nhóm yêu cầu", "Thành phần hiện thực", "Bằng chứng nên trình bày"], [
        ("Lab 2 – Nền tảng dữ liệu", "Domain/Application/Infrastructure/API; EF Core DbContext; migration; seeder", "Cấu trúc solution, migration mới nhất, thống kê 20 category và 1.013 recipe"),
        ("Lab 3 – Nghiệp vụ/API", "Domain exception; repository; Unit of Work; middleware Problem Details", "Một endpoint thành công, một lỗi validation và một lỗi không tìm thấy"),
        ("Lab 4 – API đầy đủ", "Auth, user, category, recipe, ingredient, step, image, search, admin", "Tài liệu Swagger/Scalar và bộ kiểm tra runtime API 86/86"),
        ("Lab 5 – Bảo mật/nền tảng", "CORS, rate limit, JWT, RBAC, versioning, OpenAPI; Next.js/TypeScript", "Luồng đăng nhập, lỗi 429 có kiểm soát, API v1 và cấu trúc frontend"),
        ("Lab 6 – Giao diện tĩnh", "API client, xử lý lỗi, Zustand, TanStack Query, component dùng chung", "Header/footer, loading/error/empty, pagination, toast và responsive"),
        ("Lab 7 – Chức năng người dùng", "Đăng ký/đăng nhập/đăng xuất; hồ sơ; quên/đổi mật khẩu; home/detail/search/category", "Ảnh luồng hoàn chỉnh và kiểm thử Chromium"),
        ("Lab 8 – Hoàn thiện", "Upload ảnh; recipe lifecycle; quản lý user; logging; 2FA/session/delete account", "Góc tác giả, MinIO, trang quản trị, log/trace và test hồi quy"),
    ], [3.5, 7.0, 6.0], 8.2)
    add_heading(doc, "Cách sử dụng ma trận khi bảo vệ", 2)
    add_text(doc, "Khi giảng viên hỏi một yêu cầu bất kỳ, nhóm nên trả lời theo ba lớp: yêu cầu nằm ở đâu trong SRS/Lab; mã nguồn được tổ chức tại tầng nào; bằng chứng chạy hoặc kiểm thử nào xác nhận. Nếu một phần phụ thuộc dịch vụ thật như Google OAuth, SMTP production, domain hoặc TLS chưa được cấp credential, cần nói rõ trạng thái và trình bày luồng local đã kiểm chứng thay vì khẳng định quá mức.")

    # Page 28 — appendix B
    add_page_break(doc)
    page_title(doc, "Phụ lục B", "DANH MỤC API VÀ QUY TẮC PHẢN HỒI")
    add_table(doc, ["Nhóm", "Endpoint/luồng tiêu biểu", "Quyền và quy tắc"], [
        ("Auth", "register, login, refresh, logout, forgot/reset password", "Public theo rate limit; refresh rotation; cookie HttpOnly và CSRF"),
        ("Tài khoản", "me, profile, change password, sessions, 2FA, delete account", "Người dùng đã đăng nhập; thao tác nhạy cảm yêu cầu xác nhận lại"),
        ("Category", "GET list/detail; POST/PUT/DELETE admin", "Public chỉ đọc; Admin thay đổi; chặn xóa khi còn recipe hoạt động"),
        ("Recipe", "GET list/detail; POST/PUT; publish/archive/restore/delete", "Public chỉ thấy Published; Author sở hữu hoặc Admin mới được thay đổi"),
        ("Ingredient/Step", "CRUD theo recipe", "Thứ tự ổn định; validate đơn vị, số lượng và nội dung bước"),
        ("Image", "upload, đổi ảnh chính, xóa ảnh", "Multipart; kiểm tra magic bytes/MIME/dung lượng; owner hoặc Admin"),
        ("Search", "từ khóa, category, difficulty, time, sort, page", "Không dấu/có dấu; metadata phân trang; chỉ dữ liệu công khai"),
        ("Admin/Observe", "users, roles, revoke session, health, metrics", "Admin hoặc policy riêng; endpoint vận hành giới hạn theo môi trường"),
    ], [2.6, 7.2, 6.8], 8.2)
    add_heading(doc, "Quy ước lỗi thống nhất", 2)
    add_text(doc, "API trả Problem Details để frontend xử lý đồng nhất. Mã 400 dành cho request sai cấu trúc; 401 khi chưa xác thực; 403 khi không đủ quyền; 404 khi tài nguyên không tồn tại hoặc không được công khai; 409/412 khi xung đột trạng thái; 422 cho lỗi nghiệp vụ/validation; 429 khi vượt giới hạn; 500 cho lỗi chưa dự kiến. Mỗi response lỗi cần có mã truy vết để đối chiếu log và trace.")
    add_text(doc, "Frontend không hiển thị nguyên nội dung exception. API client chuyển lỗi thành thông báo tiếng Việt phù hợp, giữ chi tiết kỹ thuật trong log phát triển và buộc đăng nhập lại khi refresh session không còn hợp lệ.", italic=True, size=9.5)

    # Page 29 — appendix C
    add_page_break(doc)
    page_title(doc, "Phụ lục C", "KẾ HOẠCH CHỤP ẢNH VÀ HOÀN THIỆN BÁO CÁO")
    add_text(doc, "Các khung ảnh trong báo cáo được đặt đúng vị trí nội dung để nhóm chỉ cần chạy hệ thống và thay ảnh. Nên chụp cùng một bộ dữ liệu, cùng tài khoản demo và cùng tỷ lệ trình duyệt; che token, cookie, email riêng, mật khẩu, QR 2FA và recovery code.")
    add_table(doc, ["STT", "Ảnh cần chụp", "Thao tác và tiêu chí"], [
        ("1", "Trang chủ", "Desktop 1440 px: header, sidebar danh mục, công thức mới và ảnh món ăn rõ"),
        ("2", "Danh mục", "Ảnh đại diện từng danh mục; số lượng recipe là số thực sau khi xóa/thêm"),
        ("3", "Chi tiết công thức", "Tên món, tác giả, nguyên liệu, các bước, thời gian, khẩu phần và ảnh"),
        ("4", "Tìm kiếm", "Nhập từ khóa không dấu; lọc danh mục/độ khó; chuyển trang và giữ query URL"),
        ("5", "Góc tác giả", "Draft/Published/Archived; tạo/sửa/đổi trạng thái; không còn nút tạo dư ở header"),
        ("6", "Bảo mật", "Khối cài 2FA, danh sách phiên, thu hồi phiên và nút xóa tài khoản"),
        ("7", "Quản trị", "Danh sách user/category; role và hành động quản trị có xác nhận"),
        ("8", "API và lỗi", "Swagger/Scalar; một response Problem Details; che Authorization"),
        ("9", "Kiểm thử", "Backend 102/102, frontend 20/20 và browser 12/12 hoặc trang CI"),
        ("10", "Quan sát", "health ready, Jaeger trace và dashboard metric/log nếu có"),
    ], [1.2, 4.0, 11.5], 8.1)
    add_heading(doc, "Quy tắc trình bày ảnh", 2)
    add_text(doc, "Mỗi ảnh nên có số hình, tên ngắn và một câu giải thích điều cần quan sát. Không kéo méo ảnh; ưu tiên cắt phần trình duyệt thừa; dùng chiều rộng thống nhất. Với ảnh terminal, tăng cỡ chữ trước khi chụp. Sau khi thay ảnh, phải cập nhật mục lục, kiểm tra trang tràn và xuất PDF để xem lại ở tỷ lệ 100%.")

    # Page 30 — appendix D
    add_page_break(doc)
    page_title(doc, "Phụ lục D", "CÂU HỎI BẢO VỆ VÀ HƯỚNG DẪN CHẠY DEMO")
    add_table(doc, ["Câu hỏi thường gặp", "Ý chính cần trả lời"], [
        ("Vì sao dùng Clean Architecture?", "Tách nghiệp vụ khỏi framework, dễ kiểm thử, thay hạ tầng và kiểm soát Dependency Rule."),
        ("Vì sao xóa recipe mà số category phải giảm?", "Số lượng là dữ liệu dẫn xuất từ recipe đang hiệu lực; mutation phải invalidation cache và truy vấn lại."),
        ("Refresh rotation để làm gì?", "Mỗi lần refresh phát token mới và thu hồi token cũ; replay detection giảm rủi ro đánh cắp phiên."),
        ("Thu hồi phiên là gì?", "Vô hiệu hóa refresh session của một thiết bị hoặc tất cả thiết bị, buộc đăng nhập lại."),
        ("2FA hoạt động ra sao?", "Sau mật khẩu, server yêu cầu mã TOTP 6 số; recovery code dùng khi mất thiết bị."),
        ("Xóa tài khoản xử lý nội dung thế nào?", "Thu hồi phiên, xóa dữ liệu định danh; nội dung công khai có thể ẩn danh để tránh liên kết hỏng."),
        ("Tại sao dùng Redis và MinIO?", "Redis giảm truy vấn đọc lặp; MinIO tách file khỏi database/API và hỗ trợ pipeline ảnh."),
        ("Số liệu hiệu năng có đáng tin không?", "Nêu rõ kịch bản, thời lượng, VU, rate-limit và môi trường; không suy rộng thành production."),
    ], [6.2, 10.3], 8.2)
    add_heading(doc, "Trình tự khởi động và kiểm tra", 2)
    add_bullets(doc, [
        "Chuẩn bị file biến môi trường local không chứa credential production; khởi động các dịch vụ bằng Docker Compose.",
        "Kiểm tra PostgreSQL, Redis và MinIO ở trạng thái sẵn sàng; chạy migration/seeder nếu database mới.",
        "Mở /health/ready, trang chủ và tài liệu API; đăng nhập bằng tài khoản demo đúng vai trò.",
        "Thực hiện trước một vòng tạo–publish–search–archive để bảo đảm dữ liệu, ảnh và cache đồng bộ.",
        "Mở sẵn ảnh/video dự phòng và kết quả kiểm thử để vẫn thuyết trình được khi dịch vụ ngoài gặp lỗi.",
    ], size=9.2)
    add_text(doc, "Kết thúc phụ lục. Trước khi nộp: điền thông tin còn trống, thay ảnh minh họa, cập nhật mục lục bằng Ctrl+A rồi F9 và kiểm tra lại bản PDF cuối cùng.", bold=True, size=9.5, color=NAVY, before=4)

    set_update_fields(doc)
    doc.core_properties.title = "Báo cáo đồ án Culinary Blog"
    doc.core_properties.subject = "Phát triển ứng dụng Web nâng cao"
    doc.core_properties.author = "Nhóm Culinary Blog"
    doc.save(str(OUTPUT))
    print(OUTPUT)


if __name__ == "__main__":
    build()
