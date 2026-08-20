export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  categoryId: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  categoryId: string;
}

export type UpdateProductInput = CreateProductInput;
