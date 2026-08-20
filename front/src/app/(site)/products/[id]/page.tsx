import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { getProductById } from "@/lib/api/products";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
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
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
      <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
      {outOfStock ? (
        <Badge variant="danger">Out of stock</Badge>
      ) : (
        <Badge variant="success">{product.stockQuantity} in stock</Badge>
      )}
      <p className="text-zinc-600 dark:text-zinc-400">{product.description}</p>
      <AddToCartButton productId={product.id} stockQuantity={product.stockQuantity} />
    </div>
  );
}
