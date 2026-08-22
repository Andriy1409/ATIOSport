export interface Category {
  id: string;
  name: string;
  slug: string;
  parentCategoryId: string | null;
}

export interface CreateCategoryInput {
  name: string;
  parentCategoryId: string | null;
}

export type UpdateCategoryInput = CreateCategoryInput;
