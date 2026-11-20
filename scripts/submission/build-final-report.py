"""Build the reviewable Word report from the repository's verified evidence."""
from pathlib import Path
import re
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs' / 'submission'
QA = ROOT / 'artifacts' / 'report-assets'
QA.mkdir(parents=True, exist_ok=True)
doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Cm(21), Cm(29.7)
sec.top_margin, sec.bottom_margin = Cm(2), Cm(2)
sec.left_margin, sec.right_margin = Cm(2.3), Cm(2)
for name in ['Normal', 'Title', 'Subtitle', 'Heading 1', 'Heading 2', 'Heading 3']:
    style = doc.styles[name]
    style.font.name = 'Times New Roman'
    style.font.color.rgb = RGBColor(0, 0, 0)
    style.font.size = Pt(11 if name == 'Normal' else 24 if name == 'Title' else 15 if name == 'Heading 1' else 13)
    style.paragraph_format.space_after = Pt(6)
    for border in list(style.element.iter(qn('w:pBdr'))): border.getparent().remove(border)
    fonts = style.element.get_or_add_rPr().get_or_add_rFonts()
    for key in ['asciiTheme','hAnsiTheme','eastAsiaTheme','cstheme']:
        fonts.attrib.pop(qn('w:'+key), None)
    for key in ['ascii','hAnsi','eastAsia','cs']: fonts.set(qn('w:'+key),'Times New Roman')
doc.styles['Normal'].paragraph_format.line_spacing = 1.15
doc.styles['Normal'].paragraph_format.widow_control = True
for n in ['Heading 1', 'Heading 2', 'Heading 3']:
    doc.styles[n].paragraph_format.keep_with_next = True
footer = sec.footer.paragraphs[0]
footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
footer.add_run('Culinary Blog   •   Nhóm 24   |   ')
field = OxmlElement('w:fldSimple'); field.set(qn('w:instr'), 'PAGE'); footer._p.append(field)

def para(text='', style=None):
    return doc.add_paragraph(re.sub(r'`([^`]+)`', r'\1', text), style)

def heading(text, level=1):
    return doc.add_heading(re.sub(r'[^\w\sÀ-ỹ]', ' ', text).strip(), level)

def table(rows):
    t = doc.add_table(rows=0, cols=len(rows[0]))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    widths = {2: [4, 12.7], 3: [4.5, 4, 8.2], 4: [2.6, 3.5, 4.3, 6.3]}.get(len(rows[0]), [16.7/len(rows[0])]*len(rows[0]))
    for col, width in zip(t.columns, widths): col.width=Cm(width)
    borders = OxmlElement('w:tblBorders')
    for edge in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        e = OxmlElement('w:'+edge); e.set(qn('w:val'), 'single'); e.set(qn('w:sz'), '4'); e.set(qn('w:color'), 'D9D9D9'); borders.append(e)
    t._tbl.tblPr.append(borders)
    for idx, values in enumerate(rows):
        row = t.add_row()
        if idx == 0:
            repeat = OxmlElement('w:tblHeader'); row._tr.get_or_add_trPr().append(repeat)
        for col, text in enumerate(values):
            cell = row.cells[col]; cell.width = Cm(widths[col]); cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            cell.text = re.sub(r'`([^`]+)`', r'\1', text.strip())
            props = cell._tc.get_or_add_tcPr()
            margin = OxmlElement('w:tcMar')
            for edge in ['top','left','bottom','right']:
                e=OxmlElement('w:'+edge); e.set(qn('w:w'),'90'); e.set(qn('w:type'),'dxa'); margin.append(e)
            props.append(margin)
            if idx == 0:
                shade=OxmlElement('w:shd'); shade.set(qn('w:fill'),'E7EDF3'); props.append(shade)
            for p in cell.paragraphs:
                p.paragraph_format.space_after=Pt(3); p.paragraph_format.space_before=Pt(3)
                p.paragraph_format.line_spacing=1.05
                for run in p.runs: run.font.size=Pt(9.5); run.bold=idx==0
    para()

def markdown(path, heading_offset=0):
    if not path.exists(): return
    lines=path.read_text(encoding='utf-8-sig').splitlines(); idx=0; code=False
    while idx<len(lines):
        line=lines[idx].strip()
        if line.startswith('```'): code=not code; idx+=1; continue
        if not line: idx+=1; continue
        if line.startswith('|'):
            rows=[]
            while idx<len(lines) and lines[idx].strip().startswith('|'):
                cells=[v.strip() for v in lines[idx].strip().strip('|').split('|')]
                if not all(re.fullmatch(r'[-: ]+', c or '-') for c in cells): rows.append(cells)
                idx+=1
            if rows: table(rows)
            continue
        if line.startswith('#'):
            count=len(line)-len(line.lstrip('#'))
            if count>1: heading(line.lstrip('# ').strip(), min(3,max(1,count-1+heading_offset)))
        elif code:
            p=para(line); p.paragraph_format.space_after=Pt(2)
            for r in p.runs: r.font.name='Consolas'; r.font.size=Pt(9)
        else: para(re.sub(r'\*\*(.*?)\*\*',r'\1',line))
        idx+=1

