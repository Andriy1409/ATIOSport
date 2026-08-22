import Link from "next/link";
import { getCategories } from "@/lib/api/categories";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartIconLink } from "@/components/cart/CartIconLink";
import { AuthNav } from "@/components/layout/AuthNav";

export async function Header() {
  const categories = await getCategories();
  const topLevelCategories = categories.filter((category) => category.parentCategoryId === null);

  return (
    <header className="relative">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-(family-name:--font-heading) text-lg text-brand">
          AtioSport
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {topLevelCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium hover:bg-surface"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/catalog" className="rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium hover:bg-surface">
            Catalog
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden md:block">
            <AuthNav />
          </div>
          <CartIconLink />
          <MobileNav categories={topLevelCategories} />
        </div>
      </div>
    </header>
  );
}
