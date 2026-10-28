"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import {
  changeRecipeStatus,
  createIngredient,
  createRecipe,
  createStep,
  deleteIngredient,
  deleteStep,
  getCategories,
  getRecipeForManagement,
  updateIngredient,
  updateRecipe,
  updateStep,
  uploadRecipeImage,
} from "@/lib/api";
import { ApiClientError } from "@/lib/api-error";
import { useAuthStore } from "@/lib/auth-store";
import type {
  CreateIngredientRequest,
  CreateRecipeRequest,
  CreateStepRequest,
  Category,
  RecipeDetail,
} from "@/types/recipe";

interface RecipeForm {
  title: string;
  slug: string;
  description: string;
  cookTimeMinutes: string;
  servings: string;
  difficulty: string;
  categoryId: string;
  imageUrl: string;
}

interface IngredientDraft {
  id?: string;
  name: string;
  quantity: string;
  unit: string;
  notes: string;
}

interface StepDraft {
  id?: string;
  title: string;
  description: string;
  timerMinutes: string;
  imageUrl: string;
}

const emptyRecipe: RecipeForm = {
  title: "",
  slug: "",
  description: "",
  cookTimeMinutes: "30",
  servings: "2",
  difficulty: "Trung bình",
  categoryId: "",
  imageUrl: "",
};

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function errorMessage(error: unknown) {
  return error instanceof ApiClientError
    ? error.message
    : "Không thể lưu công thức. Vui lòng thử lại.";
}

function ingredientRequest(item: IngredientDraft, orderIndex: number): CreateIngredientRequest {
  return {
    name: item.name.trim(),
    quantity: item.quantity.trim() ? Number(item.quantity) : null,
    unit: item.unit.trim() || null,
    notes: item.notes.trim() || null,
    orderIndex,
  };
}

function stepRequest(item: StepDraft): CreateStepRequest {
  return {
    title: item.title.trim(),
    description: item.description.trim(),
    timerMinutes: item.timerMinutes.trim() ? Number(item.timerMinutes) : null,
    imageUrl: item.imageUrl.trim() || null,
  };
}

export default function RecipeEditor({ recipeId }: { recipeId?: string }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const recipeQuery = useQuery({
    queryKey: ["studio", "recipe", recipeId],
    queryFn: () => {
      if (!accessToken || !recipeId) {
        throw new Error("Bạn cần đăng nhập để chỉnh sửa công thức.");
      }
      return getRecipeForManagement(recipeId, accessToken);
    },
    enabled: Boolean(accessToken && recipeId),
  });

  if (!accessToken) {
    return (
      <section className="rounded-3xl border border-stone-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-black text-stone-900">Đăng nhập để quản lý công thức</h1>
        <Link href="/login" className="mt-5 inline-flex rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white">
          Đăng nhập
        </Link>
      </section>
    );
  }

  if (recipeId && recipeQuery.isPending) {
    return <p className="py-12 text-center text-sm text-stone-500">Đang tải công thức...</p>;
  }

  if (recipeId && recipeQuery.isError) {
    return (
      <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
        {errorMessage(recipeQuery.error)}
      </p>
    );
  }

  return (
    <RecipeEditorForm
      key={recipeId ?? "new"}
      recipeId={recipeId}
      accessToken={accessToken}
      detail={recipeQuery.data?.data}
      categories={categoriesQuery.data?.data ?? []}
      categoriesError={categoriesQuery.isError ? errorMessage(categoriesQuery.error) : ""}
      refreshRecipe={async (id) => {
        if (!accessToken) return undefined;
        if (id !== recipeId) {
          const result = await getRecipeForManagement(id, accessToken);
          return result.data;
        }
        const result = await recipeQuery.refetch();
        return result.data?.data;
      }}
    />
  );
}

