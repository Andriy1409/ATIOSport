"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { Button } from "@/components/ui/Button";
import { ProductForm } from "@/components/admin/ProductForm";
import { categoryLabel, formatPrice } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { CreateProductInput, Product } from "@/types/product";

type Editing = "new" | Product | null;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing>(null);

  function reload() {
    setLoading(true);
    return Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        if (!cancelled) {
          setProducts(p);
          setCategories(c);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(input: CreateProductInput): Promise<string | null> {
    const isEdit = editing !== "new" && editing !== null;
    const url = isEdit ? `/api/admin/products/${editing.id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      return body?.title ?? "Something went wrong.";
    }

    setEditing(null);
    await reload();
    return null;
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) {
      return;
    }
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    await reload();
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading products...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        {editing === null && <Button onClick={() => setEditing("new")}>Add product</Button>}
      </div>

      {editing !== null && (
        <ProductForm
          categories={categories}
          initial={editing === "new" ? undefined : editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="flex flex-col divide-y divide-border">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {categoryLabel(
                  categories.find((c) => c.id === product.categoryId) ?? { name: "Unknown", parentCategoryId: null },
                  categories,
                )}{" "}
                &middot; {formatPrice(product.price)} &middot; {product.stockQuantity} in stock
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(product)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(product)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