def diagram(name, boxes, links, size=(1400,720)):
    im=Image.new('RGB',size,'white'); d=ImageDraw.Draw(im)
    font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',25)
    for start,end,label in links:
        d.line([start,end],fill='#506070',width=3)
        x,y=end; d.polygon([(x,y),(x-7,y-14),(x+7,y-14)],fill='#506070')
        if label: d.text(((start[0]+x)//2+9,(start[1]+y)//2),label,font=font,fill='black')
    for x,y,w,h,text in boxes:
        d.rounded_rectangle((x,y,x+w,y+h),radius=9,fill='#F1F4F6',outline='#506070',width=2)
        d.multiline_text((x+18,y+16),text,font=font,fill='black',spacing=9)
    target=QA/name; im.save(target); return target

para('TRƯỜNG  ........................................................').alignment=WD_ALIGN_PARAGRAPH.CENTER
para('KHOA  .............................................................').alignment=WD_ALIGN_PARAGRAPH.CENTER
para()
p=para('Báo cáo đồ án Culinary Blog','Title'); p.alignment=WD_ALIGN_PARAGRAPH.CENTER
p=para('Phát triển ứng dụng Website nâng cao','Subtitle'); p.alignment=WD_ALIGN_PARAGRAPH.CENTER
para('Nhóm 24', 'Subtitle').alignment=WD_ALIGN_PARAGRAPH.CENTER
para('Website chia sẻ công thức nấu ăn theo SRS Culinary Blog v1.0.0').alignment=WD_ALIGN_PARAGRAPH.CENTER
para(); para('Giảng viên  ........................................................')
para('Lớp học phần  .....................................................')
para('Ngày đối chiếu mã nguồn  13 tháng 11 năm 2026')
para('Bản bàn giao để nhóm rà soát trước khi nộp. Các trường thông tin cá nhân và phân công chưa được xác nhận được để trống theo yêu cầu của chủ dự án.')
para('Repository: https://github.com/2312749-design/PTUDWNC-2026-Nhom24')
doc.add_page_break()
para('Mục lục', 'Title')
toc=OxmlElement('w:fldSimple'); toc.set(qn('w:instr'), 'TOC \\o "1-1" \\h \\z \\u')
para()._p.append(toc)
doc.add_page_break()
heading('Giới thiệu và phạm vi')
para('Culinary Blog cung cấp danh mục, công thức, nguyên liệu, bước chế biến, tìm kiếm và quản lý nội dung cho tác giả. Khách xem nội dung đã xuất bản; tác giả quản lý công thức của mình; quản trị viên quản lý danh mục và người dùng. Dự án dùng .NET 10, Next.js, PostgreSQL, Redis, MinIO, Hangfire và OpenTelemetry.')
para('Báo cáo đối chiếu trực tiếp SRS và Lab 2–8, ghi rõ phần đã kiểm thử, phần còn hạn chế và các bước nhóm phải tự xác nhận. Các chức năng mở rộng không được dùng thay cho yêu cầu lõi. Mục tiêu là trình bày trung thực sản phẩm và minh chứng để phục vụ demo, vấn đáp và bàn giao.')
heading('Thành viên và phân công')
table([['Thành viên','MSSV','Phần việc và minh chứng cần xác nhận'],['Nguyễn Đức Thành','Nhóm điền','Nhóm xác nhận theo commit và công việc thực tế'],['Nguyễn Minh Long','Nhóm điền','Nhóm xác nhận theo commit và công việc thực tế'],['Kina Niê','Nhóm điền','Cần minh chứng endpoint thứ hai theo bảng Lab 3'],['Phanthamala Somsavath','Nhóm điền','Cần minh chứng endpoint thứ hai theo bảng Lab 3']])
para('Tên trên lấy từ tài liệu dự án hiện có, chưa được xác nhận trong phiên làm việc. Không gán các thay đổi do công cụ hỗ trợ cho một thành viên cụ thể. LAB3-ENDPOINT-EVIDENCE.md lưu liên kết commit tìm thấy để nhóm đối chiếu.')
doc.add_page_break(); heading('Kiến trúc và thiết kế dữ liệu')
arch=diagram('architecture.png',[(360,20,660,95,'Browser / Next.js\nServer content + interactive client'),(360,160,660,95,'ASP.NET Core API\nHTTP, authentication, composition root'),(360,300,660,95,'Application\nMediatR, validation, use cases, interfaces'),(360,440,660,95,'Domain\nRecipe, Category, rules and lifecycle'),(30,585,1340,100,'Infrastructure implements Application interfaces\nEF Core / PostgreSQL     Redis     MinIO     Hangfire     OpenTelemetry')],[((690,115),(690,160),''),((690,255),(690,300),''),((690,395),(690,440),'')])
doc.add_picture(str(arch),width=Cm(16.5)); para('Hình 1. Kiến trúc các lớp và phụ thuộc chính. Handler legacy chưa chuyển hết được nêu trong phần hạn chế; sơ đồ không khẳng định mọi luồng đã tuân thủ đầy đủ.')
erd=diagram('erd.png',[(20,20,370,120,'ApplicationUser\nId PK, Role, Email'),(510,20,370,120,'Category\nId PK, Slug, IsVisible'),(410,230,570,140,'Recipe\nId PK, AuthorId FK, CategoryId FK\nStatus, UpdatedAt, IsDeleted'),(20,510,400,135,'RecipeIngredient\nId PK, RecipeId FK\nOrderIndex, Quantity'),(495,510,400,135,'RecipeStep\nId PK, RecipeId FK\nStepNumber, TimerMinutes'),(970,510,400,135,'RecipeImage\nId PK, RecipeId FK\nURL, IsPrimary')],[((200,140),(520,230),'1 : N'),((700,140),(760,230),'1 : N'),((540,370),(220,510),'1 : N'),((695,370),(695,510),'1 : N'),((850,370),(1160,510),'1 : N')])
doc.add_picture(str(erd),width=Cm(16.5)); para('Hình 2. ERD rút gọn của phần lõi. Bảng Users trong database tương ứng ApplicationUser; các bảng auth, jobs và phần mở rộng không hiển thị trong sơ đồ rút gọn này.')
para('Recipe dùng Draft, Published, Archived và cờ xóa mềm. Ingredient/Step là quan hệ một–nhiều với thứ tự liên tục. Một lần lưu cần giữ nhất quán entity cha, các dòng con và dữ liệu legacy. Dữ liệu seed Lab 2 có tối thiểu 10/5, trong khi công thức người dùng áp dụng mức tối thiểu 1/1 theo quyết định đã ghi nhận.')
doc.add_page_break(); heading('Kết quả đối chiếu và nghiệm thu'); markdown(OUT/'FINAL-REVIEW-2026-11-13.md',1)
doc.add_page_break(); heading('Ma trận yêu cầu SRS'); markdown(OUT/'SRS-REQUIREMENT-MATRIX.md',1)
doc.add_page_break(); heading('Kết quả kiểm thử cuối'); markdown(OUT/'TEST-RESULTS-2026-11-13.md',1)
doc.add_page_break(); heading('Hình ảnh sản phẩm')
captions={'home.png':'Trang chủ có dữ liệu công thức và sidebar danh mục','categories.png':'Danh sách danh mục với liên kết theo slug','recipe-from-category.png':'Chi tiết công thức mở từ danh mục','search.png':'Tìm kiếm công thức và bộ lọc trên URL','account-after-reload.png':'Hồ sơ đã lưu và tải lại trong trình duyệt'}
for file,caption in captions.items():
    p=ROOT/'artifacts'/'submission-browser-final'/file
    if p.exists():
        heading(caption,2)
        with Image.open(p) as im: w,h=im.size
        width=min(16.5,20*w/h)
        doc.add_picture(str(p),width=Cm(width)); para(caption+'. Ảnh chụp trên môi trường Docker kiểm thử riêng; không phải hình dựng minh họa.')
    else: para('Chưa có ảnh xác minh: '+caption+'. Nhóm cần bổ sung trước khi nộp.')
doc.add_page_break(); heading('Tài liệu tham khảo')
for text in ['SRS_Culinary_Blog_v1.0.0.pdf, yêu cầu chức năng trang 17–39 và phi chức năng trang 40–44.','Cau_Hoi_On_Tap.pdf, ba phần lý thuyết, giải thích mã và giải quyết vấn đề.','Chuong_01_Kien_truc_Web_va_RESTful_API.pdf.','Chuong_02_Xac_thuc_Phan_quyen_va_Bao_mat_API.pdf.','Chuong_03_Thiet_ke_Du_lieu_va_Toi_uu_Truy_van.pdf.','Chuong_04_Kien_truc_Frontend_voi_Nextjs.pdf và bản Updated.','Mã nguồn tại repository của nhóm; ADR 0003; các báo cáo test trong artifacts và .artifacts.']: para(text)
doc.core_properties.title='Báo cáo đồ án Culinary Blog'
doc.core_properties.author='Nhóm 24'
doc.core_properties.subject='Đối chiếu SRS và Lab 2 đến Lab 8'
target=OUT/'Bao_cao_do_an_Culinary_Blog.docx'; doc.save(target)
print(target)
