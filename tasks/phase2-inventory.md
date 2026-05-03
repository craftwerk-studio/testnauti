# Phase 2 Inventory — TestNauti → DirectoryKit Mapping

> Concrete reference for the Phase 2 build. Pairs with [`directory-kit-extraction.md`](./directory-kit-extraction.md) §8 ("What to Copy"); this file is the up-to-date version with current line numbers and all Phase 1 file additions captured.
>
> **As of:** 2026-05-03, branch `feat/directory-kit-phase2-prep` (HEAD `607d81f`)

---

## 1. File-by-file map (current TestNauti → kit target)

Counts are post-Phase 1.

| TestNauti source | Kit target | LOC | Refactor cost | Notes |
|---|---|---:|---|---|
| `code/src/app/escuelas/page.tsx` | `app/[listing]/page.tsx` | 48 | low | Server component; renames + `LoadingSkeleton`'s blue/cyan gradient becomes CSS-var. |
| `code/src/app/escuelas/EscuelasContent.tsx` | `components/DirectoryList.tsx` | 346 | **high** | 20+ hardcoded `blue-*`/`cyan-*` tokens; `school.courses` → `entry.tags`; Spanish copy ("Encuentra tu escuela náutica", "PER"); CTA links to TestNauti's `/para-escuelas` page. |
| `code/src/app/escuelas/[schoolId]/page.tsx` | `app/[listing]/[id]/page.tsx` | 631 | **highest** | Largest file. JSON-LD hardcodes `EducationalOrganization` + per-course `Course` offers; titles/desc reference `Escuela Náutica`/`PER`/`TestNauti`; ~30 blue/cyan refs; footer "© 2025 TestNauti". The "Practica para tu PER" cross-promo card (~lines 485–510) is TestNauti-specific upsell — **drop in kit, don't generalize**. |
| `code/src/app/escuelas/[schoolId]/not-found.tsx` | `app/[listing]/[id]/not-found.tsx` | 37 | low | Hardcoded `/escuelas` link + Spanish copy → `siteConfig.paths.listingSlug` + `siteConfig.copy.notFoundCta`. |
| `code/src/app/escuelas/[schoolId]/actualizar/page.tsx` | `app/[listing]/[id]/actualizar/page.tsx` (server shell) | 110 | low–med | Server shell already split out in Phase 1. Generalize breadcrumb copy + the `🏫`/`⚓` emoji icons (config-driven `siteConfig.icons`?). |
| `code/src/app/escuelas/[schoolId]/actualizar/ClaimUpdateForm.tsx` | `components/ClaimUpdateForm.tsx` | 404 | high | **Not in original §8** — created during Phase 1 split. Hardcoded `escuelas@testnauti.co` (config), heavy blue/cyan styling, env-driven webhook + Calendly (good). |
| `code/src/app/api/revalidate-schools/route.ts` | `app/api/revalidate/route.ts` | 53 | low | `revalidatePath('/escuelas')` etc. — parameterize via `siteConfig.paths.listingSlug`. Auth via `REVALIDATE_SECRET` is already generic. |
| `code/src/lib/notion.ts` | `lib/notion.ts` | 16 | trivial | Rename exports: `ESCUELAS_DB_ID → DIRECTORY_DB_ID`, `SOLICITUDES_DB_ID → LEADS_DB_ID` (or drop — see §4 open Q). |
| `code/src/lib/notion/fetchSchools.ts` | `lib/adapters/notion.ts` | 202 | **high** | The single biggest config target. 17 hardcoded Notion field names (`Title`, `City`, `Area`, `Location`, `Phone`, `Email`, `Website`, `Description`, `Featured`, `Services`, `Featured Picture`, `Facebook`, `Instagram`, `LinkedIn`, `Twitter`, `Status`, `ID`) → `siteConfig.notion.fields` map. `cityToProvince` (lines 5–35) is Spain-specific — move to `siteConfig.cityToProvince`. Status default `'Active'` already aligns with the planned union. |
| `code/src/data/nauticalSchools.ts` | `lib/directory.ts` | 86 | low | Cache logic generic. `.schools-cache.json` → `.directory-cache.json`. Rename `getNauticalSchools/Regions/Cities` → `getEntries/getRegions/getCities`. |
| `code/src/components/MarketingNav.tsx` | `components/DirectoryNav.tsx` | 58 | med | **Heavy Clerk coupling** (`SignedIn`/`SignedOut`/`UserButton`); links to `/test`, `/sign-in`, `/sign-up`, `/app/dashboard`. Kit is anonymous-by-default → strip Clerk, keep brand + listing nav only. |
| `code/src/app/sitemap.ts` | `app/sitemap.ts` | 46 | low | Hardcoded `https://testnauti.co` → `process.env.NEXT_PUBLIC_SITE_URL`. Drop `/test`, `/app/dashboard` entries. |
| `code/src/app/robots.ts` | `app/robots.ts` | 15 | low | Same baseUrl swap. Drop `/app/dashboard`, `/app/settings`, `/app/exams/*/test` disallows. |
| `code/src/app/layout.tsx` | `app/layout.tsx` | 102 | med | Major strip: drop docblock + `ClerkProvider` wrapper. metadataBase, title template, description, keywords (`'examen PER'`, `'patrón embarcaciones recreo'`, etc.), OG/Twitter — all replaced by `siteConfig.brand.*`. |
| `code/src/app/globals.css` | `app/globals.css` | 61 | med | Currently lacks `--primary`/`--accent` CSS vars. Kit must add them and rewrite all `bg-blue-600`/`from-blue-* via-cyan-*` Tailwind classes across the 4 directory files into theme-driven tokens. **Estimated ~80 mechanical edits — biggest line-count work item in Phase 2.** |
| `code/src/app/page.tsx` | `app/page.tsx` (skeleton) | 277 | (do not copy) | Hybrid exam+directory landing. Use as **reference**, not copy source. Kit ships a generic `siteConfig.copy.*`-driven skeleton; per-site authors override via `content/`. |
| `code/src/app/HomeSearchBar.tsx` | `components/HomeSearchBar.tsx` (?) | 70 | low | **Not in original §8** — created during Phase 1 (homepage server-component split). Decide in Phase 2 whether the kit's landing skeleton ships with a search bar; if yes, copy this. |
| `code/src/types/directory.ts` | `types/directory.ts` | 23 | low | Created Phase 1. Rename `NauticalSchool → DirectoryEntry`, `courses → tags`, narrow `status?: string` → `'Active' \| 'Inactive' \| 'Pending'`. **Land the narrowing during the adapter rewrite, not as a separate TestNauti PR** (see §4.1). |
| `code/next.config.ts` | `next.config.ts` | 22 | trivial | `images.unsplash.com` + Notion S3 host already added. Copy as-is. |

