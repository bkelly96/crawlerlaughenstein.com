# Architecture Decision Records

This directory records decisions that materially affect architecture, APIs, data models,
dependencies, public interfaces, behavior, or repository organization — per `CLAUDE.md`'s
"ask before deciding" rule. ADRs are forward-looking: written once a decision is confirmed,
not backfilled for existing code.

## Adding a new ADR

1. Copy `template.md` to `NNNN-short-title.md`, where `NNNN` is the next zero-padded
   sequence number (e.g. `0001-use-sqlite-for-cache.md`).
2. Fill it in and commit it alongside (or right after) the change it documents.

## Numbering

ADRs are numbered sequentially starting at `0001`. Never reuse or renumber an existing ID,
even if its decision is later superseded — record the supersession as a new ADR that
references the old one.
