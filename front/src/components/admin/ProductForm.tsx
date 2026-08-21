"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { categoryLabel } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { CreateProductInput, Product } from "@/types/product";

export function ProductForm({
  categories,
  initial,
  onSubmit,
  onCancel,
}: {
  categories: Category[];
  initial?: Product;
  onSubmit: (input: CreateProductInput) => Promise<string | null>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price.toString() ?? "");
  const [stockQuantity, setStockQuantity] = useState(initial?.stockQuantity.toString() ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const message = await onSubmit({
      name,
      description,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      imageUrl: null,
      categoryId,
    });
    setSubmitting(false);
    setError(message);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
      <Field label="Name" htmlFor="product-name">
        <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Description" htmlFor="product-description">
        <Input
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Field>
      <div className="flex gap-3">
        <Field label="Price" htmlFor="product-price">
          <Input
            id="product-price"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Field>
        <Field label="Stock quantity" htmlFor="product-stock">
          <Input
            id="product-stock"
            type="number"
            min={0}
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
          />
        </Field>
      </div>
      <Field label="Category" htmlFor="product-category">
        <Select id="product-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {categoryLabel(category, categories)}
            </option>
          ))}
        </Select>
      </Field>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