**§8 omissions to add to the plan:**

1. `actualizar/ClaimUpdateForm.tsx` (Phase 1 split — not listed in §8)
2. `HomeSearchBar.tsx` (Phase 1 created — not listed)
3. `types/directory.ts` was renamed from "directory" to a real file in Phase 1 — §8 references it but the line count / responsibilities are now concrete.

---

## 2. Coupling buckets

### Strip entirely (don't carry into kit)

- All `@clerk/nextjs` imports + `<ClerkProvider>` wrapper (`layout.tsx`, `MarketingNav.tsx`)
- Sitemap/robots entries for `/test`, `/app/dashboard`, `/app/settings`, `/app/exams/*/test`
- The "Practica para tu examen del PER" cross-promo card in `[schoolId]/page.tsx` (lines ~485–510). It's TestNauti-specific upsell. A clinic/dentist/gym directory has no equivalent — leave a clean detail page and let the per-site `content/` add an optional secondary CTA later.
- Doc comment block at the top of `layout.tsx` (TestNauti history)
- The `/para-escuelas` "¿Tienes una escuela náutica?" CTA at the bottom of `EscuelasContent.tsx` (lines ~326–340) — keep the *pattern* (claim/upsell card) but as `siteConfig.copy.claimCta` not hardcoded.

### Rename/generalize via `siteConfig`

- URL paths: every `escuelas` literal → `siteConfig.paths.listingSlug`
- Identifiers in code: `school`/`schools` → `entry`/`entries`, `NauticalSchool` → `DirectoryEntry`, `courses` → `tags`
- Spanish copy literals: `escuela`, `Escuela Náutica`, `escuelas náuticas`, `PER`, `examen PER`, `TestNauti`, `escuelas@testnauti.co` → `siteConfig.copy.*` / `siteConfig.brand.*` / `siteConfig.contactEmail`
- Notion field names (17 of them) in `fetchSchools.ts` → `siteConfig.notion.fields`
- `cityToProvince` table → `siteConfig.cityToProvince` (per-locale)
- Hardcoded `https://testnauti.co` (sitemap, robots, layout, `[schoolId]/page.tsx`) → `process.env.NEXT_PUBLIC_SITE_URL`
- JSON-LD: `'@type': 'EducationalOrganization'` + per-course `Course` offers (`[schoolId]/page.tsx` lines ~94–117) → `siteConfig.jsonLd.type` + optional `siteConfig.jsonLd.offerBuilder(entry)` callback. For clinics: `MedicalClinic`, no offers.

### Theme via CSS variables

The largest mechanical work item. Hardcoded color tokens in directory files:

| File | Approx blue/cyan refs |
|---|---:|
| `escuelas/[schoolId]/page.tsx` | ~30 |
| `escuelas/EscuelasContent.tsx` | ~20 |
| `escuelas/[schoolId]/actualizar/ClaimUpdateForm.tsx` | ~25 |
| `escuelas/[schoolId]/actualizar/page.tsx` | ~5 |
| `escuelas/page.tsx` (skeleton) | ~3 |
| **Total** | **~80** |

Kit plan: add `--primary`/`--accent`/`--ring`/`--primary-50`/`--primary-700` etc. to `globals.css`, then sed-style replace `bg-blue-600` → `bg-[--primary]`, `from-blue-600 to-cyan-500` → `from-[--primary] to-[--accent]`. Doable in a single PR per file; verify visually each time.

---

## 3. Env var inventory

