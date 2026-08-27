# 0005. Repo layout and local dev environment

Status: Accepted

## Context

This is a new full-stack app in a repo that previously held no application code. It needed
a layout for the backend and frontend, and a way to run PostgreSQL locally.

## Decision

- `/backend` (Spring Boot/Maven) and `/frontend` (React/Vite) as root-level sibling
  directories — no monorepo tooling (Nx, Turborepo, npm workspaces).
- `docker-compose.yml` at the repo root running a single `postgres:16-alpine` service for
  local development, configured via a gitignored `.env` (see `.env.example`).

## Alternatives considered

- **Monorepo tooling**: two independent apps (a Maven project and an npm project, different
  ecosystems entirely) don't share build steps or benefit from task orchestration at this
  scale. Adding Nx/Turborepo now would be complexity with no payoff.
- **Requiring a locally installed PostgreSQL** instead of Docker: rejected for
  reproducibility — docker-compose gives every developer the same Postgres version with a
  one-command reset (`docker compose down -v`), instead of depending on whatever's already
  installed on their machine.

## Consequences

- Running the app locally requires Docker (specifically Docker Desktop on Windows/Mac) to be
  installed and running, in addition to a JDK and Node — a new dependency for anyone working
  on this repo, worth knowing about even though it's not itself controversial.
- `backend/target/`, `frontend/node_modules/`, `frontend/dist/`, and `.env` are gitignored.
- Spring Boot does not read `.env` files itself; the root README documents exporting the
  variables from `.env` into the shell environment before running the backend.
