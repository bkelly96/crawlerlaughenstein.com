# 0004. Frontend tooling

Status: Accepted

## Context

The frontend needed a build tool and a language choice. There was no existing codebase
convention to follow.

## Decision

**Vite + TypeScript** (via `npm create vite@latest -- --template react-ts`).

## Alternatives considered

- **Create React App**: CRA is unmaintained; Vite is the current standard for new React
  projects and has a materially faster dev server.
- **Plain JavaScript** instead of TypeScript: TypeScript was chosen because role-string and
  DTO-shape mismatches (e.g. `"DM"` vs `"Dm"`, a backend response field renamed without the
  frontend catching up) matter directly for RBAC gating — the compiler catching that class of
  bug is worth the extra syntax.

## Consequences

- `frontend/tsconfig.app.json` already includes `"types": ["vite/client"]` from the
  scaffold, so `import.meta.env` is typed without needing a hand-written `vite-env.d.ts`.
- Linting uses the scaffold's default `oxlint` setup (`npm run lint`), not ESLint.