function RecipeEditorForm({
  recipeId,
  accessToken,
  detail,
  categories,
  categoriesError,
  refreshRecipe,
}: {
  recipeId?: string;
  accessToken: string;
  detail?: RecipeDetail;
  categories: Category[];
  categoriesError: string;
  refreshRecipe: (id: string) => Promise<RecipeDetail | undefined>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<RecipeForm>(() => detail
    ? {
        title: detail.recipe.title,
        slug: detail.recipe.slug,
        description: detail.recipe.description,
        cookTimeMinutes: String(detail.recipe.cookTimeMinutes),
        servings: String(detail.recipe.servings),
        difficulty: detail.recipe.difficulty,
        categoryId: detail.recipe.categoryId,
        imageUrl: detail.recipe.imageUrl ?? "",
      }
    : emptyRecipe);
  const [ingredients, setIngredients] = useState<IngredientDraft[]>(() =>
    detail?.ingredients.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity === null ? "" : String(item.quantity),
      unit: item.unit ?? "",
      notes: item.notes ?? "",
    })) ?? [],
  );
  const [originalIngredientIds, setOriginalIngredientIds] = useState(
    () => detail?.ingredients.map((item) => item.id) ?? [],
  );
  const [steps, setSteps] = useState<StepDraft[]>(() =>
    detail?.steps.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      timerMinutes: item.timerMinutes === null ? "" : String(item.timerMinutes),
      imageUrl: item.imageUrl ?? "",
    })) ?? [],
  );
  const [originalStepIds, setOriginalStepIds] = useState(
    () => detail?.steps.map((item) => item.id) ?? [],
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createdRecipeId, setCreatedRecipeId] = useState<string>();
  const [status, setStatus] = useState(detail?.recipe.status ?? "Draft");
  const [slugEdited, setSlugEdited] = useState(Boolean(detail));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  async function saveRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    let savedRecipeId = recipeId ?? createdRecipeId;
    try {
      let imageUrl = form.imageUrl || null;
      if (imageFile) {
        imageUrl = (await uploadRecipeImage(imageFile, accessToken)).data.url;
      }
      const request: CreateRecipeRequest = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        cookTimeMinutes: Number(form.cookTimeMinutes),
        servings: Number(form.servings),
        difficulty: form.difficulty,
        categoryId: form.categoryId,
        imageUrl,
      };

      if (savedRecipeId) {
        await updateRecipe(
          savedRecipeId,
          { ...request, status },
          accessToken,
        );
      } else {
        const created = await createRecipe(request, accessToken);
        savedRecipeId = created.id;
        setCreatedRecipeId(created.id);
      }

      if (!savedRecipeId) throw new Error("Không nhận được mã công thức sau khi lưu.");

      const savedIngredients = [...ingredients];
      for (let index = 0; index < savedIngredients.length; index += 1) {
        const item = savedIngredients[index];
        const requestData = ingredientRequest(item, index);
        if (item.id) {
          await updateIngredient(
            { ...requestData, id: item.id, recipeId: savedRecipeId },
            accessToken,
          );
        } else {
          const created = await createIngredient(savedRecipeId, requestData, accessToken);
          savedIngredients[index] = { ...item, id: created.id };
        }
      }
      const currentIngredientIds = new Set(
        savedIngredients.flatMap((item) => item.id ? [item.id] : []),
      );
      for (const ingredientId of originalIngredientIds) {
        if (!currentIngredientIds.has(ingredientId)) {
          await deleteIngredient(savedRecipeId, ingredientId, accessToken);
        }
      }

      const savedSteps = [...steps];
      for (let index = 0; index < savedSteps.length; index += 1) {
        const item = savedSteps[index];
        const requestData = stepRequest(item);
        if (item.id) {
          await updateStep(
            { ...requestData, id: item.id, recipeId: savedRecipeId },
            accessToken,
          );
        } else {
          const created = await createStep(savedRecipeId, requestData, accessToken);
          savedSteps[index] = { ...item, id: created.id };
        }
      }
      const currentStepIds = new Set(savedSteps.flatMap((item) => item.id ? [item.id] : []));
      for (const stepId of originalStepIds) {
        if (!currentStepIds.has(stepId)) {
          await deleteStep(savedRecipeId, stepId, accessToken);
        }
      }

      setIngredients(savedIngredients);
      setOriginalIngredientIds(
        savedIngredients.flatMap((item) => item.id ? [item.id] : []),
      );
      setSteps(savedSteps);
      setOriginalStepIds(savedSteps.flatMap((item) => item.id ? [item.id] : []));
      setForm((current) => ({ ...current, imageUrl: imageUrl ?? "" }));
      await queryClient.invalidateQueries({ queryKey: ["studio", "recipes"] });
      setImageFile(null);
      setMessage("Đã lưu công thức và nội dung chi tiết.");
      if (!recipeId) router.replace(`/studio/recipes/${savedRecipeId}`);
    } catch (caughtError) {
      let saveError = errorMessage(caughtError);
      if (savedRecipeId) {
        try {
          const refreshed = await refreshRecipe(savedRecipeId);
          if (refreshed) {
            setOriginalIngredientIds(refreshed.ingredients.map((item) => item.id));
            setIngredients(refreshed.ingredients.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity === null ? "" : String(item.quantity),
              unit: item.unit ?? "",
              notes: item.notes ?? "",
            })));
            setOriginalStepIds(refreshed.steps.map((item) => item.id));
            setSteps(refreshed.steps.map((item) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              timerMinutes: item.timerMinutes === null ? "" : String(item.timerMinutes),
              imageUrl: item.imageUrl ?? "",
            })));
            setStatus(refreshed.recipe.status);
          }
        } catch (refreshError) {
          saveError += ` Không thể tải lại dữ liệu đã lưu: ${errorMessage(refreshError)}`;
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["studio", "recipes"] });
      setError(saveError);
    } finally {
      setSaving(false);
    }
  }

  async function setRecipeStatus(nextStatus: string) {
    if (!recipeId) return;
    setError("");
    setMessage("");
    setChangingStatus(true);
    try {
      await changeRecipeStatus(recipeId, nextStatus, accessToken);
      setStatus(nextStatus);
      await queryClient.invalidateQueries({ queryKey: ["studio", "recipe", recipeId] });
      await queryClient.invalidateQueries({ queryKey: ["studio", "recipes"] });
      setMessage(`Trạng thái đã chuyển thành ${nextStatus}.`);
    } catch (caughtError) {
      setError(errorMessage(caughtError));
    } finally {
      setChangingStatus(false);
    }
  }

  const isDeleted = status === "Deleted";
  const canPublish = status === "Draft" || status === "Archived";
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/studio/recipes" className="text-sm font-semibold text-stone-500 hover:text-orange-700">
            ← Danh sách công thức
          </Link>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-900">
            {recipeId ? "Cập nhật công thức" : "Thêm công thức mới"}
          </h1>
          {recipeId && <p className="mt-2 text-sm text-stone-500">Trạng thái: <strong>{status}</strong></p>}
        </div>
        {recipeId && (
          <div className="flex flex-wrap gap-2">
            {canPublish && (
              <button type="button" disabled={changingStatus || isDeleted} onClick={() => void setRecipeStatus("Published")} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                Xuất bản
              </button>
            )}
            {status === "Published" && (
              <button type="button" disabled={changingStatus} onClick={() => void setRecipeStatus("Archived")} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-bold text-stone-700 disabled:opacity-50">
                Lưu trữ
              </button>
            )}
            {status !== "Deleted" && (
              <button type="button" disabled={changingStatus} onClick={() => void setRecipeStatus("Deleted")} className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-50">
                Xóa
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      {categoriesError && <p role="alert" className="text-sm text-red-700">Không thể tải danh mục: {categoriesError}</p>}
      {isDeleted && <p className="rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-600">Công thức đã xóa không thể chỉnh sửa hoặc khôi phục.</p>}

      <form onSubmit={saveRecipe} className="space-y-6">
        <fieldset disabled={saving || isDeleted} className="space-y-6 disabled:opacity-70">
          <section className="grid gap-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8">
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-stone-700">Tên công thức</span>
              <input required maxLength={200} value={form.title} onChange={(event) => {
                const title = event.target.value;
                setForm((current) => ({ ...current, title, slug: slugEdited ? current.slug : toSlug(title) }));
              }} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-500" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-stone-700">Đường dẫn (slug)</span>
              <input required maxLength={250} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => {
                setSlugEdited(true);
                setForm((current) => ({ ...current, slug: event.target.value }));
              }} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-500" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-stone-700">Mô tả</span>
              <textarea required maxLength={2000} rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-500" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-700">Danh mục</span>
              <select required value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm">
                <option value="">Chọn danh mục</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-700">Độ khó</span>
              <select value={form.difficulty} onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value }))} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm">
                {["Dễ", "Trung bình", "Khó"].map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-700">Thời gian nấu (phút)</span>
              <input type="number" required min={1} max={1440} value={form.cookTimeMinutes} onChange={(event) => setForm((current) => ({ ...current, cookTimeMinutes: event.target.value }))} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-stone-700">Khẩu phần</span>
              <input type="number" required min={1} max={100} value={form.servings} onChange={(event) => setForm((current) => ({ ...current, servings: event.target.value }))} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-stone-700">Ảnh đại diện (JPEG, PNG hoặc WebP; tối đa 5 MB)</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm text-stone-600 file:mr-4 file:rounded-full file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:font-semibold file:text-orange-800" />
              {(imageFile || form.imageUrl) && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {form.imageUrl && <span className="text-xs text-stone-500">Ảnh hiện tại: {form.imageUrl.split("/").pop()}</span>}
                  {imageFile && <span className="text-xs text-stone-500">Ảnh mới: {imageFile.name}</span>}
                  <button type="button" onClick={() => {
                    setImageFile(null);
                    setForm((current) => ({ ...current, imageUrl: "" }));
                  }} className="text-xs font-semibold text-red-700">Gỡ ảnh</button>
                </div>
              )}
            </label>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900">Nguyên liệu</h2>
                <p className="mt-1 text-sm text-stone-500">Thêm từng nguyên liệu và định lượng.</p>
              </div>
              <button type="button" onClick={() => setIngredients((current) => [...current, { name: "", quantity: "", unit: "", notes: "" }])} className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-800">+ Thêm</button>
            </div>
            <div className="mt-5 space-y-4">
              {ingredients.map((item, index) => (
                <div key={item.id ?? `ingredient-${index}`} className="grid gap-3 rounded-2xl bg-stone-50 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr_auto]">
                  <input aria-label="Tên nguyên liệu" required maxLength={200} placeholder="Tên nguyên liệu" value={item.name} onChange={(event) => setIngredients((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, name: event.target.value } : entry))} className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm" />
                  <input aria-label="Số lượng" type="number" min={0} step="0.01" placeholder="Số lượng" value={item.quantity} onChange={(event) => setIngredients((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, quantity: event.target.value } : entry))} className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm" />
                  <input aria-label="Đơn vị" maxLength={50} placeholder="Đơn vị" value={item.unit} onChange={(event) => setIngredients((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, unit: event.target.value } : entry))} className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm" />
                  <input aria-label="Ghi chú nguyên liệu" maxLength={500} placeholder="Ghi chú" value={item.notes} onChange={(event) => setIngredients((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, notes: event.target.value } : entry))} className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm" />
                  <button type="button" aria-label="Xóa nguyên liệu" onClick={() => setIngredients((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full px-3 text-sm font-semibold text-red-700">Xóa</button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900">Các bước thực hiện</h2>
                <p className="mt-1 text-sm text-stone-500">Các bước được sắp xếp theo thứ tự hiển thị.</p>
              </div>
              <button type="button" onClick={() => setSteps((current) => [...current, { title: "", description: "", timerMinutes: "", imageUrl: "" }])} className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-800">+ Thêm bước</button>
            </div>
            <div className="mt-5 space-y-4">
              {steps.map((item, index) => (
                <div key={item.id ?? `step-${index}`} className="grid gap-3 rounded-2xl bg-stone-50 p-4 sm:grid-cols-[1fr_auto]">
                  <div className="space-y-3">
                    <input aria-label={`Tiêu đề bước ${index + 1}`} required maxLength={200} placeholder={`Bước ${index + 1}: tiêu đề`} value={item.title} onChange={(event) => setSteps((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, title: event.target.value } : entry))} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm" />
                    <textarea aria-label={`Mô tả bước ${index + 1}`} required rows={3} placeholder="Mô tả cách thực hiện" value={item.description} onChange={(event) => setSteps((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, description: event.target.value } : entry))} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm" />
                    <input aria-label={`Thời gian bước ${index + 1}`} type="number" min={0} max={1440} placeholder="Thời gian (phút, tùy chọn)" value={item.timerMinutes} onChange={(event) => setSteps((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, timerMinutes: event.target.value } : entry))} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm sm:max-w-xs" />
                    <input aria-label={`URL ảnh bước ${index + 1}`} type="url" maxLength={500} placeholder="URL ảnh bước (tùy chọn)" value={item.imageUrl} onChange={(event) => setSteps((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, imageUrl: event.target.value } : entry))} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm" />
                  </div>
                  <button type="button" aria-label={`Xóa bước ${index + 1}`} onClick={() => setSteps((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="self-start rounded-full px-3 py-2 text-sm font-semibold text-red-700">Xóa</button>
                </div>
              ))}
            </div>
          </section>
        </fieldset>

        <div className="flex flex-wrap justify-end gap-3">
          <Link href="/studio/recipes" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-bold text-stone-700">Hủy</Link>
          {!isDeleted && <button type="submit" disabled={saving} className="rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-700 disabled:opacity-60">{saving ? "Đang lưu..." : "Lưu công thức"}</button>}
        </div>
      </form>
    </div>
  );
}
