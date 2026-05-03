# Session Handoff — Directory Kit Extraction

> **Audience:** a fresh Claude instance picking up this work after the previous session was cleared. Read this first, then `tasks/directory-kit-extraction.md` for the full plan.

**Last updated:** 2026-05-03 (inventory pass added)

---

## Where you are

- **Repo:** TestNauti monorepo at `/Volumes/Chus Hard Drive/Chus/⛵️ TestNauti.co/`
- **Worktree you're in:** `.worktrees/directory-kit-strategy/` (sibling to main checkout — see [`README.md`](../README.md))
- **Branch:** `feat/directory-kit-phase2-prep`
- **Cut from:** `feat/directory-kit-extraction` at commit `e9c9a54` (Phase 1 cleanup, currently in [PR #3](https://github.com/craftwerk-studio/testnauti/pull/3))

## The plan in one paragraph

Extract the `/escuelas` directory surface from TestNauti into a reusable `DirectoryKit` template repo so we can spin up new vertical directories (starting with health clinics) in ~1 day each. Strategy B (template repo + fork per vertical). Four phases — full detail in [`directory-kit-extraction.md`](./directory-kit-extraction.md).

## What's done

- **Phase 1 (TestNauti pre-extraction cleanup) — code complete, PR #3 awaiting merge:**
  - `NauticalSchool` interface moved from `types/exam.ts` → `types/directory.ts`
  - All four `nauticalSchools.backup` callers switched to live Notion (`getNauticalSchools()`); backup file deleted
  - Homepage flipped from client-component to server-component; client search bar in `HomeSearchBar.tsx`
  - `actualizar/page.tsx` refactored: server shell (params, metadata, fetch, `notFound()`) + `ClaimUpdateForm.tsx` client child
  - Notion S3 host added to `next.config.ts` `images.remotePatterns`
  - CodeRabbit installed + `.coderabbit.yaml` tuned for the project
  - 3 of 6 CodeRabbit findings applied; 2 deferred to `tasks/follow-ups.md`; 1 rejected on PR

## What's open

- **[PR #3](https://github.com/craftwerk-studio/testnauti/pull/3)** — `feat/directory-kit-extraction`, all checks green, MERGEABLE. Awaits human approval + merge to `main`.
- **`tasks/follow-ups.md`** — two items deferred from PR #3:
  1. Stale "🔥 Última Convocatoria / Julio 2024" homepage copy (it's May 2026)
  2. Narrow `NauticalSchool.status` to a string-literal union (drags Notion-mapper validation; will land naturally in Phase 2 when the kit interface is finalized)

## What's next (Phase 2)

Per the plan: **build the `DirectoryKit` template as a separate GitHub repo** — not a sibling folder in this monorepo. ~3 days of work. Key moves:
- New repo (likely `craftwerk-studio/directory-kit`)
- Copy directory-relevant files from TestNauti (see "What to Copy" section in `directory-kit-extraction.md` §8)
- Strip Clerk, Prisma, exam code, Vitest, etc.
- Rename to generic abstractions (`NauticalSchool` → `DirectoryEntry`, `courses` → `tags`, `escuelas` → `[listing]` dynamic segment, etc.)
- Introduce `config/site.ts` per-site config surface
- Bring CSS variables for theming

This branch (`feat/directory-kit-phase2-prep`) exists for any **TestNauti-side** prep that smooths Phase 2 — not the kit itself.

**Done on this branch so far:**
- **File-by-file inventory + coupling audit** → [`tasks/phase2-inventory.md`](./phase2-inventory.md). Up-to-date map of every directory-side file in TestNauti to its kit target, with current line counts (post-Phase 1), refactor-cost estimates, three §8 omissions captured (`ClaimUpdateForm.tsx`, `HomeSearchBar.tsx`, `types/directory.ts`), env-var rename table, and a Phase 2 ordering suggestion. **This is the reference doc for whoever starts Phase 2 in the new repo.**

**Possible further prep before Phase 2 ships:**
- (Decided **not** to do here) Land the deferred `status` union narrowing in TestNauti — see `phase2-inventory.md` §4.1 for rationale; doing it inside the kit's fresh adapter is cleaner than as a TestNauti PR.
- Update `directory-kit-extraction.md` §8 to add the three Phase 1-created files. Optional — `phase2-inventory.md` already supersedes it as the up-to-date reference.
- Anything else that surfaces while reviewing the inventory.

If Phase 2 starts in earnest, the branch belongs in the new `directory-kit` repo, not here.

## Conventions you must follow

These are loaded from your project memory at session start (`MEMORY.md`), but worth surfacing:

1. **Default action on review feedback is execute, not propose.** When the user shares a CodeRabbit/Codex/scanner finding or pastes a PR URL, triage AND act in the same turn — apply the apply-worthy, defer the out-of-scope to `tasks/follow-ups.md`, reject the unhelpful with a brief PR reply. Don't return a triage table and ask "want me to proceed?". Analysis-only mode is opt-in via explicit phrasing ("what do you think", "should we"). See [`feedback_review_default_execute.md`](../../../../../Users/chusasensio/.claude/projects/-Volumes-Chus-Hard-Drive-Chus----TestNauti-co/memory/feedback_review_default_execute.md).
2. **Never edit `main`.** Always work on a branch. Substantial work goes in a worktree (this one is `.worktrees/directory-kit-strategy/`).
3. **Critical evaluation of all review feedback** — the per-finding eval table is in `~/.claude/CLAUDE.md`. 100% apply rate means you weren't being critical; re-evaluate.
4. **Spanish UI strings** — `code/src/**/*.tsx` UI copy is es-ES; code/identifiers/comments are English. The `.coderabbit.yaml` tells the reviewer this; do the same when reviewing yourself.
5. **The Next.js project lives in `code/`.** Run `npm run dev`/`build`/`lint` from there. The `.env` and `.env.local` are gitignored — copy from the main checkout if missing in this worktree (`/Volumes/Chus Hard Drive/Chus/⛵️ TestNauti.co/code/.env*`).

## Quick orientation commands

```bash
# From the worktree root (.worktrees/directory-kit-strategy/):
git log --oneline -10                        # recent work
git status                                    # clean tree expected
gh pr view 3 --json state,reviewDecision     # PR #3 state
cat tasks/directory-kit-extraction.md        # the plan
cat tasks/follow-ups.md                      # deferred items
```

## If something's gone stale

The user values not being asked basics. Verify state before acting:
- PR #3 may have merged → branch + remote may have moved
- `.env` files in main checkout may have rotated — copy them fresh into the worktree if you boot the dev server
- CodeRabbit may have left a new review on the most recent commit

Update this file as Phase 2 begins so the next handoff is current.
