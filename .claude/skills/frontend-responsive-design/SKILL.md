---
name: frontend-responsive-design
description: Responsive layout rules for AtioSport's Next.js + Tailwind frontend — breakpoints, flex/grid usage, mobile-first workflow, and how components (nav, product grid, cart, filters) must behave across screen sizes. Use whenever creating or editing a component, page, or layout in front/.
---

# Frontend Responsive Design — AtioSport

Rules for building any UI in `front/` (Next.js App Router + TypeScript + Tailwind CSS). Apply this on every new component and every layout change, not just when explicitly asked for "responsive" work.

## Breakpoints (Tailwind defaults — do not invent custom ones)

| Prefix | Min width | Treat as |
|---|---|---|
| *(none)* | 0px | phones — this is the default, unprefixed styles |
| `sm:` | 640px | large phones / small tablets portrait |
| `md:` | 768px | tablets |
| `lg:` | 1024px | small laptops |
| `xl:` | 1280px | desktops |
| `2xl:` | 1536px | large desktops |

Design decisions in this project only care about three practical tiers: **mobile** (`< md`), **tablet** (`md`–`lg`), **desktop** (`≥ lg`). Don't add `xl:`/`2xl:` overrides unless a layout actually breaks at those widths — most components should cap `max-width` and center instead of keep growing.

## Mobile-first, always

- Write the unprefixed (base) classes for the mobile layout first. Add `md:`/`lg:` classes only to *change* things for larger screens — never the reverse.
- Never build the desktop layout first and try to squeeze it down with `sm:` overrides. That produces bugs on real phones and defeats Tailwind's cascade model.
- Prefer CSS-only responsiveness (Tailwind breakpoint classes) over JS-based conditional rendering (`useMediaQuery`, `window.innerWidth`). Reserve JS breakpoint checks for cases where the *behavior*, not just the *style*, must differ (e.g. swapping a `<Drawer>` component for a `<Sidebar>` component) — see component rules below.

## Flex vs Grid — pick by content shape

- **Grid** for anything that is fundamentally a collection of same-shaped items: product listings, category tiles, image galleries. Use `grid-cols-*` with responsive column counts (see Product Grid below). Grid also wins for two-dimensional layouts (e.g. a page shell with header/sidebar/content/footer).
- **Flex** for one-dimensional arrangements: navbars, toolbars, button groups, a card's internal content (image + text + price stacked or side-by-side), form rows. Use `flex-col` on mobile switching to `flex-row` at the breakpoint where horizontal space allows it, e.g. `flex flex-col md:flex-row`.
- Don't use Grid where Flex suffices (e.g. a 2-item nav bar) — Grid adds complexity with no benefit there.

## How specific components must behave

**Header / navigation**
- Mobile (`< md`): logo + hamburger icon only. Nav links live in a slide-out/off-canvas menu.
- `md:` and up: full horizontal nav visible, hamburger hidden.
- Cart icon with item-count badge always visible at every breakpoint (top-right).

**Product grid (catalog / category / search results)**
- Mobile: `grid-cols-2`
- `md:`: `grid-cols-3`
- `lg:`: `grid-cols-4`
- Never go below 2 columns on mobile (single column wastes space and reads as a list, not a shop) and never exceed 4 columns even on very large screens — cap the grid's `max-width` and center it instead of adding more columns.
- Product cards keep a consistent aspect-ratio image container (`aspect-square` or `aspect-[3/4]`) at every breakpoint so the grid never jitters while images load. Always use `next/image` with an explicit `sizes` prop matching the current column count per breakpoint (e.g. `sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"`).

**Filters (category/price/brand filters on listing pages)**
- Mobile/tablet (`< lg`): filters live in a bottom sheet or full-screen overlay triggered by a "Filters" button — not inline, they'd eat the whole viewport.
- `lg:` and up: filters render as a permanent left sidebar next to the product grid.
- This is a genuine component swap (different DOM/interaction, not just CSS) — use a JS breakpoint check or two components gated by Tailwind's `hidden`/`lg:hidden` pairing, whichever keeps the bundle simpler for that page.

**Cart**
- Mobile: full-screen takeover when opened.
- `md:` and up: slide-in drawer from the right, page content stays visible/dimmed behind it.

**Product detail page**
- Mobile: stacked — image gallery on top, product info (name/price/add-to-cart/description) below.
- `lg:` and up: two-column — gallery left, info right, info column sticky while gallery scrolls if the gallery is tall.

**Forms (checkout, login, account)**
- Always single-column on mobile. Only pair fields side-by-side (e.g. first/last name, city/postal code) at `md:` and up, using `flex` or `grid-cols-2`.

## Touch and spacing

- Every tappable element (buttons, nav links, cart quantity steppers) needs a minimum 44×44px hit area on mobile — pad, don't just rely on font size.
- Use Tailwind's spacing scale consistently (`p-4`, `gap-4`, etc.) rather than arbitrary values (`p-[13px]`) unless matching a specific design spec.

## Before considering a component done

Check it at three widths: **375px** (small phone), **768px** (tablet), **1440px** (desktop). If a component needs a fourth check, that's a signal the layout is over-engineered for this project's needs — simplify instead of adding another breakpoint.
