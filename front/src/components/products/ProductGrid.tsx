import { ProductCard } from "@/components/products/ProductCard";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export function ProductGrid({ products, categories = [] }: { products: Product[]; categories?: Category[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground">No products in this category yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={categories.find((category) => category.id === product.categoryId)}
        />
      ))}
    </div>
  );
}
