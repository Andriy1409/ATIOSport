import Link from "next/link";
import { getCategories } from "@/lib/api/categories";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartIconLink } from "@/components/cart/CartIconLink";
import { AuthNav } from "@/components/layout/AuthNav";

export async function Header() {
  const categories = await getCategories();
  const topLevelCategories = categories.filter((category) => category.parentCategoryId === null);

  return (
    <header className="relative border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-brand">
          AtioSport
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {topLevelCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-surface"
            >
              {category.name}
            </Link>
          ))}
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
