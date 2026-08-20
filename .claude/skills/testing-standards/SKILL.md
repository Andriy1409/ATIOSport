---
name: testing-standards
description: What to test and how, across C# backend and React frontend for AtioSport — unit tests, component tests, and which parts (cart, checkout) need solid coverage. Use whenever adding tests or implementing cart/checkout/pricing/discount logic.
---

# Testing Standards — AtioSport

No blanket coverage percentage target — coverage is prioritized by how costly a bug there would be. Cart, checkout, pricing, and discount logic get thorough tests; presentational UI does not.

## Backend (C#)

- Framework: **xUnit**. Test project(s): `AtioSport.Application.Tests` for service/business-logic unit tests, mocking `IProductRepository`/other Application interfaces (no real DB) — matches the existing repository-behind-an-interface pattern in `AtioSport.Application`.
- Add `AtioSport.Api.IntegrationTests` once there are enough endpoints to justify it, using `WebApplicationFactory<Program>` against an in-memory or a disposable test database — for verifying the full request → controller → service → DB round trip on the critical flows below.
- Run with `dotnet test` from `back/`.
- **Must be covered** (near-exhaustive, including edge cases):
  - Cart total calculation, quantity updates, stock validation.
  - Order creation: price/name snapshotting into `OrderItem`, stock decrement, stock-conflict rejection (see [[ecommerce-domain-rules]]).
  - Discount/promo code validation: expiry, minimum order value, usage limits, correct amount applied.
- **Lower priority** (basic happy-path only): simple CRUD controllers with no business logic beyond calling a repository (e.g. listing categories).

## Frontend (React/Next.js)

- Framework: **Vitest + React Testing Library** for component/unit tests; **Playwright** for end-to-end critical-flow tests.
- Run with `npm test` (Vitest) and a separate `npm run test:e2e` (Playwright) from `front/`.
- **Must be covered**:
  - Cart store logic (add/remove/update quantity, persisted state, merge-on-login) — unit test the Zustand store directly per [[state-management-pattern]], no rendering needed.
  - Checkout flow — at least one Playwright e2e test covering: add to cart → checkout → order confirmation, since this is the one flow that must never silently break.
  - Price/discount display logic (sale price vs regular price rendering) as component tests.
- **Lower priority**: static presentational components (`ProductCard` layout, `Button` variants) — a snapshot or a single smoke render test is enough, don't write exhaustive interaction tests for components with no logic.

## General rule

If a bug in the code would mean a customer is charged the wrong amount, loses their cart, or can't complete an order — it needs a real test before being considered done. If a bug would just look slightly off visually, a test is optional.
