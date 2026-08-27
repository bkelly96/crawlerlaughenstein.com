# 0003. User data model and provisioning

Status: Accepted

## Context

The `User` entity's primary key strategy is hard to change once other tables (e.g. future
campaign membership) hold foreign keys to it. Separately, the app needed a decision on how
DM/Player accounts come into existence.

## Decision

- **Primary key: `UUID`** (Hibernate-generated via `GenerationType.UUID`, no Postgres
  extension required), not an auto-incrementing `Long`/`BIGSERIAL`.
- **No self-service registration.** There is no `/api/auth/register` endpoint and no sign-up
  page. DM and Player accounts are created manually: an initial DM + Player are seeded via a
  Flyway migration (`V2__seed_initial_users.sql`), and additional accounts are added by hand
  (generate a password hash with the `PasswordHashCli` tool, then write a SQL insert or a new
  migration).

## Alternatives considered

- **`Long`/`BIGSERIAL` primary key**: smaller and marginally faster for joins/indexes, and
  sequential-ID enumeration isn't a concern for an internal tool. Rejected in favor of UUID
  specifically to avoid ever having to migrate the key type later if this becomes
  multi-tenant, public-facing, or needs to merge user data from another source — that
  migration is expensive once foreign keys exist, so the safer default was chosen up front.
- **Self-service registration with a role picker**: simplest to build, but the user
  explicitly did not want people signing up on their own yet — the trust model for a
  small/private game group is "only accounts someone deliberately created exist."
- **First registrant becomes DM automatically, rest default to Player**: still allows
  uncontrolled self-service account creation, just constrains the role; doesn't match what
  was asked for (manual creation).

## Consequences

- Adding a new account is a manual, slightly clunky process (run the CLI tool, hand-write
  SQL) rather than a UI flow. Acceptable for the current small/private scope; if the group
  grows or a DM needs to onboard players routinely, revisit this — e.g. a DM-only "create
  player" endpoint — as its own future slice and ADR.
- `role` is stored as `VARCHAR` via `@Enumerated(EnumType.STRING)`, never `ORDINAL`, so
  column values stay human-readable in manual SQL and reordering the `Role` enum in code can
  never silently corrupt stored data.
