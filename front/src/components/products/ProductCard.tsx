"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/products/ProductImage";
import { useCartStore } from "@/hooks/useCartStore";
import { formatPrice } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export function ProductCard({ product, category }: { product: Product; category?: Category }) {
  const outOfStock = product.stockQuantity <= 0;
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="flex h-full flex-col gap-2 p-3 transition-colors hover:bg-surface-hover">
        <div className="-mx-3 -mt-3 aspect-4/3 overflow-hidden rounded-t-[var(--radius-card)]">
          <ProductImage imageUrl={product.imageUrl} alt={product.name} />
        </div>

        {category && <Badge variant="accent-2">{category.name}</Badge>}

        <h3 className="line-clamp-2 font-medium">{product.name}</h3>

        <div className="mt-auto flex items-center justify-between gap-2">
          {outOfStock ? (
            <Badge variant="danger">Out of stock</Badge>
          ) : (
            <span className="font-(family-name:--font-heading) text-lg">{formatPrice(product.price)}</span>
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={outOfStock}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product.id, 1);
            }}
          >
            Add to cart
          </Button>
        </div>
      </Card>
    </Link>
  );
}
