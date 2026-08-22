import {
  Goal,
  CircleDot,
  Dumbbell,
  Footprints,
  Baby,
  Backpack,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

const ICONS_BY_KEYWORD: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["football", "soccer", "футбол"], icon: Goal },
  { keywords: ["basketball", "баскетбол"], icon: CircleDot },
  { keywords: ["fitness", "gym", "фітнес"], icon: Dumbbell },
  { keywords: ["running", "run", "біг"], icon: Footprints },
  { keywords: ["kids", "children", "дит"], icon: Baby },
  { keywords: ["accessor", "аксесуар"], icon: Backpack },
];

export interface CategoryDisplay {
  icon: LucideIcon;
  tintClass: string;
  inkClass: string;
}

/**
 * Categories have no icon/color field in the backend — this maps a slug/name
 * to a presentational icon and alternating accent tint, purely for display.
 */
export function getCategoryDisplay(category: { slug: string; name: string }, index: number): CategoryDisplay {
  const haystack = `${category.slug} ${category.name}`.toLowerCase();
  const match = ICONS_BY_KEYWORD.find(({ keywords }) => keywords.some((keyword) => haystack.includes(keyword)));
  const icon = match?.icon ?? ShoppingBag;

  const isAccent2 = index % 2 === 1;
  return {
    icon,
    tintClass: isAccent2 ? "bg-accent-2-tint" : "bg-accent-tint",
    inkClass: isAccent2 ? "text-accent-2-tint-ink" : "text-accent-tint-ink",
  };
}
