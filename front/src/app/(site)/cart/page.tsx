"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { getProducts } from "@/lib/api/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading cart...</p>;
  }

  const rows = items
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((row): row is { item: (typeof items)[number]; product: Product } => row.product !== undefined);

  const total = rows.reduce((sum, row) => sum + row.product.price * row.item.quantity, 0);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Cart</h1>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link href="/">
          <Button variant="outline">Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Cart</h1>

      <div className="flex flex-col gap-4">
        {rows.map(({ item, product }) => (
          <div
            key={item.productId}
            className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <Link href={`/products/${product.id}`} className="font-medium hover:underline">
                {product.name}
              </Link>
              <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
            </div>

            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={product.stockQuantity}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.productId, Math.max(1, Math.min(product.stockQuantity, Number(e.target.value))))
                }
                className="w-20"
              />
              <span className="w-24 text-right font-medium">{formatPrice(product.price * item.quantity)}</span>
              <Button variant="ghost" size="sm" onClick={() => removeItem(item.productId)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-bold">{formatPrice(total)}</span>
      </div>

      <Link href="/checkout">
        <Button className="w-full sm:w-auto">Proceed to checkout</Button>
      </Link>
    </div>
  );
}
