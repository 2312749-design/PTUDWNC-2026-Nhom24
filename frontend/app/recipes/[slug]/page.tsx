import { Metadata } from 'next';

// 1. Cập nhật kiểu dữ liệu Props: params nay là một Promise
type Props = {
  params: Promise<{ slug: string }>
};

// 2. Thêm async/await vào cấu hình SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // Chờ lấy params
  const slug = resolvedParams.slug;
  const recipeName = slug.replace(/-/g, ' '); 
  
  return {
    title: `Cách làm ${recipeName} | Culinary Blog`,
    description: `Hướng dẫn chi tiết công thức nấu ${recipeName} thơm ngon chuẩn vị tại nhà.`,
    openGraph: {
      title: `Cách làm ${recipeName}`,
      description: `Khám phá công thức làm ${recipeName} siêu ngon từ Culinary Blog.`,
      url: `http://localhost:3000/recipes/${slug}`,
      siteName: 'Culinary Blog',
      images: [
        {
          url: 'https://example.com/default-thumbnail.jpg',
          width: 1200,
          height: 630,
          alt: `Hình ảnh món ${recipeName}`,
        },
      ],
      type: 'article',
    },
  };
}

// 3. Thêm async/await vào giao diện chính
export default async function RecipeDetail({ params }: Props) {
  const resolvedParams = await params; // Chờ lấy params
  const slug = resolvedParams.slug;
  const recipeName = slug.replace(/-/g, ' ');
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipeName,
    author: {
      '@type': 'Person',
      name: 'Thành viên Nhóm 24'
    },
    description: `Công thức tuyệt hảo cho món ${recipeName}`,
    image: 'https://example.com/default-thumbnail.jpg',
  };

  return (
    <main className="p-8 max-w-4xl mx-auto font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <h1 className="text-4xl font-bold mb-4 capitalize text-blue-900">
        Chi tiết công thức: {recipeName}
      </h1>
      <p className="text-gray-600 mb-8">
        Nội dung nguyên liệu, các bước nấu và hình ảnh (từ MinIO) sẽ được fetch từ Backend API và đổ vào đây trong Lab tiếp theo.
      </p>
      
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-2xl font-semibold mb-3 text-green-800">✅ Đã hoàn tất yêu cầu Lab 2:</h2>
        <ul className="list-disc pl-5 space-y-2 text-green-900">
          <li>Thiết lập thành công <strong>Dynamic Route</strong> nhận biến <code>{slug}</code>.</li>
          <li>Tích hợp <strong>Open Graph Meta Tags</strong> động theo tên món ăn.</li>
          <li>Tích hợp <strong>JSON-LD Schema Recipe</strong> cho Google Bot đọc hiểu.</li>
        </ul>
      </div>
    </main>
  );
}