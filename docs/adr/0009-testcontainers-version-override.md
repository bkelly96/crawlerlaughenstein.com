# 0009. Override the Testcontainers version for Docker Engine 29

Status: Accepted

## Context

The backend integration tests use Testcontainers to start a throwaway Postgres. Spring Boot
3.3.5 (the project's parent) manages Testcontainers at 1.19.8. Docker Engine 29 raised the
minimum Docker API version it accepts to 1.44, while Testcontainers 1.19.8's bundled
docker-java client defaults to an older API version. Against Docker Desktop with engine 29,
every test class failed with "Could not find a valid Docker environment" (the daemon answered
Testcontainers' requests with an empty `400`), so `mvn test` could not run at all.

## Decision

Override the managed version with `<testcontainers.version>1.21.4</testcontainers.version>` in
`backend/pom.xml`. 1.21.4 is the last 1.x release, within the same major version Spring Boot 3.3
targets, and is test-scope only. Verified on the affected machine: all 11 backend tests pass
against Docker Engine 29 with no extra flags.

## Alternatives considered

- **Testcontainers 2.x** (2.0.2+ is the release line documented as fixing Docker 29): renames
  artifacts and moves packages (e.g. `PostgreSQLContainer`), and Spring Boot 3.3's
  `@ServiceConnection` support is built against the 1.x classes. Too large a change for this fix.
  Rejected for now.
- **Pin the API version instead** (`src/test/resources/docker-java.properties` with
  `api.version=1.44`, or `-Dapi.version=1.44`): no dependency change, and the flag form was
  verified to work, but it hard-codes an API version, which breaks anyone on Docker older than 25
  and hides the outdated client. Rejected.
- **Upgrade Spring Boot** to a version that manages a newer Testcontainers: the more complete
  fix, but a much larger change with its own risk. Deferred to a separate decision.
- **Downgrade Docker Engine** below 29: pushes the problem onto every developer machine.
  Rejected.

## Consequences

- `mvn test` works on Docker Engine 29 without workarounds.
- The override must be revisited (and likely removed) when Spring Boot is upgraded, so the
  project goes back to Spring Boot's managed Testcontainers version.
- 1.x is the end of the line; a future need for newer Testcontainers features means moving to
  2.x, most naturally together with a Spring Boot upgrade.
