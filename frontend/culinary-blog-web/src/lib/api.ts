import type { ApiResponse, PaginatedResult } from "@/types/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";
import type { Recipe, RecipeDetail } from "@/types/recipe";

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

  if (init?.body && !headers.has("Content-Type")) {
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
    throw new Error(`API request failed (${response.status})`);
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

  return apiFetch(`recipes/search?${params.toString()}`);
}

export function getRecipeBySlug(slug: string): Promise<ApiResponse<RecipeDetail>> {
  return apiFetch(`recipes/slug/${encodeURIComponent(slug)}`);
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
