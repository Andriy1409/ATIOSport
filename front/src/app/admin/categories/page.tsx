"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/categories";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { Category, CreateCategoryInput } from "@/types/category";

type Editing = "new" | Category | null;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing>(null);

  function reload() {
    setLoading(true);
    return getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
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

  async function handleSubmit(input: CreateCategoryInput): Promise<string | null> {
    const isEdit = editing !== "new" && editing !== null;
    const url = isEdit ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
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

  async function handleDelete(category: Category) {
    if (!window.confirm(`Delete "${category.name}"?`)) {
      return;
    }

    const response = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      window.alert(body?.title ?? "Something went wrong.");
      return;
    }

    await reload();
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading categories...</p>;
  }

  const topLevelCategories = categories.filter((category) => category.parentCategoryId === null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        {editing === null && <Button onClick={() => setEditing("new")}>Add category</Button>}
      </div>

      {editing !== null && (
        <CategoryForm
          topLevelCategories={topLevelCategories}
          initial={editing === "new" ? undefined : editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="flex flex-col gap-3">
        {topLevelCategories.map((category) => {
          const children = categories.filter((c) => c.parentCategoryId === category.id);
          return (
            <Card key={category.id} className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{category.name}</p>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(category)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(category)}>
                    Delete
                  </Button>
                </div>
              </div>
              {children.length > 0 && (
                <div className="flex flex-col gap-1 pl-4">
                  {children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between gap-3">
                      <p className="text-sm text-muted-foreground">&bull; {child.name}</p>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditing(child)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(child)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
