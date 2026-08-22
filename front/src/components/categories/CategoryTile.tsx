import Link from "next/link";
import { getCategoryDisplay } from "@/lib/categoryDisplay";
import type { Category } from "@/types/category";

export function CategoryTile({ category, index = 0 }: { category: Category; index?: number }) {
  const { icon: Icon, tintClass, inkClass } = getCategoryDisplay(category, index);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] bg-surface px-2 py-4 text-center transition-colors hover:bg-surface-hover"
    >
      <span className={`flex h-14 w-14 items-center justify-center rounded-full ${tintClass} ${inkClass}`}>
        <Icon strokeWidth={2} className="h-6 w-6" />
      </span>
      <span className="text-sm font-semibold">{category.name}</span>
    </Link>
  );
}
