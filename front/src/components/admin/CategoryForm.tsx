"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Category, CreateCategoryInput } from "@/types/category";

export function CategoryForm({
  topLevelCategories,
  initial,
  onSubmit,
  onCancel,
}: {
  topLevelCategories: Category[];
  initial?: Category;
  onSubmit: (input: CreateCategoryInput) => Promise<string | null>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [parentCategoryId, setParentCategoryId] = useState(initial?.parentCategoryId ?? "");
  const parentOptions = topLevelCategories.filter((category) => category.id !== initial?.id);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const message = await onSubmit({
      name,
      parentCategoryId: parentCategoryId || null,
    });
    setSubmitting(false);
    setError(message);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-md border border-border p-4">
      <Field label="Name" htmlFor="category-name">
        <Input id="category-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Parent category" htmlFor="category-parent">
        <Select
          id="category-parent"
          value={parentCategoryId}
          onChange={(e) => setParentCategoryId(e.target.value)}
        >
          <option value="">None (top-level category)</option>
          {parentOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
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
