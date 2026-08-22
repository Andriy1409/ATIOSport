import Link from "next/link";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { CategoryTile } from "@/components/categories/CategoryTile";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FeatureStrip } from "@/components/layout/FeatureStrip";
import { ProductImage } from "@/components/products/ProductImage";
import { Button } from "@/components/ui/Button";

const POPULAR_COUNT = 4;

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const topLevelCategories = categories.filter((category) => category.parentCategoryId === null);
  const kidsCategory = topLevelCategories.find((category) =>
    `${category.slug} ${category.name}`.toLowerCase().includes("kid"),
  );
  const popularProducts = products.slice(0, POPULAR_COUNT);

  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 items-center gap-6 py-4 md:grid-cols-[1.1fr_0.9fr] md:py-8">
        <div>
          <span className="mb-2 block text-sm font-semibold tracking-wide text-brand uppercase">Sport equipment shop</span>
          <h1 className="max-w-[14ch] text-4xl leading-[1.08] sm:text-5xl">Gear that holds up to the game</h1>
          <p className="mt-3 max-w-[44ch] text-muted-foreground">
            Football kits and equipment, plus everything for running, fitness and kids&apos; sports — all in one
            place. Football is at our core: over half of what we sell.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/catalog">
              <Button>Browse catalog</Button>
            </Link>
            <Link href={kidsCategory ? `/categories/${kidsCategory.slug}` : "/catalog"}>
              <Button variant="ghost">Kids&apos; sports</Button>
            </Link>
          </div>
        </div>
        <div className="aspect-4/3 overflow-hidden rounded-[calc(var(--radius-card)*1.3)]">
          <ProductImage imageUrl={null} alt="" />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl">Categories</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {topLevelCategories.map((category, index) => (
            <CategoryTile key={category.id} category={category} index={index} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl">Popular</h2>
          <Link href="/catalog" className="text-sm font-semibold text-brand hover:underline">
            Full catalog &rarr;
          </Link>
        </div>
        <ProductGrid products={popularProducts} categories={categories} />
      </section>

      <FeatureStrip />
    </div>
  );
}
