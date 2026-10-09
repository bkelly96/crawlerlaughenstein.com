# 0006. Character sheet data model

Status: Accepted

## Context

The frontend already has a full `CharacterSheet` type (`frontend/src/types/character.ts`) rendered
by `CharacterSheetPage.tsx`, backed only by a hardcoded mock object in React state — nothing is
persisted, and there's no link between a character and the player who owns it. The backend had a
`users` table (from [0003](0003-user-data-model-and-provisioning.md)) but no character or campaign
persistence. This ADR covers how to store character sheets and how they relate to players.

## Decision

- **Storage shape: hybrid columns + JSONB.** The `characters` table has real columns for fields
  worth querying/sorting/joining on (`id`, `player_id`, `name`, `level`, `created_at`,
  `updated_at`), and a single `body JSONB` column holding the rest of the sheet (abilities, attacks,
  skills, inventory, gear, notes, etc.) as one nested object. This matches how the frontend already
  treats the data — `CharacterSheetPage.tsx` patches and holds the whole sheet as one object — so
  persisting it as one JSON document needs no new table or migration per section as the sheet
  evolves.
- **Player↔character relationship: many characters per player.** `characters.player_id` is a plain
  (non-unique) foreign key to `users.id`. A player is not limited to a single character.
- **No campaign/party table yet.** This is one shared game with one DM and a fixed set of players,
  not multiple concurrent campaigns needing separate visibility. There's nothing to scope characters
  to yet, so no `campaigns` table is introduced. [0003](0003-user-data-model-and-provisioning.md)
  already anticipated a "future campaign membership" concept via its UUID key choice; this remains
  deferred until multiple concurrent campaigns are an actual requirement, not a hypothetical one.

## Alternatives considered

- **Fully normalized relational tables** (separate `attacks`, `skills`, `inventory_items`,
  `gear_slots`, etc. tables, each FK'd to `characters`): would allow real SQL queries against
  individual items (e.g. "who's carrying item X"), but the frontend has no use for that today, and
  it would mean ~8-10 new tables/entities/migrations for data that behaves as simple arrays with no
  independent identity of their own. Rejected as more complexity than the current need justifies.
- **Single JSONB blob with minimal columns** (just `id` and `player_id`, everything else including
  `name`/`level` inside JSON): simplest possible migration, but loses the ability to filter or sort
  by character name or level without JSON path expressions. Rejected in favor of pulling out the
  columns that are actually likely to be queried.
- **One character per player** (unique FK): matches the current single-page frontend UI (no
  character switcher), but doesn't match what was actually wanted — a player isn't meant to be
  limited to one character. Rejected.
- **Adding a campaigns/party table now:** would pre-build for multi-campaign support before it's
  needed. Rejected for the same reason as [0003](0003-user-data-model-and-provisioning.md)'s
  deferral — revisit as its own future slice and ADR if multiple concurrent campaigns become real.

## Consequences

- Reading or writing a character sheet is a single row read/write — no joins across a dozen tables
  — which matches the frontend's whole-object save pattern and keeps the JPA layer simple (one
  entity, one repository).
- Querying or reporting on individual nested items (e.g. "list every character with X in their
  inventory") isn't possible via plain SQL columns; it would require JSONB path queries or a future
  migration to normalize that specific section if the need arises.
- Listing "a player's characters" is a straightforward indexed query (`findByPlayerId`), with no
  campaign-scoping concept to route through.
- If multiple concurrent campaigns become a real requirement later, a `campaigns` table (and
  probably a `campaign_id` on `characters`) would be introduced as its own slice/ADR at that time,
  per [0003](0003-user-data-model-and-provisioning.md)'s original intent.
