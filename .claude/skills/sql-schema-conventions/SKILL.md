---
name: sql-schema-conventions
description: Database schema design rules for AtioSport — table/column naming, relationships, indexes, migrations. Use whenever adding or changing an entity, EF Core configuration, or migration in back/src/AtioSport.Domain or AtioSport.Infrastructure.
---

# SQL Schema Conventions — AtioSport

Applies to `AtioSport.Domain` (entities) and `AtioSport.Infrastructure/Persistence` (DbContext, configurations, migrations). Keep the schema consistent as new entities are added — don't let table/column style drift between features.

## Naming

- **Tables**: PascalCase, plural — matches EF Core's default convention from the `DbSet<T>` property name (`Products`, `Categories`, `Orders`, `OrderItems`). Don't override this to snake_case or singular; stay with the default so it matches C# naming with zero configuration.
- **Columns**: PascalCase, matching the C# property exactly (`Name`, `Price`, `CreatedAtUtc`). No abbreviations (`Qty` → `Quantity`, `Desc` → `Description`).
- **Primary key**: every entity inherits `BaseEntity` (`Id` as `Guid`, `CreatedAtUtc` as `DateTime`) — established in `Domain/Common/BaseEntity.cs`. Don't invent a different PK shape (no `int` identity columns) for new entities; consistency across tables matters more than the marginal index-size benefit of `int`.
- **Foreign keys**: `<Entity>Id` (`CategoryId` on `Product`, `OrderId` on `OrderItem`). Navigation property has the same name as the referenced entity (`Category`, `Order`).
- **Join/link tables** (if a many-to-many ever appears, e.g. Product ↔ Tag): name it `<EntityA><EntityB>` (`ProductTag`).

## Relationships

- Configure every relationship explicitly via Fluent API in an `IEntityTypeConfiguration<T>` class (see `ProductConfiguration`, `CategoryConfiguration`) — don't rely on EF's implicit convention-based relationship discovery for anything beyond the simplest FK.
- Pick delete behavior deliberately, don't leave it on EF's default:
  - Reference data a row depends on but shouldn't disappear with it (e.g. `Product → Category`): `DeleteBehavior.Restrict` — you can't delete a category that still has products.
  - True parent/child ownership where the child is meaningless without the parent (e.g. `Order → OrderItem`): `DeleteBehavior.Cascade`.
- One-to-many is the default shape for this domain (Category→Products, Order→OrderItems, User→Orders). Don't reach for many-to-many unless the business rule genuinely requires it.

## Indexes

- EF Core auto-indexes FK columns — no extra config needed there.
- Add an explicit **unique index** on any column used as a natural lookup key: `Category.Slug`, `User.Email` (already done for `Category.Slug`, replicate the pattern: `builder.HasIndex(x => x.Slug).IsUnique();`).
- Add an index on columns that will be filtered/sorted on frequently in listing queries once real usage patterns are known (e.g. `Product.CategoryId` is already indexed via the FK; consider `Product.Name` only if free-text search becomes a real feature — don't pre-optimize indexes for queries that don't exist yet).

## Data types

- Money: always `decimal(18,2)`, never `float`/`double` — already the pattern in `ProductConfiguration`. Apply it to every new money column (discounts, order totals, etc).
- Timestamps: always UTC, suffixed `...Utc` (`CreatedAtUtc`). Never store local time or leave the timezone implicit.
- Strings: set `HasMaxLength(...)` explicitly on every configured entity — don't leave `nvarchar(max)` by default for things like names/titles.

## Migrations

- One migration per logical schema change, named descriptively (`AddOrdersAndOrderItems`, not `Update1`).
- Never hand-edit a migration file that has already been applied anywhere (dev DB, shared branch) — if a mistake ships, add a new corrective migration instead of rewriting history.
- Generate migrations from `AtioSport.Infrastructure` with `AtioSport.Api` as the startup project (as already set up): `dotnet ef migrations add <Name> --project src/AtioSport.Infrastructure --startup-project src/AtioSport.Api -o Persistence/Migrations`.
- Review the generated migration's `Up`/`Down` before committing — EF sometimes generates a rename as drop+recreate, which loses data; if that happens, hand-adjust to a real `RenameColumn` call.
- For production, don't rely on `dotnet ef database update` at deploy time by default — generate a SQL script (`dotnet ef migrations script`) so the exact DDL that will run is reviewable, once there's a real production database to protect.
