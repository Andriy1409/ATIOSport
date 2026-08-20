import Link from "next/link";
import { getCategories } from "@/lib/api/categories";
import { MobileNav } from "@/components/layout/MobileNav";

export async function Header() {
  const categories = await getCategories();
  const topLevelCategories = categories.filter((category) => category.parentCategoryId === null);

  return (
    <header className="relative border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          AtioSport
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {topLevelCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <MobileNav categories={topLevelCategories} />
      </div>
    </header>
  );
}
