---
name: ecommerce-domain-rules
description: Core business logic rules for AtioSport — how cart, orders, discounts, and product categories work, with the catalog weighted ~60% football/sport equipment. Use whenever implementing or changing cart, checkout, order, discount, or category behavior on either backend or frontend.
---

# E-commerce Domain Rules — AtioSport

The business rules behind the shop, independent of framework. Keep backend (Application/Domain layers) and frontend behavior consistent with these — they're the source of truth when the two disagree.

## Categories

- The catalog skews ~60% football gear, ~40% other sports — model this as **emphasis in presentation, not a special case in code**. Categories are a flat-ish structure, not hardcoded per-sport logic:
  - `Category` can have an optional `ParentCategoryId` to support subcategories (e.g. `Football` → `Boots`, `Balls`, `Jerseys`, `Goalkeeper Gear`, `Training Equipment`).
  - Football gets more subcategories and more prominent placement (homepage sections, nav order) because it's the bulk of the catalog — but the `Product`/`Category` model itself treats every sport identically. Don't add an `IsFootball` flag or football-specific fields to `Product`.
- Every product belongs to exactly one category (already `Product.CategoryId`, not nullable). Cross-listing a product under multiple categories is not supported in v1.

## Cart

- Cart works for **guests** (no login required to add to cart) and persists via `localStorage`/cookie on the client; on login, merge the guest cart into the user's saved cart (quantities add together for shared products).
- A cart item references `ProductId` + `Quantity`. Price is **not** frozen when added to cart — always show/recalculate the live product price while the item sits in the cart (unlike an order, which does freeze price — see below).
- Before checkout, re-validate stock for every cart line; if an item's stock dropped below the requested quantity, surface that to the user rather than silently reducing it.

## Orders

- Placing an order **snapshots** product name and price into `OrderItem` at the moment of purchase (`OrderItem.ProductName`, `OrderItem.UnitPrice`) — never join back to the live `Product` table to render historical order data. Prices/names change over time; past orders must not.
- Order status is a simple linear-ish workflow, don't over-model it: `Pending → Paid → Processing → Shipped → Delivered`, with `Cancelled` and `Refunded` as terminal side-states reachable from `Pending`/`Paid`.
- Stock is decremented when an order is **confirmed/paid**, not when an item is added to cart. Reserve-on-add-to-cart (temporary stock holds) is out of scope unless the business later has a real overselling problem.
- Checkout must re-check stock at order-creation time and reject (409-style) if it's no longer available — see the `409 Conflict` convention in [[api-dotnet-backend]].

## Discounts

- v1 scope: a single **promo code** per order (percentage or fixed-amount off the subtotal). No stacking multiple codes.
- A promo code has: an expiry window, an optional minimum order value, and an optional usage limit (total or per-user) — validate all three server-side at checkout, never trust a discount amount computed on the frontend.
- Category- or product-level "sale price" is a separate, simpler mechanism from promo codes: a product can have an optional `SalePrice` that, when set and within its date range, displays instead of `Price` — this is for merchandising ("Football boots -20%"), not a coupon.
- All discount math happens server-side at order-creation time; the frontend can preview an estimated total but the backend recomputes and is authoritative.

## General principle

When a rule isn't covered here, prefer the simpler e-commerce convention over a clever one — this is a new solo-built shop, not a marketplace with edge cases yet. Revisit this file as real requirements (payments provider, shipping rules, returns) get decided.
