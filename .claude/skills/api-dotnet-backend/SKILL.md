---
name: api-dotnet-backend
description: C# ASP.NET Core API standards for AtioSport's backend — controllers, DTOs, validation, error handling, authentication. Use whenever adding or editing anything in back/src/AtioSport.Api or the Application layer.
---

# API / ASP.NET Core Backend Standards — AtioSport

Applies to `back/src/AtioSport.Api` and `back/src/AtioSport.Application`, on top of the existing Clean Architecture layering (Domain / Application / Infrastructure / Api).

## Controllers

- Controllers are **thin**: they receive the request, call one Application service method, return a result. No business logic, no direct DbContext/EF usage in a controller — that belongs in Application/Infrastructure.
- One controller per resource (`ProductsController`, `CategoriesController`, `OrdersController`, `CartController`), route `api/[controller]`.
- Every action is `async`, returns `Task<ActionResult<T>>`, takes a `CancellationToken` parameter and passes it all the way down.
- Use the correct status code, don't default everything to 200:
  - `200 OK` — successful GET/PUT returning data
  - `201 Created` — successful POST, via `CreatedAtAction`
  - `204 No Content` — successful DELETE or PUT with no body
  - `400 Bad Request` — validation failure
  - `401 Unauthorized` / `403 Forbidden` — auth failures
  - `404 Not Found` — resource doesn't exist
  - `409 Conflict` — state conflict (e.g. stock ran out between check and order)
- `[ApiController]` attribute stays on every controller (gives automatic model validation + `ProblemDetails` responses for free).

## DTOs

- Controllers and services never accept or return Domain entities directly — always DTOs (see the existing `ProductDto` / `CreateProductDto` pattern in `AtioSport.Application`).
- Separate DTOs per operation when the shape differs: `CreateXDto`, `UpdateXDto`, `XDto` (response). Don't reuse one "God DTO" with every field optional.
- Prefer `record` types for DTOs — they're immutable and give free value equality, good for request/response payloads.
- DTOs live in `Application/<Feature>/Dtos/`, next to the service that uses them (matches existing `Products/Dtos/` folder).

## Validation

- Use **FluentValidation** for request DTOs (Create/Update). One validator class per DTO (`CreateProductDtoValidator`), registered in `AddApplication()`.
- Validation runs automatically before the action body executes (via `AddFluentValidationAutoValidation()` or a manual pipeline step) — controllers should never contain `if (dto.Price <= 0) return BadRequest(...)` style checks.
- Validation failures return `400` with a `ValidationProblemDetails` body (field name → error messages) — this is what `[ApiController]` gives automatically once model state is invalid.

## Error handling

- Global exception-handling middleware maps exceptions to `ProblemDetails` responses — no controller should have a try/catch around business logic.
- Define a small set of Application-layer exceptions the middleware understands: `NotFoundException` → 404, `ValidationException` → 400, `ConflictException` → 409 (e.g. insufficient stock). Anything unhandled → 500 with a generic message, never a raw stack trace in the response body (log the real exception with `ILogger`, return a safe message to the client).
- Use `ILogger<T>` for structured logging (`logger.LogWarning("Product {ProductId} not found", id)`), not `Console.WriteLine`.

## Authentication

- JWT Bearer auth backed by **ASP.NET Core Identity** for customer accounts (this is the default choice for now — revisit if the project ends up needing social login or a different provider).
- Protected endpoints use `[Authorize]`; admin-only endpoints (managing products/categories) use `[Authorize(Roles = "Admin")]`.
- Two roles to start: `Customer`, `Admin`. Don't over-design a permissions system before there's a second admin-level need.
- Public endpoints (browsing products/categories) stay anonymous — don't require auth to view the catalog.
- Token issued on login, short-lived access token; refresh-token flow can be added later once login/registration exists — don't build it speculatively now.

## General

- Every public method name that does I/O ends in `Async` and awaits properly — no `.Result`/`.Wait()` blocking calls.
- Nullable reference types are enabled project-wide (already set in the `.csproj`) — respect `?` annotations, don't suppress warnings with `!` unless you're certain.
