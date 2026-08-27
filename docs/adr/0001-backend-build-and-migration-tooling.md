# 0001. Backend build and migration tooling

Status: Accepted

## Context

The backend needed a build tool and a database migration tool. There was no existing
codebase convention to follow (this is the first slice of a new app), so these needed an
explicit choice.

## Decision

- Build tool: **Maven**.
- Database migrations: **Flyway**, SQL-first migrations under
  `backend/src/main/resources/db/migration/`, run automatically on application startup.

## Alternatives considered

- **Gradle** instead of Maven: offers more flexible, script-based build configuration, but
  that flexibility isn't needed for a single-module Spring Boot app. Maven's declarative
  `pom.xml` is simpler to read and is Spring Initializr's default.
- **Liquibase** instead of Flyway: Liquibase's main advantage is database-agnostic
  changelogs (XML/YAML/JSON), which buys nothing here since the database is fixed to
  PostgreSQL. Flyway's plain-SQL migrations are simpler to read and write.
- **No migration tool** (rely on Hibernate `ddl-auto: update`): rejected — the schema will
  evolve (e.g. a future FK to a campaigns table), and letting Hibernate auto-generate DDL
  in anything beyond local scratch use risks silent, unreviewed schema drift.

## Consequences

- `backend/pom.xml` depends on `flyway-core` and `flyway-database-postgresql` (the Postgres
  driver was split out starting with Flyway 10).
- Every schema change is a new versioned SQL file (`V{n}__description.sql`); migrations are
  never edited after being merged.
- `spring.jpa.hibernate.ddl-auto` is set to `validate`, so Hibernate's entity mappings must
  stay in sync with the Flyway-managed schema, catching drift at startup instead of at
  runtime.
