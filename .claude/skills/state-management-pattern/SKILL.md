---
name: state-management-pattern
description: React state management approach for AtioSport — cart, user session, and filters. Use whenever adding client-side state, a Context provider, or a store in the Next.js frontend.
---

# State Management Pattern — AtioSport

Default choice for this project: **React Context for rarely-changing global state, Zustand for frequently-updated interactive state.** No Redux — its boilerplate isn't justified for a solo/junior-led project of this size. (This is a default, not locked in — revisit if the app's state needs grow significantly.)

## What goes where

**React Context** — state that's global but changes rarely (login/logout, not per-keystroke):
- User session (current user, auth status) — a thin `AuthProvider` wrapping the app, backed by the JWT from [[api-integration-contract]].

**Zustand** — state that's global and updates frequently, where Context would cause unnecessary re-renders across the tree:
- **Cart**: items, quantities, derived total. Persisted to `localStorage` via Zustand's `persist` middleware so a guest's cart survives a page reload; synced/merged to the backend once the user logs in (see the merge rule in [[ecommerce-domain-rules]]).
- Ephemeral UI state tied to interactive components: whether the cart drawer or mobile filter sheet is open. Keep this separate from the cart *data* store if it grows (e.g. a small `useUiStore`) so opening a drawer doesn't re-render cart-data consumers.

**URL search params** — not component state at all, for anything the user should be able to bookmark/share:
- **Filters** (category, price range, brand, sort order) on listing pages belong in the URL (`?category=boots&sort=price-asc`), read via Next.js `useSearchParams`/`searchParams` — not stored in Zustand or Context. This makes filtered views shareable and lets Server Components read filters directly for server-side data fetching.

## What does NOT go into global client state

- **Product/category data itself** never lives in Zustand/Context — it's fetched by Server Components per [[nextjs-project-structure]] and rendered directly. Duplicating server data into a client store causes staleness bugs (price changes, stock changes) for no benefit.
- Form state (checkout form, login form) stays local `useState`/a form library within that component — it doesn't need to be global.

## Rules

- A Zustand store only holds state that's genuinely shared across multiple, non-nested components. If only one component tree needs it, use local `useState` there instead.
- Keep the cart store's public API as actions (`addItem`, `removeItem`, `updateQuantity`, `clear`) rather than letting components mutate cart array state directly — this keeps stock-check/merge logic in one place.
- Client Components that only read (not write) shared state should select the narrowest slice from the store (Zustand selector functions) to avoid re-rendering on unrelated state changes.
