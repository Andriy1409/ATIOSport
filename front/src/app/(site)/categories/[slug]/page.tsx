import { notFound } from "next/navigation";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { CategoryTile } from "@/components/categories/CategoryTile";
import { ProductGrid } from "@/components/products/ProductGrid";

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;

  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  const childCategories = categories.filter((c) => c.parentCategoryId === category.id);
  const categoryProducts = products.filter((p) => p.categoryId === category.id);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>

      {childCategories.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Subcategories</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {childCategories.map((child, index) => (
              <CategoryTile key={child.id} category={child} index={index} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">Products</h2>
        <ProductGrid products={categoryProducts} categories={categories} />
      </div>
    </div>
  );
}
