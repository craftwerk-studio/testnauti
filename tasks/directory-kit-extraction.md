# Directory Kit Extraction — Strategy & Execution Checklist

> **Living document.** Update as we work. Tick boxes as tasks complete.
> Started: 2026-05-01 · Branch: `feat/directory-kit-extraction`

---

## TL;DR

Extract the **directory side** of TestNauti (`/escuelas`) into a reusable starter template (`DirectoryKit`) so we can spin up new vertical directories — starting with **health clinics** — in ~1 day each.

The directory is effectively a standalone product hiding inside TestNauti. Stripped of Clerk, Prisma, and the exam engine, it becomes a tight Notion-backed directory app with strong SEO and a lead-capture form. Each new vertical = thin config + Notion DB + brand assets.

---

## 1. Goals & Non-Goals

### Goals
- Extract a clean, reusable directory template from TestNauti's `/escuelas` surface.
- Spin up `health-clinics` directory as the first reuse (validates the template).
- Define a per-site config surface so future verticals (dentists, gyms, vets…) take ~1 day.
- Fix tech debt during extraction so it doesn't propagate.

### Non-Goals
- Migrating TestNauti itself onto the kit (TestNauti keeps its current `/escuelas` route until proven).
- Building a multi-tenant SaaS (each vertical = its own deploy).
- Replacing Notion as the CMS in v1 (planned migration path for >1k entries).

---

## 2. Strategic Decision

**Chosen strategy: B — Extract template repo, fork per vertical.**

| Option | Upfront | Per new site | When right |
|---|---|---|---|
| A. Fork-and-rename | ~2 days | ~2 days | If only ever 1 new site |
| **B. DirectoryKit template + fork** | **~3–5 days** | **~1 day** | **2–4 sites planned** |
| C. Published npm package + thin app shell | ~1.5 weeks | ~half day | 4+ sites with synced upgrades |

Rationale: We're committing to clinics now and have realistic appetite for 2–3 more verticals over time. B hits the right cost/benefit. We can promote to C later if the pattern proves out.

---

## 3. Target Architecture

```
DirectoryKit (template repo)
├── Next 16 + Tailwind 4         (no Clerk, no Prisma, no exam code)
├── lib/
│   ├── notion.ts                 Notion client (env-driven)
│   ├── adapters/notion.ts        Maps Notion page → DirectoryEntry
│   └── directory.ts              getEntries / getRegions / getCities (file cache)
├── components/
│   ├── DirectoryNav.tsx          Was MarketingNav
│   ├── DirectoryList.tsx         Was EscuelasContent
│   ├── DirectoryDetail.tsx       Extracted from [schoolId]/page.tsx
│   ├── ClaimUpdateForm.tsx       Extracted from actualizar/page.tsx
│   ├── EntryCard.tsx
│   ├── ContactCard.tsx
│   └── FilterBar.tsx
├── types/directory.ts           DirectoryEntry interface
├── config/site.ts               PER-SITE: brand, copy, taxonomy, JSON-LD, geo
├── app/
│   ├── page.tsx                  Landing (per-site)
│   ├── [listing]/page.tsx        List
│   ├── [listing]/[id]/page.tsx   Detail
│   ├── [listing]/[id]/actualizar/page.tsx
│   ├── api/revalidate/route.ts
│   ├── sitemap.ts
│   └── robots.ts
└── content/                      PER-SITE: landing copy, FAQ, legal
```

### `DirectoryEntry` (the universal interface)

```ts
interface DirectoryEntry {
  id: string;
  name: string;
  // Geography
  city: string;
  province: string;
  region: string;
  address: string;
  // Contact
  phone?: string;
  email?: string;
  website?: string;
  // Social
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  // Content
  description: string;
  image?: string;
  tags: string[];           // was 'courses' — generic (specialties/services/amenities)
  // Meta
  featured: boolean;
  status: 'Active' | 'Inactive' | 'Pending';
}
```

Every existing `NauticalSchool` field maps 1:1 except `courses → tags`.

### Per-site config surface

