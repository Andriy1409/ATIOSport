"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";

export function CatalogSortSelect({ sort }: { sort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/catalog?${params.toString()}`);
  }

  return (
    <Select value={sort} onChange={(e) => onSortChange(e.target.value)} className="min-w-[200px]">
      <option value="default">Most popular</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
    </Select>
  );
}
