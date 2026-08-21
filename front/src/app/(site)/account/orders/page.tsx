import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyOrders } from "@/lib/api/orders";
import { AUTH_COOKIE_NAME } from "@/lib/authCookie";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default async function MyOrdersPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    redirect("/login");
  }

  const orders = await getMyOrders(token);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">My orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
          <Link href="/">
            <Button variant="outline">Continue shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
            return (
              <Card key={order.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order #{order.id.slice(0, 8)}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.createdAtUtc).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-col gap-1 border-t border-border pt-3">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between text-sm">
                      <span>
                        {item.productName} &times; {item.quantity}
                      </span>
                      <span className="text-muted-foreground">{formatPrice(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