```ts
// config/site.ts (the only file site authors usually edit)
export const siteConfig = {
  brand: { name, tagline, primary, accent, logo, favicon, ogImage },
  paths: { listingSlug: 'clinicas' /* or 'escuelas', 'dentistas'… */ },
  copy: { listTitle, listSubtitle, tagsLabel, popularLocations, … },
  notion: { fields: { title, city, area, tags, … } },
  jsonLd: { type: 'MedicalClinic', extras: (entry) => ({ … }) },
  cityToProvince,
  webhooks: { leadEndpoint },
  bookingUrl,
};
```

---

## 4. Pre-Extraction Cleanup (do FIRST in TestNauti)

These are landmines found while inspecting the code. Fix them before copying or they propagate to every new site.

- [ ] **Resolve `.backup` divergence.** `EscuelasContent.tsx:7` and `actualizar/page.tsx:8` import from `@/data/nauticalSchools.backup` (static array) while `escuelas/page.tsx` and `[schoolId]/page.tsx` use the live Notion-fetched `@/data/nauticalSchools`. The list filter and claim form show stale data. → Make all four paths use `getNauticalSchools()`. Delete `nauticalSchools.backup.ts`.
- [ ] **Move `NauticalSchool` type out of `types/exam.ts`.** Create `types/directory.ts` (or `types/school.ts` in TestNauti). Update all imports.
- [ ] **Refactor `actualizar/page.tsx` to server-shell + client-form.** Currently it's all `'use client'` with `useEffect` to unwrap async params, which loses SSR metadata. Server component fetches school + sets metadata, client child handles form state.
- [ ] **Decide `lucide-react`.** It's in deps but unused (everything is inline SVG). Either swap inline SVGs to lucide (cleaner) or drop the dep.
- [ ] **Add Notion image domain to `next.config.ts`.** Currently only `images.unsplash.com` is allowed. Notion serves `prod-files-secure.s3.us-west-2.amazonaws.com` — uploaded images silently break otherwise.
- [ ] **Decide on Notion-image expiry strategy.** Signed Notion URLs expire after ~1 hour. Either (a) revalidate hourly, or (b) mirror images to our own R2/S3 on ingest. Mirror is the right long-term answer; ok to defer to post-extraction.

---

## 5. Phased Plan

### Phase 1 — Cleanup in TestNauti (~half day)
Fix the landmines above on this branch. Each as its own commit. PR merges back to `main`.

### Phase 2 — Build `DirectoryKit` template repo (~3 days)
New repo, copy the directory-relevant files, strip aggressively, rename to generic abstractions, introduce `config/site.ts`.

### Phase 3 — Spin up `health-clinics` site (~1 day code + content time)
First validation of the template. Notion DB clone, brand swap, copy rewrite, deploy.

### Phase 4 — Iterate template based on what hurt (~1 day)
Anything painful in Phase 3 gets pulled back into the template. Document.

---

## 6. Task Checklist

