import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { getClients } from "@/lib/api/adminClients";
import { AUTH_COOKIE_NAME } from "@/lib/authCookie";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { categoryLabel } from "@/lib/utils";

const LOW_STOCK_THRESHOLD = 5;

export default async function AdminDashboardPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    redirect("/login");
  }

  const [products, categories, clients] = await Promise.all([
    getProducts(),
    getCategories(),
    getClients(token),
  ]);

  const outOfStock = products.filter((p) => p.stockQuantity === 0);
  const lowStock = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= LOW_STOCK_THRESHOLD);
  const needsAttention = [...outOfStock, ...lowStock].slice(0, 6);
  const recentClients = clients.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total products</p>
          <p className="mt-2 text-2xl font-bold">{products.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Registered clients</p>
          <p className="mt-2 text-2xl font-bold">{clients.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Low stock</p>
          <p className="mt-2 text-2xl font-bold text-warning">{lowStock.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Out of stock</p>
          <p className="mt-2 text-2xl font-bold text-danger">{outOfStock.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold">Needs attention</h2>
          {needsAttention.length === 0 ? (
            <p className="text-sm text-muted-foreground">All products are well stocked.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {needsAttention.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 rounded-md bg-background px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {categoryLabel(
                        categories.find((c) => c.id === product.categoryId) ?? {
                          name: "Unknown",
                          parentCategoryId: null,
                        },
                        categories,
                      )}
                    </p>
                  </div>
                  {product.stockQuantity === 0 ? (
                    <Badge variant="danger">Out of stock</Badge>
                  ) : (
                    <Badge variant="warning">{product.stockQuantity} left</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold">Recent clients</h2>
          {recentClients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No registered clients yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentClients.map((client) => (
                <div key={client.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-xs font-semibold">
                    {client.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm">{client.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{client.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
