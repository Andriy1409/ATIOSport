import { getCategories } from "@/lib/api/categories";
import { CategoryTile } from "@/components/categories/CategoryTile";

export default async function HomePage() {
  const categories = await getCategories();
  const topLevelCategories = categories.filter((category) => category.parentCategoryId === null);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sport equipment for every game</h1>
        <p className="mt-2 max-w-xl text-zinc-600 dark:text-zinc-400">
          Football gear and equipment for other sports, all in one place.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Shop by category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {topLevelCategories.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
