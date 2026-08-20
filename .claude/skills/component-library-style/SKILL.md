---
name: component-library-style
description: Shared UI style rules for AtioSport's component library — buttons, product cards, forms, colors, typography. Use whenever creating or editing a component in front/src/components/ui or any component that renders user-facing UI.
---

# Component Library Style — AtioSport

Keeps every button, card, and form across the shop looking like one product instead of a patchwork. Applies to everything under `front/src/components/` (see [[nextjs-project-structure]] for where files live).

## Design tokens (Tailwind config)

Define these as Tailwind theme extensions in `tailwind.config` (or CSS variables in `globals.css` for Tailwind v4) rather than hardcoding hex values in components:

- **Primary color**: an energetic accent — a pitch-green (`#16A34A`-ish) or a bold orange (`#EA580C`-ish) both read as "sport"; pick one as `primary` and stick to it everywhere (buttons, links, badges, active states). Don't let individual pages introduce their own accent color.
- **Neutral scale**: grays for text/backgrounds/borders (Tailwind's default `slate` or `zinc` scale is fine — don't hand-roll a custom gray scale).
- **Semantic colors**: `success` (order confirmed), `danger` (out of stock, form errors), `warning` (low stock) — map to Tailwind's `green-600`/`red-600`/`amber-600` equivalents, used consistently for their meaning only (never use `danger` red for a decorative purpose).
- **Sale/discount badge**: one consistent color+style (e.g. `danger`-toned badge, small, top-left corner of product image) used everywhere a discounted price appears.

## Typography

- One type scale, defined once, reused everywhere — don't pick font sizes ad hoc per component:
  - `h1` — page titles (e.g. category name)
  - `h2` — section headings (e.g. "Football Boots", "Related Products")
  - `h3` — card/product titles
  - `body` — default paragraph/description text
  - `small` — meta text (SKU, stock count, timestamps)
- Price text gets its own consistent treatment: bold, slightly larger than body text, using the primary or a neutral-dark color (not the accent color unless it's specifically a sale price, which can use `danger`).

## Buttons

- Variants: `primary` (main CTA — "Add to Cart", "Checkout"), `secondary` (lower-emphasis actions), `outline` (tertiary), `ghost` (icon-only/minimal), `destructive` (remove item, cancel order).
- Sizes: `sm`, `md` (default), `lg`.
- Build variants with a single `Button` component using `class-variance-authority` (`cva`) or an equivalent variant-prop pattern — never copy-paste a styled `<button>` per usage site.
- Consistent radius and padding across all variants/sizes (pick one border-radius scale, e.g. `rounded-md`, and use it for every interactive element — buttons, inputs, cards).

## Product cards

Fixed structure, reused everywhere a product appears (grid, related products, search results, wishlist):
1. Image (consistent aspect ratio — see [[frontend-responsive-design]])
2. Sale badge (top-left, only if `SalePrice` is active)
3. Product name (`h3` style, truncate to 1–2 lines, never wrap the card taller)
4. Price (current price; if on sale, show original price struck through + sale price in `danger`)
5. Add-to-cart action (icon button or full button depending on available space)

## Forms

- Every input: label above the field (not placeholder-as-label), consistent height/padding/border matching the button radius, a visible focus ring using the primary color.
- Error state: red border + a small error message below the field, in `danger` color, same position/style across every form (checkout, login, registration).
- Required fields don't need a visual asterisk if the form is short (checkout/login); use one only on longer forms with a mix of required/optional fields.

## Where these live in code

- Generic, meaning-free components (`Button`, `Input`, `Badge`, `Card`) go in `components/ui/` and take variant/size props — they know nothing about "product" or "cart".
- Domain components (`ProductCard`, `AddToCartButton`) compose the `ui/` primitives and live in their own domain folder per [[nextjs-project-structure]].
