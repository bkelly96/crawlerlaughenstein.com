---
name: create-pr
description: Commit the current branch's reviewed changes, push, and open a GitHub PR following this repo's CLAUDE.md conventions (commit style, base-branch rules, PR description template). Use only when the user explicitly asks to commit/push/open a PR — never trigger this automatically.
disable-model-invocation: true
allowed-tools: Bash(git status) Bash(git status *) Bash(git diff *) Bash(git log *) Bash(git branch *) Bash(git rev-parse *) Bash(git merge-base *) Bash(git fetch *) Bash(gh pr list *) Bash(gh pr view *)
---

Follow this repo's `CLAUDE.md` git/PR rules throughout — this skill exists to apply them
consistently, not to replace them. In particular: never commit/push unless the user's
invocation of this skill *is* that explicit request; never `--force` push; never skip hooks;
`main` is the live/production branch — the integration branch for day-to-day PRs is
`preprod`. Never target `main` from this skill; promoting `preprod` → `main` is a separate,
explicit release step (see `CLAUDE.md`), not something this skill does implicitly.

## 1. Confirm there's something to do

Run `git status` and `git diff --stat`. If there are no staged or unstaged changes and
nothing to commit, say so and stop — don't invent a PR for an empty diff.

If the working tree mixes multiple unrelated logical changes, ask the user whether to
split them into separate commits/PRs rather than bundling silently.

## 2. Determine the correct base branch — do not assume without checking

A branch here is often stacked on another in-progress feature branch, not directly on
`preprod`. Guessing wrong drags an unrelated, already-open PR's diff into this one.

1. `git fetch origin`
2. `git rev-parse --abbrev-ref HEAD` for the current branch name.
3. `git log preprod..HEAD --oneline` — if empty, the branch is current with `preprod`;
   base is `preprod`.
4. If not empty, those commits came from somewhere. Identify the parent branch (e.g. the
   branch this one was created from) and check `gh pr list --head <parent-branch> --state all`.
   - If that parent branch has an **open** PR, base this PR on the parent branch instead
     of `preprod` — it will naturally retarget once the parent merges. Tell the user this
     explicitly (which parent PR, and that this one is stacked on it).
   - If the parent already merged into `preprod`, or has no open PR, base on `preprod`.
5. If it's genuinely ambiguous which branch is the right base, ask the user — don't guess.
   Regardless, never target `main` here — see the release-promotion note above.

## 3. Commit

- Stage only the files relevant to this change by name (never `git add -A`/`.`).
- Write the message in this repo's existing style: `type(scope): imperative summary`
  subject, optional body explaining *why*, via a heredoc (never `-m` string concatenation
  for multi-line messages). Check `git log --oneline -10` first to match current
  conventions (scope naming, verb choice).
- End the message with:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  ```

## 4. Push

`git push -u origin <branch>` (or plain `git push` if already tracking). Never force-push
without the user explicitly asking for it in this message.

## 5. Write the PR description

Use exactly these sections (this repo's template — see `CLAUDE.md`), grounded in real
`git diff <base>...HEAD` / `git log` output, not generic summary prose:

- `## Summary` — the feature/slice, framed against the broader roadmap if one exists.
- `## Design decisions (ADRs)` — one bullet per relevant `docs/adr/NNNN-*.md`, filename +
  one-line paraphrase (not the full ADR text).
- `## What it does` — contract-level detail: exact endpoints/flags/file behavior, order of
  checks, full error contract. Should work as a spec, not a diff restatement.
- `## Testing` — real numbers and real commands run; state plainly if tests were
  written test-first or alongside implementation.
- `## Definition of done` — what ships here vs. explicitly deferred, and to where.
- `## Verification performed locally` — actual commands and actual results, including any
  bugs found and fixed during manual verification.
- `## Commits (atomic, each builds + tests pass in isolation)` — numbered list, hash +
  one-line description each.

Imperative, no "we"/"I", no marketing language, no fixed word cap.

## 6. Open the PR

```
gh pr create --base <base> --head <branch> --title "..." --body "$(cat <<'EOF'
...
EOF
)"
```

Report the returned PR URL back to the user, and call out anything unverified (e.g. "only
tested the failure path locally — worth confirming the success path before merging").
