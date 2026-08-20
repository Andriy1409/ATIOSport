---
name: api-integration-contract
description: Rules for how the Next.js frontend talks to the ASP.NET Core backend — request/response format, error handling, TypeScript types mirroring C# DTOs. Use whenever writing or editing code in front/src/lib/api, front/src/types, or wiring a new backend endpoint to the frontend.
---

# API Integration Contract — AtioSport

Defines the boundary between `front/` and `back/`. Keep both sides honoring this so a backend DTO change and a frontend type never silently drift apart.

## Transport

- Base URL from an environment variable: `NEXT_PUBLIC_API_URL` when called from a Client Component, or a server-only `API_URL` when called from a Server Component (no need to expose it to the browser bundle in that case).
- All requests/responses are JSON. ASP.NET Core's default `System.Text.Json` serializes C# `PascalCase` properties as `camelCase` on the wire — TypeScript types must be `camelCase` to match exactly what arrives, not the C# property casing.
- Auth: JWT sent as `Authorization: Bearer <token>` header. Store the token in an httpOnly cookie set by a Next.js route handler at login, not in `localStorage` — protects against XSS token theft. (This is a security-relevant default; don't switch to `localStorage` storage without a specific reason.)

## Types mirror DTOs, not entities

- Every C# response DTO in `Application/*/Dtos/` gets a matching TypeScript interface in `front/src/types/`, same fields, same nullability (`string | null` where the C# type is `string?`).
- When a backend DTO changes, update the matching frontend type in the same change — they're two halves of one contract. Naming stays parallel: `ProductDto` (C#) ↔ `Product` (TS, drop the `Dto` suffix since TypeScript doesn't need the disambiguation).
- Don't hand-write frontend types "close enough" to the backend — mismatches (an optional field treated as required, a `decimal` assumed to always be a whole number) cause runtime bugs that only show up with real data.

## Request/response shape

- List endpoints return a plain array for now (`ProductDto[]`) — add pagination (`{ items, totalCount, page, pageSize }`) once the catalog is large enough to need it; don't build pagination scaffolding speculatively before then.
- Create/update endpoints return the created/updated resource's DTO (matches the existing `ProductsController.Create` → `CreatedAtAction` pattern).

## Error handling

- The backend returns RFC 7807 `ProblemDetails` on errors (per [[api-dotnet-backend]]): `{ title, status, detail, errors? }`, `errors` present for `400` validation failures as a field → messages map.
- The frontend's `lib/api/` fetch wrapper parses non-2xx responses into a single typed `ApiError` (`{ status, title, fieldErrors? }`) and throws it — callers catch one consistent error shape regardless of which endpoint failed.
- UI components map `fieldErrors` to the matching form field's error state (see [[component-library-style]] form error styling); map a general `title`/`detail` to a toast/banner for non-field errors (404, 409 conflicts, 500s).

## Where this lives in code

- One function per resource in `lib/api/` (`products.ts`, `cart.ts`, `orders.ts`), each returning typed data or throwing `ApiError` — components never call `fetch` directly against the backend.
