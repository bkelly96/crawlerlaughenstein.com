# 0006. Seed credential exposure and rotation policy

Status: Accepted

## Context

`V2__seed_initial_users.sql` (see [0003](0003-user-data-model-and-provisioning.md)) committed
the plaintext seed passwords for the `dm1` and `player1` dev/test accounts directly into its SQL
comment, and `README.md` repeated them as local-login instructions. This repository is public on
GitHub, so both passwords were visible to anyone from the moment those commits were pushed, not
just to local developers as intended.

No real/deployed instance of this app has ever run this migration outside local Docker dev, so
the exposure's practical impact was limited, but the values were still live, working credentials
sitting in a public repo indefinitely.

## Decision

- **Rotate the exposed credentials.** `V3__rotate_seed_user_passwords.sql` updates the
  `password_hash` for `dm1` and `player1` to new values, invalidating the old passwords. The new
  plaintext passwords are not committed anywhere in this repo — they were shared with the repo
  owner directly, out of band.
- **Scrub the old plaintext and hashes from git history.** Beyond rotating them, the exposed
  values are removed from every commit via history rewrite (not just the current file tips),
  since a public repo's history is as visible as its current state.
- **New policy: never commit a plaintext seed password again.** Going forward, generating or
  rotating a seed/dev account's password follows this shape: run `PasswordHashCli` locally,
  commit only the resulting bcrypt hash in a migration, and share the plaintext with whoever
  needs it directly (chat, password manager, etc.) — never in a tracked file.

## Alternatives considered

- **Just remove the plaintext from the current files, leave history alone**: doesn't address the
  actual exposure — the values were already public, and leaving them in history means anyone who
  already has (or later finds, e.g. via a cache or search index) an old clone still has working
  credentials. Rejected in favor of also rotating them, which is the only change that actually
  invalidates what was exposed.
- **Leave the old commits as-is and rely on rotation alone**: rotation alone does stop the old
  password from working, but the old values remain readable in history, which is bad hygiene for
  a public repo and normalizes leaving secrets in history "because they're rotated now anyway."
  Rejected in favor of also scrubbing history, accepting the disruption that requires.

## Consequences

- History rewrite requires force-pushing every affected branch (`main`, `preprod`,
  `feature/auth-rbac-scaffolding`) and invalidates any existing local clone — anyone with one
  needs to re-clone rather than pull. It also changes the commit SHAs underlying PR #6, which was
  open at the time of this rewrite and needs to be reconciled separately afterward.
- This does not guarantee the values are unreachable everywhere (e.g. GitHub's own caches, search
  indexing, or anyone who already scraped/cloned the repo before this fix could still have a
  copy) — rotation is what actually neutralizes the exposure; the history scrub is hygiene on top
  of that, not a substitute for it.
- Future seed/dev account creation must follow the hash-only-in-git pattern described above;
  `backend/README`'s "Adding a user" section and any future onboarding docs should point to this
  ADR rather than showing example plaintext values.
