"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCartStore } from "@/hooks/useCartStore";

export function AddToCartButton({ productId, stockQuantity }: { productId: string; stockQuantity: number }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const outOfStock = stockQuantity <= 0;

  return (
    <div className="flex items-center gap-3">
      <Input
        type="number"
        min={1}
        max={stockQuantity}
        value={quantity}
        disabled={outOfStock}
        onChange={(e) => setQuantity(Math.max(1, Math.min(stockQuantity, Number(e.target.value))))}
        className="w-20"
      />
      <Button
        type="button"
        disabled={outOfStock}
        onClick={() => {
          addItem(productId, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
      >
        {outOfStock ? "Out of stock" : added ? "Added!" : "Add to cart"}
      </Button>
    </div>
  );
}
