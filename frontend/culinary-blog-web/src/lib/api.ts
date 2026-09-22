const API_URL = "http://localhost:5217";

export async function getRecipes() {
  const response = await fetch(
    `${API_URL}/api/v1/recipes`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách công thức");
  }

  return response.json();
}

export async function searchRecipes(
  keyword: string,
  page = 1,
  pageSize = 10
) {
  const params = new URLSearchParams({
    q: keyword,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await fetch(
    `${API_URL}/api/v1/recipes/search?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Không thể tìm kiếm công thức");
  }

  return response.json();
}