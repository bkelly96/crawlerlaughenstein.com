-- Optimistic-locking version for character saves (docs/adr/0008): incremented on every update;
-- a save carrying a stale version is rejected with 409 instead of overwriting newer changes.
ALTER TABLE characters ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
