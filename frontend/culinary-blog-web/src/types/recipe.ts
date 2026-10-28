export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  status: string;
  categoryId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  recipeCount: number;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
  orderIndex: number;
}

export interface RecipeStep {
  id: string;
  recipeId: string;
  stepNumber: number;
  title: string;
  description: string;
  timerMinutes: number | null;
  imageUrl: string | null;
}

export interface RecipeDetail {
  recipe: Recipe;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export interface CreateRecipeRequest {
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  categoryId: string;
}

export interface UpdateRecipeRequest extends CreateRecipeRequest {
  status: string;
}

export interface CreateIngredientRequest {
  name: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
  orderIndex: number;
}

export interface CreateStepRequest {
  title: string;
  description: string;
  timerMinutes: number | null;
  imageUrl: string | null;
}

export interface UpdateIngredientRequest extends CreateIngredientRequest {
  id: string;
  recipeId: string;
}

export interface UpdateStepRequest extends CreateStepRequest {
  id: string;
  recipeId: string;
}
