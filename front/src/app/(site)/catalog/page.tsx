import Link from "next/link";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CatalogSortSelect } from "@/components/products/CatalogSortSelect";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const SORTS = ["default", "price-asc", "price-desc"] as const;

export default async function CatalogPage({ searchParams }: PageProps<"/catalog">) {
  const params = await searchParams;
  const categorySlug = typeof params.category === "string" ? params.category : "all";
  const sortParam = typeof params.sort === "string" ? params.sort : "default";
  const sort = SORTS.includes(sortParam as (typeof SORTS)[number]) ? sortParam : "default";

  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const topLevelCategories = categories.filter((category) => category.parentCategoryId === null);
  const activeCategory = topLevelCategories.find((category) => category.slug === categorySlug);

  let filtered = activeCategory ? products.filter((p) => p.categoryId === activeCategory.id) : products;
  filtered = [...filtered].sort((a: Product, b: Product) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  const resultsLabel = activeCategory
    ? `${filtered.length} products in "${activeCategory.name}"`
    : `${filtered.length} products`;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="mb-1 text-3xl">Catalog</h1>
        <p className="m-0 text-muted-foreground">{resultsLabel}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/catalog"
            className={cn(
              "rounded-[var(--radius-button)] px-3.5 py-2 text-sm font-medium",
              !activeCategory ? "bg-primary text-primary-foreground" : "bg-surface hover:bg-surface-hover",
            )}
          >
            All products
          </Link>
          {topLevelCategories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog?category=${category.slug}`}
              className={cn(
                "rounded-[var(--radius-button)] px-3.5 py-2 text-sm font-medium",
                activeCategory?.id === category.id ? "bg-primary text-primary-foreground" : "bg-surface hover:bg-surface-hover",
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <CatalogSortSelect sort={sort} />
      </div>

      <div className="py-2">
        <ProductGrid products={filtered} categories={categories} />
      </div>
    </div>
  );
}
