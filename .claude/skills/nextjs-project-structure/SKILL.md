---
name: nextjs-project-structure
description: Project-structure conventions for AtioSport's Next.js App Router frontend — folder layout, routing, and server vs client component rules. Use whenever creating a new page, route, component, or file anywhere in front/, so the architecture stays consistent across the whole app.
---

# Next.js Project Structure — AtioSport

`front/` was scaffolded with `create-next-app` (App Router, TypeScript, Tailwind, `src/` dir, `@/*` import alias). Follow these conventions for every new file so the codebase stays consistent as it grows — don't improvise a different layout per feature.

## Top-level folder layout (under `src/`)

```
src/
  app/                  routes only — no business logic here
    layout.tsx
    page.tsx
    (site)/             route group for public shop pages
      page.tsx           -> /
      products/
        page.tsx          -> /products
        [slug]/page.tsx    -> /products/:slug
      categories/
        [slug]/page.tsx    -> /categories/:slug
      cart/page.tsx        -> /cart
      checkout/page.tsx    -> /checkout
    (account)/           route group for auth-gated pages
      account/page.tsx
      orders/page.tsx
    api/                 route handlers only if truly needed (see below)
  components/
    ui/                 generic, reusable, no business meaning (Button, Card, Modal, Input)
    layout/             Header, Footer, Nav, MobileMenu
    products/           ProductCard, ProductGrid, ProductGallery
    cart/               CartDrawer, CartItem, CartSummary
    filters/             FilterSidebar, FilterSheet
  lib/
    api/                functions that call the ASP.NET Core backend (fetch wrappers per resource: products.ts, categories.ts, cart.ts)
    utils.ts            small pure helpers (formatPrice, cn, slugify)
  types/                shared TypeScript types/interfaces (Product, Category, CartItem) — mirror the backend DTOs
  hooks/                custom hooks (useCart, useMediaQuery) — only when logic is reused in 2+ places
```

Rules:
- **Route groups** `(site)` / `(account)` organize routes without affecting the URL — use them to separate public shop pages from authenticated ones once auth exists.
- Dynamic segments use `[slug]` (or `[id]` when the backend key is a GUID/int, matching whatever the API actually uses) — never invent query-string-based "dynamic" pages when a real route segment fits.
- `app/` holds **routing files only**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`. A page composes components from `src/components/`; it does not define large inline JSX trees or business logic itself.
- Only add `app/api/*` route handlers for things that must run server-side and aren't just a proxy to the .NET API (e.g. setting an httpOnly cookie, a webhook receiver). Plain data fetching from the backend happens via `lib/api/*`, called directly from Server Components — don't route it through a Next.js API layer for no reason.

## Naming conventions

- Folders and route segments: `kebab-case` (`product-card/`, not `ProductCard/`).
- Component files: `PascalCase.tsx` matching the exported component name (`ProductCard.tsx` exports `ProductCard`).
- Non-component files (`utils.ts`, `products.ts`): `camelCase.ts`.
- One component per file. Colocate a component's own tiny sub-parts in the same file only if they are never reused elsewhere; otherwise give them their own file in the same folder.

## Server vs Client components

Default to **Server Components** — that's the App Router default, and most of this shop's UI (product listings, product detail, static pages) needs no interactivity and should stay server-rendered for performance and SEO.

Add `"use client"` only to the smallest component that actually needs it:
- Anything with `useState`, `useEffect`, `useContext`, event handlers (`onClick`, `onChange`), or browser-only APIs.
- Examples that need it: `AddToCartButton`, `CartDrawer`, `FilterSheet` (toggling open/closed), `ImageGallery` (thumbnail switching), search/quantity inputs.
- Examples that must stay server components: `ProductGrid`, `ProductCard` (link + image + price, no interaction by itself), category/listing pages, layout shells.

Push `"use client"` as far down the tree as possible: wrap only the interactive leaf (e.g. `AddToCartButton`) in a client component, not the whole page that renders it. A Server Component can render a Client Component as a child, but not the reverse — structure pages so the interactive bits are small islands, not top-down.

## Data fetching

- Server Components fetch data directly (`await` a function from `lib/api/*`) — no `useEffect` + `fetch` for initial page data.
- `lib/api/*` functions call the ASP.NET Core backend and return typed results using the shared types in `src/types/`. Keep the base API URL in an environment variable (`NEXT_PUBLIC_API_URL` if called from the client, plain `API_URL` if server-only).
- Client Components only fetch client-side for things that must react to user interaction after initial load (e.g. live cart updates) — use a small fetch wrapper or a data-fetching lib if that need grows, not ad hoc `useEffect` fetches scattered around.

## When adding a new feature

1. Does it need a new route? Add it under the right route group in `app/`, file is `page.tsx` only.
2. Build its UI as components in the matching `components/<domain>/` folder.
3. If it talks to the backend, add/extend a file in `lib/api/`.
4. Add/extend types in `src/types/` to match the backend DTO shape.
5. Only reach for `hooks/` or client state once two or more components actually need to share that logic — don't pre-create hooks speculatively.
