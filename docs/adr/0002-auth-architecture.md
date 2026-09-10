# 0002. Auth architecture

Status: Accepted

## Context

The app needs authentication and role-based access control for two roles, DM and Player.
The user is planning to eventually split this backend into microservices, which bears
directly on whether auth state should be server-held (sessions) or self-contained (tokens).

## Decision

- **JWT**, self-issued by this backend, signed with HS256, sent as a bearer token
  (`Authorization: Bearer <token>`) — not a cookie.
- Tokens expire after ~1 hour. There is no refresh-token flow in this slice; a user simply
  logs in again after expiry.
- CSRF protection is disabled. It only matters when the browser auto-attaches credentials
  (cookies) to cross-site requests; a bearer token in an `Authorization` header is never
  auto-attached by the browser, so CSRF isn't a risk for this design.
- The frontend stores the token in `sessionStorage` (see Consequences).

## Alternatives considered

- **Session cookies** (`HttpSession` + `JSESSIONID`): simpler for a single backend instance,
  but doesn't fit the stated direction toward microservices — each service would need to
  either share a centralized session store or validate against the auth service on every
  request. A self-contained JWT lets any service verify a request independently.
- **JWT in an httpOnly cookie** instead of a bearer header: reduces JS-readable XSS exposure,
  but reintroduces CSRF as a concern (cookies auto-attach) and complicates a future
  multi-service/API-gateway setup where the browser may talk to more than one origin. Bearer
  header was chosen for simplicity at this stage.
- **Token storage: `localStorage`** (persists across tab/browser restarts) vs
  **in-memory only** (safest against XSS persistence, but logs the user out on every page
  refresh): `sessionStorage` was chosen as a middle ground — survives a refresh, clears on
  tab/browser close. This is the one call in this ADR worth revisiting if either the UX gap
  (in-memory) or the persistence (localStorage) becomes a real complaint.

## Consequences

- `JwtAuthenticationFilter` (a custom `OncePerRequestFilter`) is the only thing populating
  `SecurityContextHolder` — there's no session state on the server at all
  (`SessionCreationPolicy.STATELESS`).
- The signing secret (`JWT_SECRET`) is a single shared HMAC secret for now. If/when this
  splits into microservices that need to verify tokens independently, revisit whether HS256
  (shared secret, every verifying service must hold it) is still appropriate or whether to
  move to RS256/asymmetric signing (issuing service holds the private key, verifying
  services only need the public key).
- No self-service password reset/refresh exists yet — acceptable for the current manual
  account provisioning model (see 0003).