| TestNauti env var | Kit equivalent | Required | Notes |
|---|---|---|---|
| `NOTION_TOKEN` | `NOTION_TOKEN` | ✓ | unchanged |
| `NOTION_ESCUELAS_DB_ID` | `NOTION_DB_ID` | ✓ | rename — directory entries DB |
| `NOTION_SOLICITUDES_DB_ID` | `NOTION_LEADS_DB_ID` | optional | only if site stores leads in a Notion DB; sites that pipe leads only via n8n can omit |
| `REVALIDATE_SECRET` | `REVALIDATE_SECRET` | ✓ | unchanged |
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | `NEXT_PUBLIC_LEAD_WEBHOOK_URL` | ✓ | rename — n8n is impl detail |
| `NEXT_PUBLIC_CALENDLY_URL` | `NEXT_PUBLIC_CALENDLY_URL` | optional | per plan §7, drop from entry detail; keep on claim form only |
| *(none today)* | `NEXT_PUBLIC_SITE_URL` | ✓ | **new** — replaces hardcoded `https://testnauti.co` in sitemap, robots, layout, JSON-LD |

`.env.example` for the kit derives directly from this table.

---

## 4. Recommendations / decisions for Phase 2

### 4.1 Land `status` union narrowing inside the kit, not in TestNauti

The deferred follow-up from PR #3 (`tasks/follow-ups.md`) wants `NauticalSchool.status` narrowed from `string` to `'Active' | 'Inactive' | 'Pending'`. The original deferral reason — that narrowing forces the Notion mapper to validate/coerce, widening the change beyond Phase 1's scope — still applies.

**Decision**: don't open a separate TestNauti PR for it. Land it in the kit during the `lib/adapters/notion.ts` rewrite. The kit's adapter is a fresh write anyway, so coercion logic adds zero churn there. The follow-up note in `tasks/follow-ups.md` already says "do this when extracting the kit" — confirming the call.

### 4.2 Don't copy `src/app/page.tsx` as-is

It's a hybrid exam-platform/directory landing. The kit ships a fresh skeleton driven by `siteConfig.copy.*` and per-site `content/page.mdx` (or similar). Treat the current homepage as a *visual reference* for hero/search/featured patterns, not a copy target.

### 4.3 Surface the lead-form destination as a config choice

Currently `ClaimUpdateForm.tsx` POSTs to `NEXT_PUBLIC_N8N_WEBHOOK_URL`. For sites that don't want n8n, the kit could ship a built-in `app/api/leads/route.ts` that writes directly to a Notion `LEADS_DB_ID`. Surface as:

```ts
// siteConfig.leads
{ destination: 'webhook', url: process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL }
// or
{ destination: 'notion', dbId: process.env.NOTION_LEADS_DB_ID }
```

Single switch, two impls. Defer the built-in route to Phase 4 if Phase 3 (clinics) doesn't need it.

### 4.4 Update plan §8 to add Phase 1 files

`directory-kit-extraction.md` §8 was written before Phase 1; three files now need explicit mention: `ClaimUpdateForm.tsx`, `HomeSearchBar.tsx`, `types/directory.ts`. (See §1 of this doc — already enumerated.) Suggest editing §8 directly, or just leave this inventory as the up-to-date reference and link from §8.

---

## 5. Phase 2 ordering suggestion

Once Phase 2 starts in the new `directory-kit` repo, the cheapest path through:

1. **Bootstrap repo** — Next 16 init, copy `tsconfig.json`, ESLint, Tailwind, `next.config.ts`, trimmed `package.json` (drop Clerk/Prisma/exam deps).
2. **Types + config skeleton** — `types/directory.ts` (DirectoryEntry, narrowed status), `config/site.ts` typed shape, `config/site.example.ts`.
3. **Adapter** — port `fetchSchools.ts` → `lib/adapters/notion.ts` with `siteConfig.notion.fields` driving the field map. Status validation lives here.
4. **Data layer** — port `nauticalSchools.ts` → `lib/directory.ts` (`getEntries/getRegions/getCities`).
5. **Theme foundation** — add CSS variables to `globals.css` *before* copying the heavy UI files, so the rip-and-replace happens once per file.
6. **List + Detail + Claim** — copy & rewrite `EscuelasContent.tsx`, `[schoolId]/page.tsx`, `actualizar/*` with renames, copy literals → `siteConfig.copy.*`, color tokens → CSS vars.
7. **Nav + Layout** — `MarketingNav.tsx` → `DirectoryNav.tsx` (Clerk-stripped), `layout.tsx` minus ClerkProvider + brand-aware metadata.
8. **SEO surfaces** — `sitemap.ts`, `robots.ts`, JSON-LD with `siteConfig.jsonLd.*`.
9. **Revalidate route** — generic `app/api/revalidate/route.ts`.
10. **Landing skeleton** — fresh `app/page.tsx` with `siteConfig.copy.*`, optional `HomeSearchBar`.
11. **README + `.env.example` + smoke test** — empty Notion DB → kit boots + shows empty state.

Step 5 (theme foundation) is the only ordering constraint that matters; everything else is largely independent.
