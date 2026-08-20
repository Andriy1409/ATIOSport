import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stockQuantity <= 0;

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:border-primary">
        <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-base font-bold">{formatPrice(product.price)}</span>
          {outOfStock && <Badge variant="danger">Out of stock</Badge>}
        </div>
      </Card>
    </Link>
  );
}
