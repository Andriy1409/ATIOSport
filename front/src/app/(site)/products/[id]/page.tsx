import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { getProductById } from "@/lib/api/products";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductImage } from "@/components/products/ProductImage";
import { formatPrice } from "@/lib/utils";

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;

  const product = await getProductById(id).catch((error) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  });

  const outOfStock = product.stockQuantity <= 0;

  return (
    <div className="grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="aspect-4/3 overflow-hidden rounded-[var(--radius-card)]">
        <ProductImage imageUrl={product.imageUrl} alt={product.name} />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">{product.name}</h1>
        <p className="font-(family-name:--font-heading) text-2xl">{formatPrice(product.price)}</p>
        {outOfStock ? (
          <Badge variant="danger">Out of stock</Badge>
        ) : (
          <Badge variant="success">{product.stockQuantity} in stock</Badge>
        )}
        <p className="text-muted-foreground">{product.description}</p>
        <AddToCartButton productId={product.id} stockQuantity={product.stockQuantity} />
      </div>
    </div>
  );
}
