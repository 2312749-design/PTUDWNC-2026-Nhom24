import type { ApiResponse, PaginatedResult } from "@/types/api";
import type {
  AuthResponse,
  ChangePasswordRequest,
  Profile,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from "@/types/auth";
import type {
  Category,
  CreateIngredientRequest,
  CreateRecipeRequest,
  CreateStepRequest,
  Recipe,
  RecipeDetail,
  RecipeIngredient,
  RecipeStep,
  UpdateIngredientRequest,
  UpdateRecipeRequest,
  UpdateStepRequest,
} from "@/types/recipe";
import { ApiClientError } from "@/lib/api-error";

const apiBaseUrl =
  typeof window === "undefined"
    ? process.env.API_BASE_URL ?? "http://localhost:5217"
    : "";

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  accessToken?: string,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  const isFormData =
    typeof FormData !== "undefined" && init?.body instanceof FormData;
  if (init?.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    let errorDetails: {
      detail?: unknown;
      message?: unknown;
      title?: unknown;
      traceId?: unknown;
    } = {};

    if (body) {
      try {
        const parsed: unknown = JSON.parse(body);
        if (typeof parsed === "object" && parsed !== null) {
          errorDetails = parsed;
        }
      } catch (error) {
        if (!(error instanceof SyntaxError)) {
          throw error;
        }
      }
    }

    const message =
      (typeof errorDetails.detail === "string" && errorDetails.detail) ||
      (typeof errorDetails.message === "string" && errorDetails.message) ||
      (typeof errorDetails.title === "string" && errorDetails.title) ||
      (response.status === 401
        ? "Thông tin xác thực không hợp lệ hoặc phiên đăng nhập đã hết hạn."
        : body.trim()) ||
      `Yêu cầu API thất bại (${response.status}).`;

    throw new ApiClientError(
      message,
      response.status,
      typeof errorDetails.traceId === "string"
        ? errorDetails.traceId
        : undefined,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getRecipes(): Promise<ApiResponse<Recipe[]>> {
  return apiFetch("recipes");
}

export function searchRecipes(
  keyword: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResult<Recipe>> {
  const params = new URLSearchParams({
    q: keyword,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  return apiFetch<{
    data: Recipe[];
    pagination: {
      page: number;
      total: number;
      totalPages: number;
    };
  }>(`recipes/search?${params.toString()}`).then((result) => ({
    items: result.data,
    totalCount: result.pagination.total,
    page: result.pagination.page,
    totalPages: result.pagination.totalPages,
  }));
}

export function getRecipeBySlug(slug: string): Promise<ApiResponse<RecipeDetail>> {
  return apiFetch(`recipes/slug/${encodeURIComponent(slug)}`);
}

export function getMyRecipes(accessToken: string): Promise<ApiResponse<Recipe[]>> {
  return apiFetch("recipes/mine", undefined, accessToken);
}

export function getRecipeForManagement(
  recipeId: string,
  accessToken: string,
): Promise<ApiResponse<RecipeDetail>> {
  return apiFetch(
    `recipes/${encodeURIComponent(recipeId)}/manage`,
    undefined,
    accessToken,
  );
}

export function createRecipe(
  request: CreateRecipeRequest,
  accessToken: string,
): Promise<Recipe> {
  return apiFetch(
    "recipes",
    { method: "POST", body: JSON.stringify(request) },
    accessToken,
  );
}

export function updateRecipe(
  recipeId: string,
  request: UpdateRecipeRequest,
  accessToken: string,
): Promise<Recipe> {
  return apiFetch(
    `recipes/${encodeURIComponent(recipeId)}`,
    { method: "PUT", body: JSON.stringify(request) },
    accessToken,
  );
}

export function changeRecipeStatus(
  recipeId: string,
  status: string,
  accessToken: string,
): Promise<Recipe> {
  return apiFetch(
    `recipes/${encodeURIComponent(recipeId)}/status`,
    { method: "POST", body: JSON.stringify({ status }) },
    accessToken,
  );
}

export function uploadRecipeImage(
  file: File,
  accessToken: string,
): Promise<ApiResponse<{ url: string }>> {
  const body = new FormData();
  body.set("file", file);
  return apiFetch("media/images", { method: "POST", body }, accessToken);
}

export function createIngredient(
  recipeId: string,
  request: CreateIngredientRequest,
  accessToken: string,
): Promise<RecipeIngredient> {
  return apiFetch(
    `recipes/${encodeURIComponent(recipeId)}/ingredients`,
    { method: "POST", body: JSON.stringify(request) },
    accessToken,
  );
}

export function updateIngredient(
  request: UpdateIngredientRequest,
  accessToken: string,
): Promise<RecipeIngredient> {
  return apiFetch(
    `recipes/${encodeURIComponent(request.recipeId)}/ingredients/${encodeURIComponent(request.id)}`,
    {
      method: "PUT",
      body: JSON.stringify(request),
    },
    accessToken,
  );
}

export function deleteIngredient(
  recipeId: string,
  ingredientId: string,
  accessToken: string,
): Promise<void> {
  return apiFetch(
    `recipes/${encodeURIComponent(recipeId)}/ingredients/${encodeURIComponent(ingredientId)}`,
    { method: "DELETE" },
    accessToken,
  );
}

export function createStep(
  recipeId: string,
  request: CreateStepRequest,
  accessToken: string,
): Promise<RecipeStep> {
  return apiFetch(
    `recipes/${encodeURIComponent(recipeId)}/steps`,
    { method: "POST", body: JSON.stringify(request) },
    accessToken,
  );
}

export function updateStep(
  request: UpdateStepRequest,
  accessToken: string,
): Promise<RecipeStep> {
  return apiFetch(
    `recipes/${encodeURIComponent(request.recipeId)}/steps/${encodeURIComponent(request.id)}`,
    {
      method: "PUT",
      body: JSON.stringify(request),
    },
    accessToken,
  );
}

export function deleteStep(
  recipeId: string,
  stepId: string,
  accessToken: string,
): Promise<void> {
  return apiFetch(
    `recipes/${encodeURIComponent(recipeId)}/steps/${encodeURIComponent(stepId)}`,
    { method: "DELETE" },
    accessToken,
  );
}

export function register(request: RegisterRequest): Promise<AuthResponse> {
  return apiFetch("auth/register", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function login(request: LoginRequest): Promise<AuthResponse> {
  return apiFetch("auth/login", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function getCategories(): Promise<ApiResponse<Category[]>> {
  return apiFetch("categories");
}

export function getCategoryRecipes(
  categoryId: string,
  page = 1,
  pageSize = 12,
): Promise<PaginatedResult<Recipe>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  return apiFetch<{
    data: Recipe[];
    pagination: { page: number; total: number; totalPages: number };
  }>(`categories/${encodeURIComponent(categoryId)}/recipes?${params}`).then(
    (result) => ({
      items: result.data,
      totalCount: result.pagination.total,
      page: result.pagination.page,
      totalPages: result.pagination.totalPages,
    }),
  );
}

export function getProfile(accessToken: string): Promise<ApiResponse<Profile>> {
  return apiFetch("auth/profile", undefined, accessToken);
}

export function updateProfile(
  request: UpdateProfileRequest,
  accessToken: string,
): Promise<ApiResponse<Profile>> {
  return apiFetch(
    "auth/profile",
    { method: "PUT", body: JSON.stringify(request) },
    accessToken,
  );
}

export function changePassword(
  request: ChangePasswordRequest,
  accessToken: string,
): Promise<{ message: string }> {
  return apiFetch(
    "auth/change-password",
    { method: "POST", body: JSON.stringify(request) },
    accessToken,
  );
}

export function requestPasswordReset(email: string): Promise<{ message: string }> {
  return apiFetch("auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(
  email: string,
  token: string,
  newPassword: string,
): Promise<{ message: string }> {
  return apiFetch("auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, token, newPassword }),
  });
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: "Admin" | "Author";
  createdAt: string;
}

export function getAdminUsers(
  accessToken: string,
  page = 1,
  pageSize = 20,
  role?: "Admin" | "Author",
): Promise<PaginatedResult<AdminUser>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (role) params.set("role", role);
  return apiFetch<{
    data: AdminUser[];
    pagination: { page: number; total: number; totalPages: number };
  }>(`admin/users?${params}`, undefined, accessToken).then((result) => ({
    items: result.data,
    totalCount: result.pagination.total,
    page: result.pagination.page,
    totalPages: result.pagination.totalPages,
  }));
}