### Phase 1 — TestNauti cleanup
- [x] Audit all imports of `nauticalSchools.backup` and switch to live Notion source — found 3 import sites: `EscuelasContent.tsx` (type only), `actualizar/page.tsx` (data array), and **`src/app/page.tsx` (homepage featured-schools list — beyond original task list)**. Homepage converted from client to server component, client-side search extracted to `HomeSearchBar.tsx`.
- [x] Verify list/detail/filter/claim flows still work after switch — smoke-tested via curl: homepage 200 + 1 featured school SSR'd from live Notion; `/escuelas` 200 (374 KB, many schools); `/escuelas/<real>/actualizar` 200 with school name in SSR markup, form + Calendly present, `noindex,nofollow` meta correct; `/escuelas/<bogus>/actualizar` → 404 (`notFound()` works). Zero errors in dev log. Manual click-through in a browser still recommended before merge.
- [x] Delete `src/data/nauticalSchools.backup.ts`
- [x] Create `src/types/directory.ts`, move `NauticalSchool` interface there
- [x] Update all imports of `NauticalSchool` from `@/types/exam` → `@/types/directory` (also fixed `EscuelasContent.tsx` which imported the type from the backup file)
- [x] Refactor `actualizar/page.tsx`: server shell (metadata + school fetch) + client form child (`ClaimUpdateForm.tsx`). Server component now also generates proper SSR metadata with `noindex,nofollow` and uses `notFound()` properly.
- [x] Add `prod-files-secure.s3.us-west-2.amazonaws.com` to `next.config.ts` `images.remotePatterns`
- [x] Decide lucide-react: drop or adopt — **decision: no action.** Original framing was wrong: lucide is heavily used in `src/app/app/*` (10 files: dashboard, exams catalog, TestClient, results, error pages). It's only unused on the escuelas/marketing side, which uses inline SVGs by convention. Migrating escuelas to lucide would be churn that gets undone in Phase 2 (DirectoryKit plan drops lucide entirely). Leaving as-is means escuelas inline-SVGs transport to the kit cleanly with no dep baggage.
- [x] Open PR for cleanup — [PR #3](https://github.com/craftwerk-studio/testnauti/pull/3) opened, CodeRabbit triaged (3 applied / 2 deferred to `tasks/follow-ups.md` / 1 rejected on PR), all checks green, MERGEABLE. Awaiting human review + merge.

### Phase 2 — Build DirectoryKit
- [ ] Create new repo `directory-kit` (separate Git repo, not in this monorepo)
- [ ] Copy directory-relevant files (see "What to copy" below)
- [ ] Delete: `@clerk/nextjs`, `@prisma/client`, `prisma/`, all `prisma:*` scripts
- [ ] Delete: `app/app/`, `app/sign-in/`, `app/sign-up/`, `app/test/`, `app/debug/`, `middleware.ts`
- [ ] Delete: `lib/db.ts`, `app/actions/`
- [ ] Drop: `vitest`, `@testing-library/*`, `jsdom`, `@anthropic-ai/sdk`, `cheerio` (review per-dep)
- [ ] Rename: `NauticalSchool → DirectoryEntry`, `courses → tags`
- [ ] Rename: `EscuelasContent → DirectoryList`, `nauticalSchools.ts → directory.ts`
- [ ] Rename: `fetchSchoolsFromNotion → fetchEntriesFromNotion(fieldMap)` (config-driven field mapping)
- [ ] Rename: `revalidate-schools → revalidate`
- [ ] Convert hardcoded `escuelas` route to dynamic `[listing]` segment driven by `siteConfig.paths.listingSlug`
- [ ] Replace hardcoded blue/cyan gradients with CSS variables (`--primary`, `--accent`) in `globals.css`
- [ ] Create `config/site.ts` with full TypeScript-typed shape
- [ ] Create `content/` directory pattern for landing copy
- [ ] Make `ClaimUpdateForm` standalone component with config-driven copy and webhook URL
- [ ] Write README: "Spin up a new directory site in 5 steps"
- [ ] Add `.env.example` with all required env vars
- [ ] Build smoke test: kit boots with empty Notion DB and shows empty state

### Phase 3 — health-clinics site
- [ ] `npx degit your-org/directory-kit health-clinics`
- [ ] **Notion setup**
  - [ ] Duplicate Escuelas DB → "Clínicas"
  - [ ] Rename `Services` → `Especialidades`
  - [ ] Add medical-specific fields: `Insurance` (multi-select), `Languages` (multi-select), `Has Parking` (checkbox), `Accepts Walk-ins` (checkbox)
  - [ ] Capture new DB ID
- [ ] **`config/site.ts`**
  - [ ] Brand: name, tagline, colors
  - [ ] Copy: list title/subtitle/tags label/popular locations
  - [ ] Notion field mapping
  - [ ] JSON-LD type: `MedicalClinic` (or `MedicalBusiness`)
  - [ ] `cityToProvince` reused as-is
- [ ] **`.env.local`**
  - [ ] `NOTION_TOKEN` (new integration)
  - [ ] `NOTION_DB_ID` (clinics DB)
  - [ ] `NEXT_PUBLIC_LEAD_WEBHOOK_URL` (new n8n flow)
  - [ ] `NEXT_PUBLIC_CALENDLY_URL` (or remove — see open question)
  - [ ] `REVALIDATE_SECRET`
- [ ] **Brand assets:** logo, favicon, OG image in `public/`
- [ ] **Landing page:** rewrite copy in `app/page.tsx`
- [ ] **Compliance pages:** cookie banner, GDPR notice, "informational not medical advice" footer
- [ ] **n8n flow:** clone escuelas-claim flow, point at clinics ops mailbox/CRM
- [ ] **Deploy:** Vercel project, env vars, custom domain
- [ ] **Notion webhook:** point at `/api/revalidate` with `REVALIDATE_SECRET`
- [ ] **Seed content:** 10–20 clinics in Notion to validate end-to-end
- [ ] **SEO smoke test:** crawl the site, check JSON-LD with Google Rich Results test, check sitemap

### Phase 4 — Template iteration
- [ ] Document anything painful from Phase 3 in this file
- [ ] Pull recurring per-site work back into the template
- [ ] Re-test template by spinning up a throwaway third site (or dry-run)

---

## 7. Open Questions / Decisions to Make

- [ ] **Calendly upsell on clinic detail pages?** Awkward (people expect to book with the clinic, not us). Probably keep Calendly only on the *claim/update* flow. **Default: drop from clinic detail.**
- [ ] **Specialty × city pages?** `/clinicas/cardiologia/madrid` URLs drive 3–5x the long-tail SEO of plain city pages. Build now or defer? **Default: build in Phase 3** (URL shape decisions are hard to reverse).
- [ ] **Filter dimensions for clinics.** Add `insurance`, `languages`, `specialty` as filters from day one (not just city/region/featured). **Default: yes.**
- [ ] **Image mirroring to R2/S3.** Notion signed URLs expire after ~1h. Mirror on ingest or just revalidate hourly? **Default: revalidate hourly in Phase 3, mirror in Phase 4.**
- [ ] **Repo structure.** Keep `directory-kit` as a separate GitHub repo? Or as a sibling folder in a future "site-factory" monorepo? **Default: separate repo for now, monorepo if we hit 3+ sites.**
- [ ] **Lead form destination for clinics.** n8n → email? n8n → Notion DB? n8n → CRM (HubSpot)? **Default: same as TestNauti (n8n + email) for v1.**

---

## 8. What to Copy from TestNauti → DirectoryKit

**Copy (with rename/refactor):**
- `src/app/escuelas/page.tsx` → `app/[listing]/page.tsx`
- `src/app/escuelas/EscuelasContent.tsx` → `components/DirectoryList.tsx`
- `src/app/escuelas/[schoolId]/page.tsx` → `app/[listing]/[id]/page.tsx`
- `src/app/escuelas/[schoolId]/not-found.tsx` → matching path
- `src/app/escuelas/[schoolId]/actualizar/page.tsx` → split into server shell + `components/ClaimUpdateForm.tsx`
- `src/app/api/revalidate-schools/route.ts` → `app/api/revalidate/route.ts`
- `src/lib/notion.ts` (env-driven, generalize var names: `NOTION_DB_ID` not `NOTION_ESCUELAS_DB_ID`)
- `src/lib/notion/fetchSchools.ts` → `lib/adapters/notion.ts` (config-driven fields)
- `src/data/nauticalSchools.ts` → `lib/directory.ts`
- `src/components/MarketingNav.tsx` → `components/DirectoryNav.tsx`
- `src/app/sitemap.ts`, `src/app/robots.ts`
- `src/app/layout.tsx`, `src/app/globals.css` (with CSS variables for theming)
- `src/app/page.tsx` (skeleton with config-driven copy)
- `next.config.ts` (with proper image domains)
- `tsconfig.json`, ESLint config, Tailwind config
- Trimmed `package.json`

**Drop entirely:**
- `@clerk/nextjs`, `middleware.ts`, all `app/sign-*`, `app/app/*`
- `@prisma/client`, `prisma/`, `lib/db.ts`, `app/actions/`
- All exam-related code: `lib/loadExams*`, `data/pastExams.ts`, `data/exams/`, `types/exam.ts`, `app/test/`, `app/debug/`, `app/app/exams/`
- SEO landing pages specific to PER (`como-sacarse-el-per`, `para-escuelas`, `features`)
- Vitest harness + test setup (re-add later if needed)

---

## 9. Clinics-Specific Considerations (not free reuse)

### Compliance — the big one
- [ ] GDPR: heavier when listing healthcare; cookie consent banner mandatory
- [ ] Spanish medical advertising rules (LGS Art. 102) — copy can't claim "best", "guaranteed", etc.
- [ ] "Informational, not medical advice" footer
- [ ] Calendly + analytics need consent gating

### SEO
- [ ] JSON-LD type: `MedicalClinic` (or `MedicalBusiness` for multi-specialty centers)
- [ ] Add `medicalSpecialty` to JSON-LD per entry
- [ ] Specialty × city pages (see open questions)

### Taxonomy
- Spanish medical specialties: ~40 with sub-specialties → consider separate Notion `Specialties` DB with relations once >50 clinics

### Search UX
- Users search by *insurance* + *specialty* far more than city → filter dimensions need to lead with those, not city

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Notion as CMS hits limits at scale (~1k entries comfortable, painful past that) | Adapter pattern in `lib/adapters/` lets us swap to Postgres/Supabase later without touching pages |
| Template drift if we end up with 3+ sites and bug fixes need N PRs | Promote to Strategy C (npm package) once we hit site #3 |
| Notion image URL expiry breaks ISR | Mirror images to R2/S3 (Phase 4) |
| Clinics taxonomy gets unwieldy in `multi_select` | Migrate to relational Notion DB (Specialties as separate DB) once >50 clinics |
| Compliance miss on health vertical | Legal review of copy + cookie/consent flow before public launch |

---

## 11. Status

| Phase | Status | Notes |
|---|---|---|
| 1. TestNauti cleanup | **Awaiting merge** | [PR #3](https://github.com/craftwerk-studio/testnauti/pull/3) on `feat/directory-kit-extraction` (HEAD `e9c9a54`). All checks green, CodeRabbit triaged. Two deferred items in `tasks/follow-ups.md`. |
| 2. DirectoryKit template | Prep in progress | Branch `feat/directory-kit-phase2-prep`. File-by-file inventory + coupling audit landed → [`tasks/phase2-inventory.md`](./phase2-inventory.md). Phase 2 itself = new separate `directory-kit` repo. |
| 3. health-clinics site | Not started | |
| 4. Template iteration | Not started | |

**Session handoff for fresh Claude instance:** see [`tasks/SESSION-HANDOFF.md`](./SESSION-HANDOFF.md).

---

## 12. Changelog

- **2026-05-01** — Document created. Strategy B chosen. Phase 1 cleanup tasks identified from code inspection.
- **2026-05-03** — Phase 1 cleanup executed (commit `edb0f87`). Audit caught a third `nauticalSchools.backup` caller the original list missed: `src/app/page.tsx`. Lucide-react decision: no action (see Phase 1 notes).
- **2026-05-03** — PR #3 opened. CodeRabbit installed + tuned config landed (`5adce61`). CodeRabbit review triaged: 3 applied (`868b778` — message length validation, search-query trim, homepage Notion-failure fallback), 2 deferred to `tasks/follow-ups.md` (`e9c9a54` — stale "Última Convocatoria" copy, `NauticalSchool.status` union narrowing), 1 rejected on PR (markdownlint MD040 nit, project doesn't enforce). Branch `feat/directory-kit-phase2-prep` cut from `e9c9a54` for next slice while PR #3 awaits merge.
- **2026-05-03** — Phase 2 prep: file-by-file inventory + coupling audit committed as `tasks/phase2-inventory.md`. Captures every directory-side file with current line counts (post-Phase 1), 17-field Notion mapper config target, ~80 hardcoded blue/cyan tokens needing CSS-var migration, env-var rename table, three §8 omissions (`ClaimUpdateForm.tsx`, `HomeSearchBar.tsx`, `types/directory.ts`), and a Phase 2 build-ordering suggestion. Decision recorded: land `status` union narrowing inside the kit's fresh adapter rather than as a separate TestNauti PR.
