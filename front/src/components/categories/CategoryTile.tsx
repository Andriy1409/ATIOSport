import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { Category } from "@/types/category";

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="flex h-24 items-center justify-center p-4 text-center transition-colors hover:border-brand sm:h-32">
        <span className="font-medium">{category.name}</span>
      </Card>
    </Link>
  );
}
