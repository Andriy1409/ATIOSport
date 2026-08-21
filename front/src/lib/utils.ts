import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number) {
  return priceFormatter.format(price);
}

export function categoryLabel(category: { name: string; parentCategoryId: string | null }, categories: { id: string; name: string }[]) {
  if (!category.parentCategoryId) {
    return category.name;
  }
  const parent = categories.find((c) => c.id === category.parentCategoryId);
  return parent ? `${parent.name} > ${category.name}` : category.name;
}
