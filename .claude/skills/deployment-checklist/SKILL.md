---
name: deployment-checklist
description: Pre-deploy checklist for AtioSport — responsive checks, clean builds, environment variables, database connectivity. Use whenever preparing to deploy either front/ or back/, or when asked if the app is "ready to deploy" / "ready to ship".
---

# Deployment Checklist — AtioSport

Run through this before any deploy of `front/` or `back/` — don't ship on "it works on my machine."

## Backend (`back/`)

- [ ] `dotnet build` succeeds with **0 warnings, 0 errors** on the full solution.
- [ ] `dotnet test` passes (see [[testing-standards]] for what must be covered).
- [ ] All pending EF Core migrations are applied to the target database — verify with `dotnet ef migrations list` that nothing is unapplied, per [[sql-schema-conventions]].
- [ ] Connection string comes from environment/configuration for the target environment (Azure App Settings, etc.) — never a hardcoded LocalDB/dev string shipped to prod.
- [ ] JWT signing key and any other secrets are set via environment variables/secret store, not committed in `appsettings.json`.
- [ ] CORS policy's allowed origin list includes the actual deployed frontend domain (currently hardcoded to `localhost:3000` for dev — must be updated before prod).
- [ ] HTTPS is enforced (`UseHttpsRedirection` already present) and the hosting environment terminates TLS correctly.

## Frontend (`front/`)

- [ ] `npm run build` succeeds with no type errors and no ESLint errors blocking the build.
- [ ] `NEXT_PUBLIC_API_URL` (and any server-only `API_URL`) point at the deployed backend, not `localhost`.
- [ ] Responsive check at the three standard widths — 375px / 768px / 1440px — on every page touched since the last deploy, per [[frontend-responsive-design]]. Don't skip this for "just a small change."
- [ ] No leftover placeholder content (Next.js starter boilerplate, lorem ipsum, test product data) visible on any public page.

## Cross-cutting

- [ ] Smoke-test the critical path end-to-end against the deployed environment after going live: browse catalog → add to cart → checkout → order confirmation. This is the one flow that must be manually re-verified even if automated tests passed, since it crosses both deployed services.
- [ ] Confirm the database is reachable from the deployed backend (not just from your local machine) — a wrong firewall rule/connection string is the most common first-deploy failure.
- [ ] Rollback plan: know how to redeploy the previous backend build and/or revert the last migration if something breaks in production.
