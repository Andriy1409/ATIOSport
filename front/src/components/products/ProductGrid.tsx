import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">No products in this category yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
