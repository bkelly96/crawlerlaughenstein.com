# 0008. Character API shape and access rules

Status: Accepted

## Context

[0007](0007-character-sheet-data-model.md) added the `characters` table (real `id`/`player_id`/
`name`/`level` columns plus a `body` JSONB) but no HTTP API, and no characters exist in the
database. The frontend character sheet edits a hardcoded mock and has a Save button that only
updates local state. To let a logged-in player edit and save their sheet, the backend needs read
and write endpoints, a rule for who can use them, and some character data to edit.

## Decision

- **Endpoints: list + by-id.**
  - `GET /api/characters` — characters visible to the caller (see access rules), as summaries.
  - `GET /api/characters/{id}` — one full character.
  - `PUT /api/characters/{id}` — replace the character's `name`, `level`, and `body`.
  This keeps the "many characters per player" model from 0007. Until a character picker exists,
  the frontend opens the first character in the caller's list.
- **Wire format mirrors storage:** `{ id, name, level, body: { ... } }`. The frontend maps this
  to and from its flat `CharacterSheet` type in its API module, so the backend stays a direct
  reflection of the table and needs no custom JSON flattening.
- **Access: owner read/write, DM read-only.**
  - A `PLAYER` can read and update only characters whose `player_id` is their own user id.
    Another player's character returns `404` (not `403`), so ids are not confirmable.
  - A `DM` can list and read every character, and cannot update any (`403` on `PUT`).
  - Consequence for the list endpoint: a player's list is their own characters; the DM's list is
    all characters.
- **Concurrent saves: optimistic locking with a version field.** `characters.version` (V6)
  is incremented on every save via JPA `@Version`. `GET` responses include `version`; `PUT`
  requires the `version` the client loaded. If it doesn't match the stored version — the
  character was saved elsewhere (another tab or device) since it was loaded — the save is
  rejected with `409 Conflict` and nothing is written. `@Version` also turns a write that races
  in between the check and the save into a `409`. On conflict the frontend keeps the player's
  edits on screen and offers **Load latest** (discard edits) or **Save anyway** (re-save the
  edits on top of the newest version, as an explicit choice).
- **Seed data via migration.** `V5` inserts one starter character for the existing `player1`
  seed user, using the same obviously-fictional sample data the frontend mock uses. There is no
  create-character flow yet.

## Alternatives considered

- **Single `/api/characters/me` resource:** simplest match for the current one-sheet page, but
  contradicts 0007's many-characters-per-player decision and would need replacing once a picker
  exists. Rejected.
- **Flat wire format matching the frontend type:** avoids frontend mapping, but needs
  `@JsonUnwrapped` (or a hand-written DTO duplicating every body field) on the backend. Rejected
  in favor of a thin mapping on the frontend.
- **Auto-create a blank character on first load:** guarantees every player has a sheet, but
  makes a read endpoint write to the database. Rejected.
- **Empty state only (no seed):** nothing to edit until a create flow exists. Rejected for now.
- **Last write wins (no concurrency check):** simplest, but a stale tab silently overwrites newer
  edits. Rejected.
- **Pessimistic locking (lock the character while someone has it open):** holds a lock across
  however long a page stays open; abandoned tabs leave stale locks needing expiry/override.
  Rejected — suited to short transactions, not interactive editing.
- **Version via `ETag` / `If-Match` headers (`412 Precondition Failed`):** the formal HTTP
  mechanism, but needs header plumbing on both ends and CORS `exposedHeaders` for `ETag`. A body
  field is simpler and consistent with the rest of the JSON API. Rejected for now.
- **Reload-only on conflict:** safest, but makes the player redo their edits. Rejected in favor
  of also offering an explicit overwrite.
- **Owner-only access, or DM read/write:** owner-only blocks the DM from seeing the party;
  DM write lets the DM silently overwrite player edits with no conflict handling. Read-only DM
  access chosen as the middle ground.

## Consequences

- Saving is a whole-document replace guarded by the version check, so a stale copy can't
  silently overwrite newer changes. Conflicts are detected per character, not per field: two tabs
  editing different sections still conflict, and the player resolves it by reloading or
  overwriting. Field-level merging is out of scope.
- Every API client that saves characters must send back the `version` it loaded.
- A create-character endpoint and a frontend character picker are still needed before a player
  can have more than the seeded character.
- DM editing, if wanted later, needs its own decision (and probably conflict handling).
