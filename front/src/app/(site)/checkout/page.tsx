"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { useAuth } from "@/contexts/AuthContext";
import { getProducts } from "@/lib/api/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [prefilledFor, setPrefilledFor] = useState<string | null>(null);
  if (user && prefilledFor !== user.id) {
    setPrefilledFor(user.id);
    setCustomerName(user.name);
  }

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const rows = items
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((row): row is { item: (typeof items)[number]; product: Product } => row.product !== undefined);

  const total = rows.reduce((sum, row) => sum + row.product.price * row.item.quantity, 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.title ?? "Something went wrong. Please try again.");
        return;
      }

      clearCart();
      window.alert("Order placed successfully!");
      router.push("/");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading checkout...</p>;
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link href="/">
          <Button variant="outline">Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>

      <div className="flex flex-col gap-2 border-b border-border pb-4">
        {rows.map(({ item, product }) => (
          <div key={item.productId} className="flex items-center justify-between text-sm">
            <span>
              {product.name} &times; {item.quantity}
            </span>
            <span className="font-medium">{formatPrice(product.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          placeholder="Your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <Input
          placeholder="Phone number"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Placing order..." : "Place order"}
        </Button>
      </form>
    </div>
  );
}
