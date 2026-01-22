# Product Requirements Document: Reactivate Tests Section with Real PER Data

## Document Information
- **Project**: TestNauti.co
- **Feature**: Reactivate Tests Section with Real PER Exam Data
- **Created**: 2026-01-22
- **Status**: Draft
- **Priority**: High

---

## 1. Executive Summary

### Overview
Replace the current placeholder test data in TestNauti.co with authentic PER (Patrón de Embarcaciones de Recreo) exam content from November 2025. This involves converting the existing markdown exam file to the platform's JSON format and updating both the public marketing page and the authenticated user portal to display only this single real exam initially.

### Goals
1. Replace all dummy/placeholder exam data with one authentic PER exam
2. Convert markdown format exam questions to structured JSON
3. Update public test page to show only the real exam
4. Ensure user portal correctly displays the real exam
5. Add messaging about future expansion to other Comunidades Autónomas

### Success Metrics
- All dummy JSON exam files removed
- One real PER exam (45 questions) successfully loaded in both public and authenticated sections
- No broken links or functionality
- Clear messaging about future exam additions
- Existing UI/UX maintained (no major design changes)

---

## 2. Background & Context

### Current State
TestNauti currently has two parallel systems showing test data:

**Public Website (`/test`):**
- Displays data from `src/data/pastExams.ts`
- Shows 12 placeholder exam entries (Julio 2024, Mayo 2024, etc.)
- Each entry shows: date, Comunidad Autónoma, 45 questions, 60 min duration
- Non-functional - exams cannot be taken without authentication
- Acts as marketing/preview page

**User Portal (`/app/exams`):**
- Loads exams from JSON files via `src/lib/loadExams.ts`
- Currently has 4 dummy exam files:
  - `2023-math-paper1.json`
  - `2024-biology-midterm.json`
  - `2022-physics-final.json`
  - `2025-per-exam69.json` (29 questions, likely placeholder)
- These are functional - users can take exams, see results, track progress

**Source Data:**
- Real PER exam available in markdown format: `data/exams/examen-per-nov-25-v01.md`
- Contains 45 authentic questions from November 2025 PER exam
- Includes answer key at bottom of file
- Covers topics: Nomenclatura náutica, Elementos de amarre y fondeo, Seguridad, Legislación, Balizamiento, RIPA, Maniobra y navegación, Emergencias en la mar, Meteorología, Teoría de la navegación, Carta de navegación

### Problem Statement
Users currently see placeholder data that:
1. Contains incorrect subject matter (math, physics, biology) instead of nautical content
2. May confuse users about the platform's purpose
3. Prevents the platform from being production-ready
4. Doesn't reflect the authentic PER exam experience

### Why Now?
- Real PER exam data is available and ready to use
- Platform infrastructure is fully built and tested
- This is the final step before production launch
- Users need to see authentic content to trust the platform

---

## 3. User Stories & Use Cases

### Primary Users
1. **Prospective Students** (Public Website)
   - Visit `/test` to see what exams are available
   - Browse exam catalog before signing up
   - Understand what TestNauti offers

2. **Registered Students** (User Portal)
   - Browse available exams at `/app/exams`
   - Take practice exams
   - Review results and track progress

### User Stories

#### US-1: View Real Exam on Public Page
**As a** prospective student
**I want to** see what real PER exams are available
**So that** I can decide if TestNauti is right for me

**Acceptance Criteria:**
- Public `/test` page shows exactly 1 exam
- Exam displays: "Noviembre 2025", "Nacional", 45 questions, 60 min
- Clear messaging that more regional exams coming soon
- All visual elements and styling remain unchanged
- CTA buttons for sign-up remain functional

#### US-2: Take Real PER Exam
**As a** registered student
**I want to** practice with the real November 2025 PER exam
**So that** I can prepare for my certification

**Acceptance Criteria:**
- Exam appears in `/app/exams` catalog
- Exam card shows: "PER", "2025", 45 questions, 60 minutes
- "Empezar práctica" button navigates to exam detail page
- All 45 questions load correctly
- Timer functionality works (60 minutes)
- Correct answers are properly validated
- Results page shows accurate scoring

#### US-3: Progress Tracking with Real Data
**As a** registered student
**I want to** see my progress on real exams in the dashboard
**So that** I can track my improvement over time

**Acceptance Criteria:**
- Dashboard shows attempts for the PER exam
- Stats (total attempts, average score, best score) calculate correctly
- Recent attempts section displays PER exam results
- "Practicar de nuevo" button navigates to the PER exam

---

## 4. Functional Requirements

### 4.1 Data Conversion
**Priority: P0 (Blocker)**

#### FR-1.1: Convert Markdown to JSON
- Parse `data/exams/examen-per-nov-25-v01.md`
- Extract all 45 questions with their options and correct answers
- Create JSON file: `code/src/data/exams/2025-per-nov-v01.json`

**JSON Structure:**
```json
{
  "id": "2025-per-nov-v01",
  "title": "Examen PER - Noviembre 2025",
  "subject": "PER",
  "year": 2025,
  "durationMinutes": 60,
  "totalQuestions": 45,
  "description": "Examen oficial del Patrón de Embarcaciones de Recreo (PER) de la convocatoria de Noviembre 2025. Incluye preguntas sobre nomenclatura náutica, seguridad, legislación, balizamiento, RIPA, maniobras, emergencias, meteorología y navegación.",
  "questions": [
    {
      "number": 1,
      "text": "Se denomina asiento a la diferencia entre:",
      "options": {
        "a": "El calado medio y el francobordo.",
        "b": "El calado de popa y el de proa.",
        "c": "El puntal y el francobordo.",
        "d": "El puntal y el calado."
      },
      "correctAnswer": "b"
    },
    // ... 44 more questions
  ]
}
```

**Mapping Details:**
- Questions 1-45 from MD file → questions array
- Answer key (lines 347-391) → correctAnswer field for each question
- Clean up special characters and formatting
- Ensure all text is properly escaped

#### FR-1.2: Validate Data Structure
- JSON validates against `Exam` type in `src/types/exam.ts`
- All 45 questions have correct structure
- All correct answers are valid options (a, b, c, or d)
- No missing or malformed data

### 4.2 Backend Updates
**Priority: P0 (Blocker)**

#### FR-2.1: Update Exam Registry
File: `code/src/lib/loadExams.ts`

**Changes:**
1. Remove all dummy exam imports (lines 5-8)
2. Add new import:
   ```typescript
   import examPERNov2025 from '@/data/exams/2025-per-nov-v01.json';
   ```
3. Update examRegistry to contain only the new exam:
   ```typescript
   const examRegistry: Exam[] = [
     examPERNov2025 as Exam,
   ];
   ```

**Expected Behavior:**
- `loadExams()` returns array with 1 exam
- `findExamById('2025-per-nov-v01')` returns the PER exam
- `getUniqueSubjects()` returns `['PER']`
- `getUniqueYears()` returns `[2025]`
- `getExamCount()` returns `1`

#### FR-2.2: Delete Dummy Files
Remove these files:
- `code/src/data/exams/2023-math-paper1.json`
- `code/src/data/exams/2024-biology-midterm.json`
- `code/src/data/exams/2022-physics-final.json`
- `code/src/data/exams/2025-per-exam69.json`

### 4.3 Public Test Page Updates
**Priority: P0 (Blocker)**

File: `code/src/app/test/page.tsx`

#### FR-3.1: Replace pastExams Data
Currently imports from `@/data/pastExams` (12 fake entries).

**Option A (Recommended): Keep Static Data**
Update `code/src/data/pastExams.ts`:
```typescript
export const pastExams: PastExam[] = [
  {
    date: 'Noviembre 2025',
    dateSort: '2025-11',
    community: 'Nacional',
    questions: 45,
    duration: '60 min',
    icon: '⚓'
  }
];
```

**Option B: Dynamic Load**
Replace static import with `loadExams()` call:
```typescript
import { loadExams } from '@/lib/loadExams';

export default function TestPage() {
  const exams = loadExams();
  const sortedExams = [...exams].map(exam => ({
    date: `${monthName(exam.year)} ${exam.year}`,
    dateSort: `${exam.year}-${exam.month || '11'}`,
    community: 'Nacional',
    questions: exam.totalQuestions,
    duration: `${exam.durationMinutes} min`,
    icon: '⚓'
  }));
  // ... rest of component
}
```

**Recommendation**: Use Option A for performance (no server-side data loading on marketing page).

#### FR-3.2: Add Future Expansion Message
Add informational banner after the hero section (after line 67):

```tsx
{/* Future Plans Notice */}
<div className="mb-12 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0">
      <svg className="w-6 h-6 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-blue-900 mb-2">
        📍 Próximamente: Tests por Comunidad Autónoma
      </h3>
      <p className="text-blue-800">
        Actualmente ofrecemos exámenes oficiales PER de convocatorias nacionales.
        Pronto añadiremos exámenes específicos de cada Comunidad Autónoma para que
        puedas practicar con las preguntas exactas de tu región.
      </p>
    </div>
  </div>
</div>
```

**Position**: After line 100 (after Benefits Section, before Available Tests Section)

#### FR-3.3: Update Grid Display
No changes needed to grid layout (lines 141-172) - should work with 1 exam automatically.

**Expected Result:**
- Single exam card displayed
- Shows: "Noviembre 2025", "Nacional", "⚓", "45 preguntas", "60 min"
- No broken layout
- Sort buttons remain visible but have no effect (acceptable for 1 exam)

### 4.4 User Portal Updates
**Priority: P0 (Blocker)**

#### FR-4.1: Exams Catalog Page
File: `code/src/app/app/exams/page.tsx`

**Changes Required:**
1. Update stats bar (line 26): Should show "1 examen disponible"
2. Grid should display single exam card correctly
3. Exam card should show:
   - Subject badge: "PER"
   - Year: "2025"
   - Title: "Examen PER - Noviembre 2025"
   - Description: (from JSON)
   - "45 preguntas"
   - "60 min"
4. "Empezar práctica" button navigates to `/app/exams/2025-per-nov-v01`

**No code changes needed** - page dynamically loads from `loadExams()`.

#### FR-4.2: Dashboard Page
File: `code/src/app/app/dashboard/page.tsx`

**Changes Required:**
- None - dashboard dynamically loads user stats from database

**Expected Behavior:**
- New exam attempts show exam title: "Examen PER - Noviembre 2025"
- Stats calculate correctly for the new exam
- "Practicar de nuevo" button navigates to new exam ID

#### FR-4.3: Exam Detail Page
File: `code/src/app/app/exams/[examId]/page.tsx`

**Expected Behavior:**
- Loads exam with `findExamById('2025-per-nov-v01')`
- Displays exam metadata correctly
- "Comenzar el examen" button navigates to test page with timer option

#### FR-4.4: Test Engine
File: `code/src/app/app/exams/[examId]/test/TestClient.tsx`

**Expected Behavior:**
- All 45 questions load correctly
- Questions display with proper formatting
- Options (a, b, c, d) render correctly
- Keyboard shortcuts work (A/B/C/D or 1/2/3/4)
- Timer counts down from 60 minutes
- Auto-submit at time=0
- Correct answers validate properly
- Score calculation: 70% pass threshold (32/45 questions)

#### FR-4.5: Results Page
File: `code/src/app/app/exams/[examId]/results/page.tsx`

**Expected Behavior:**
- Score displays correctly
- Pass/fail determined by 70% threshold
- All 45 questions shown in review
- Correct answers highlighted
- User's answers shown
- Percentage calculation accurate

### 4.5 Navigation & Routing
**Priority: P0 (Blocker)**

#### FR-5.1: Marketing Navigation
File: `code/src/components/MarketingNav.tsx`

**Current State:**
- Line 21: Link to `/test` exists and is visible

**Required Changes:**
- None - navigation is already active

#### FR-5.2: App Navigation
File: `code/src/components/AppNav.tsx`

**Current State:**
- Shows "Exámenes" link to `/app/exams`

**Required Changes:**
- None - navigation is already active

#### FR-5.3: Landing Page CTAs
File: `code/src/app/page.tsx`

**Current State:**
- Line 222-260: "Practica con Tests Oficiales" section exists
- Links to `/test` page exist

**Required Changes:**
- None - CTAs already functional

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load times should not increase
- Exam data loads in <200ms
- No performance degradation with 45 questions

### 5.2 Data Quality
- All 45 questions must be accurate transcriptions from source
- Correct answers must match official answer key
- No typos or formatting errors
- Special characters (°, º, ', ", ñ, etc.) render correctly

### 5.3 Compatibility
- Works in all browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (existing layout already responsive)
- No breaking changes to existing user data or attempts

### 5.4 Maintainability
- JSON structure follows existing `Exam` interface
- No changes to database schema required
- Easy to add more exams in future (just add JSON file and update registry)

### 5.5 Security
- No changes to authentication or authorization
- Same security model applies to new exam
- No exposure of correct answers in client-side code before submission

---

## 6. UI/UX Requirements

### 6.1 Design Principles
- **No major UI changes**: Keep existing component structure, colors, layouts
- **Consistency**: New exam should look identical to old exams in the UI
- **Clarity**: Users should understand this is a real, official PER exam

### 6.2 Specific UI Elements

#### Public Test Page
**Hero Section:**
- Keep existing gradient, icons, and copy
- No changes needed

**Available Tests Section:**
- Title: "Tests Disponibles" (no change)
- Description: Update to reflect single exam:
  ```
  "Practica con el examen oficial PER de Noviembre 2025.
  Pronto añadiremos más exámenes de convocatorias anteriores
  y específicos de cada Comunidad Autónoma."
  ```

**Exam Card:**
- Badge: "Noviembre 2025" (blue background)
- Icon: ⚓
- Title: "Nacional"
- Metadata: "📋 45 preguntas", "⏰ 60 min duración"
- Keep hover effects and transitions

**Future Plans Banner:**
- Position: Between Benefits and Available Tests
- Style: Blue background (`bg-blue-50`), left border (`border-l-4 border-blue-500`)
- Icon: Information icon (i in circle)
- Content: See FR-3.2

#### User Portal - Exams Catalog
**Stats Bar:**
- "1 examen disponible" (singular)
- Keep other badges unchanged

**Exam Card:**
- Subject badge: "PER" (blue, top-left)
- Year: "2025" (gray, top-right)
- Title: "Examen PER - Noviembre 2025" (bold, large)
- Description: Truncate to 2 lines with ellipsis
- Metadata: "📋 45 preguntas", "⏰ 60 min"
- Button: "Empezar práctica" (blue, with book icon)

**Empty State:**
- Should never show (1 exam available)

#### User Portal - Dashboard
**Recent Attempts:**
- Exam title: "Examen PER - Noviembre 2025"
- All other elements unchanged (score, date, time, pass/fail icon)

### 6.3 Accessibility
- All existing ARIA labels remain
- No accessibility regressions
- Color contrast maintained (already WCAG AA compliant)

### 6.4 Responsive Behavior
- Mobile: Single column grid (existing behavior)
- Tablet: 2-column grid (existing behavior)
- Desktop: 3-column grid (1 exam still renders correctly)

---

## 7. Technical Specifications

### 7.1 File Structure
```
code/
├── src/
│   ├── app/
│   │   ├── test/
│   │   │   └── page.tsx                    [UPDATE: messaging]
│   │   └── app/
│   │       ├── dashboard/
│   │       │   └── page.tsx                [NO CHANGE]
│   │       └── exams/
│   │           ├── page.tsx                [NO CHANGE]
│   │           ├── [examId]/
│   │           │   ├── page.tsx            [NO CHANGE]
│   │           │   ├── test/
│   │           │   │   └── TestClient.tsx  [NO CHANGE]
│   │           │   └── results/
│   │           │       └── page.tsx        [NO CHANGE]
│   ├── components/
│   │   ├── MarketingNav.tsx               [NO CHANGE]
│   │   └── AppNav.tsx                      [NO CHANGE]
│   ├── data/
│   │   ├── exams/
│   │   │   ├── 2025-per-nov-v01.json      [CREATE]
│   │   │   ├── 2023-math-paper1.json      [DELETE]
│   │   │   ├── 2024-biology-midterm.json  [DELETE]
│   │   │   ├── 2022-physics-final.json    [DELETE]
│   │   │   └── 2025-per-exam69.json       [DELETE]
│   │   └── pastExams.ts                    [UPDATE: data array]
│   ├── lib/
│   │   └── loadExams.ts                    [UPDATE: imports & registry]
│   └── types/
│       └── exam.ts                         [NO CHANGE]
data/
└── exams/
    └── examen-per-nov-25-v01.md           [NO CHANGE - source]
```

### 7.2 Data Validation Script
Recommended: Create validation script at `scripts/validate-exam.ts`:

```typescript
import * as fs from 'fs';
import { Exam, AnswerOption } from '../code/src/types/exam';

const examPath = process.argv[2];
const exam = JSON.parse(fs.readFileSync(examPath, 'utf-8')) as Exam;

// Validation checks
const errors: string[] = [];

// Check required fields
if (!exam.id) errors.push('Missing id');
if (!exam.title) errors.push('Missing title');
if (!exam.subject) errors.push('Missing subject');
if (!exam.year) errors.push('Missing year');
if (!exam.durationMinutes) errors.push('Missing durationMinutes');
if (!exam.totalQuestions) errors.push('Missing totalQuestions');
if (!exam.description) errors.push('Missing description');

// Check questions
if (!Array.isArray(exam.questions)) {
  errors.push('questions is not an array');
} else {
  if (exam.questions.length !== exam.totalQuestions) {
    errors.push(`Question count mismatch: ${exam.questions.length} vs ${exam.totalQuestions}`);
  }

  exam.questions.forEach((q, idx) => {
    if (q.number !== idx + 1) errors.push(`Q${idx + 1}: wrong number (${q.number})`);
    if (!q.text) errors.push(`Q${idx + 1}: missing text`);
    if (!q.options || typeof q.options !== 'object') {
      errors.push(`Q${idx + 1}: missing options`);
    } else {
      if (!q.options.a) errors.push(`Q${idx + 1}: missing option a`);
      if (!q.options.b) errors.push(`Q${idx + 1}: missing option b`);
      if (!q.options.c) errors.push(`Q${idx + 1}: missing option c`);
      if (!q.options.d) errors.push(`Q${idx + 1}: missing option d`);
    }
    if (!['a', 'b', 'c', 'd'].includes(q.correctAnswer)) {
      errors.push(`Q${idx + 1}: invalid correctAnswer (${q.correctAnswer})`);
    }
  });
}

// Report
if (errors.length === 0) {
  console.log('✅ Validation passed!');
  console.log(`📝 ${exam.totalQuestions} questions`);
  console.log(`⏰ ${exam.durationMinutes} minutes`);
  console.log(`📚 Subject: ${exam.subject}`);
} else {
  console.error('❌ Validation failed:');
  errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
}
```

Run with: `npx tsx scripts/validate-exam.ts code/src/data/exams/2025-per-nov-v01.json`

### 7.3 Testing Requirements

#### Manual Testing Checklist
- [ ] Public test page loads without errors
- [ ] Single exam displays correctly
- [ ] Future plans message appears
- [ ] CTA buttons navigate to sign-up
- [ ] User portal exams page shows 1 exam
- [ ] Exam card displays correct metadata
- [ ] "Empezar práctica" navigates to exam detail
- [ ] Exam detail page loads
- [ ] Timer checkbox works
- [ ] Test page loads with all 45 questions
- [ ] All question text renders correctly
- [ ] All options (a,b,c,d) display properly
- [ ] Keyboard shortcuts work (A/B/C/D, 1/2/3/4)
- [ ] Arrow keys navigate questions
- [ ] Timer counts down correctly
- [ ] Auto-submit triggers at time=0
- [ ] Manual submit works
- [ ] Results page shows correct score
- [ ] Answer review shows all 45 questions
- [ ] Correct answers highlighted properly
- [ ] Pass/fail calculated correctly (70% threshold)
- [ ] Dashboard shows new attempt
- [ ] Stats update correctly

#### Automated Testing
Existing test suite should pass:
```bash
cd code
npm run test
```

Focus areas:
- Exam loading functions (`loadExams`, `findExamById`)
- Question validation
- Score calculation
- Timer logic

---

## 8. Implementation Plan

### Phase 1: Data Preparation (2-3 hours)
**Owner**: Developer
**Timeline**: Day 1

Tasks:
1. Create conversion script or manually convert MD to JSON
2. Map all 45 questions from `examen-per-nov-25-v01.md`
3. Extract answer key and map to correctAnswer fields
4. Create `2025-per-nov-v01.json`
5. Run validation script
6. Fix any formatting issues

**Deliverable**: Validated JSON file ready for integration

### Phase 2: Backend Integration (1-2 hours)
**Owner**: Developer
**Timeline**: Day 1

Tasks:
1. Update `loadExams.ts` imports and registry
2. Delete 4 dummy JSON files
3. Test `loadExams()` function
4. Verify `findExamById()` works
5. Check all utility functions

**Deliverable**: Backend correctly serves new exam data

### Phase 3: Frontend Updates (2-3 hours)
**Owner**: Developer
**Timeline**: Day 1-2

Tasks:
1. Update `pastExams.ts` data
2. Add future plans banner to `/test` page
3. Update description text
4. Test public page rendering
5. Test user portal pages (catalog, dashboard, detail)
6. Verify all navigation links work

**Deliverable**: All pages render correctly with new data

### Phase 4: Testing & QA (2-3 hours)
**Owner**: QA / Developer
**Timeline**: Day 2

Tasks:
1. Complete manual testing checklist
2. Test on multiple browsers
3. Test on mobile devices
4. Run automated test suite
5. Verify data accuracy (spot-check questions)
6. Test timer functionality end-to-end
7. Verify score calculation

**Deliverable**: All tests passing, no critical bugs

### Phase 5: Deployment (1 hour)
**Owner**: DevOps / Developer
**Timeline**: Day 2

Tasks:
1. Review changes one final time
2. Commit changes to git
3. Push to staging environment
4. Smoke test in staging
5. Deploy to production (Vercel)
6. Monitor for errors

**Deliverable**: Production deployment complete

### Total Estimated Time: 8-12 hours
**Recommended Timeline**: 2 days

---

## 9. Dependencies & Blockers

### Dependencies
1. Source file `examen-per-nov-25-v01.md` must be accurate and complete ✅ (exists)
2. Existing test infrastructure must be working ✅ (confirmed working)
3. Database schema supports new exam ✅ (no changes needed)
4. No breaking changes in Next.js 16 or dependencies ✅ (stable)

### Potential Blockers
1. **Data Quality Issues**: If source MD file has errors or ambiguities
   - **Mitigation**: Manual review of converted JSON, validation script
2. **Special Character Encoding**: Spanish characters, mathematical symbols
   - **Mitigation**: Test encoding, use UTF-8 throughout
3. **Performance**: 45 questions might load slowly
   - **Mitigation**: Already tested with similar question counts, should be fine
4. **User Data Migration**: If dummy exams have real user attempts
   - **Mitigation**: Check production DB first, may need to preserve attempts

### External Dependencies
- None (no external APIs, no third-party services needed)

---

## 10. Risks & Mitigation

### Risk Matrix

| Risk | Probability | Impact | Severity | Mitigation |
|------|------------|--------|----------|------------|
| Conversion errors in JSON | Medium | High | 🔴 Critical | Validation script, manual review |
| Special characters broken | Low | Medium | 🟡 Moderate | UTF-8 encoding, character testing |
| Performance degradation | Low | Medium | 🟡 Moderate | Performance testing before deploy |
| Users lose existing attempts | Low | High | 🔴 Critical | Database backup, preserve ExamAttempt records |
| UI breaks on mobile | Low | Medium | 🟡 Moderate | Responsive testing on multiple devices |
| SEO impact on `/test` page | Low | Low | 🟢 Minor | No routing changes, maintain meta tags |

### Risk Details

#### R1: Data Conversion Errors
**Description**: Questions or answers might be incorrectly transcribed from MD to JSON.

**Impact**: Users get wrong feedback, fail when they should pass, or vice versa.

**Mitigation**:
- Create automated validation script (see 7.2)
- Manually review random sample of 10 questions
- Cross-check answer key mapping
- Have second person review high-stakes questions (navigation/safety)

#### R2: User Data Loss
**Description**: Deleting dummy exams might orphan existing user attempts.

**Impact**: Dashboard shows errors, stats calculation breaks.

**Mitigation**:
- Before deletion, query database for attempts on dummy exam IDs
- If production DB has real attempts, preserve those exam files temporarily
- Add DB constraint to prevent orphaned attempts
- Run database query before deployment:
  ```sql
  SELECT examId, COUNT(*) FROM ExamAttempt
  WHERE examId IN ('2023-math-paper1', '2024-biology-midterm', '2022-physics-final', '2025-per-exam69')
  GROUP BY examId;
  ```

#### R3: SEO Regression
**Description**: Changing content on `/test` might affect search rankings.

**Impact**: Lost organic traffic from Google.

**Mitigation**:
- Maintain same URL structure (`/test`)
- Keep meta tags and descriptions nautical-focused
- Add structured data for the exam
- Monitor Search Console for ranking changes

---

## 11. Success Criteria & Validation

### Acceptance Criteria

#### AC-1: Data Accuracy
- [ ] All 45 questions correctly converted
- [ ] All correct answers match official answer key
- [ ] No missing or malformed data
- [ ] Special characters render properly
- [ ] JSON validates against TypeScript types

#### AC-2: Functional Requirements
- [ ] Public test page shows exactly 1 exam
- [ ] User portal shows exactly 1 exam
- [ ] Exam can be started and completed
- [ ] Timer works (60 minutes)
- [ ] Score calculates correctly
- [ ] Pass/fail threshold is 70% (32/45 questions)
- [ ] Results page shows correct feedback
- [ ] Dashboard tracks attempts properly

#### AC-3: User Experience
- [ ] No broken links or navigation
- [ ] No console errors or warnings
- [ ] Mobile responsive on all pages
- [ ] Loading times < 2 seconds
- [ ] UI matches existing design system
- [ ] Future plans message displays clearly

#### AC-4: Code Quality
- [ ] All TypeScript types correct
- [ ] No ESLint errors
- [ ] Existing tests pass
- [ ] No unused imports or dead code
- [ ] Clean git history with clear commit messages

### Test Cases

#### TC-1: Public Test Page
1. Navigate to `/test`
2. Verify 1 exam card displays
3. Verify exam shows: "Noviembre 2025", "Nacional", 45 questions, 60 min
4. Verify future plans banner appears
5. Click "Crear Cuenta Gratis" → redirects to `/sign-up`

#### TC-2: User Exam Flow (Happy Path)
1. Sign in as test user
2. Navigate to `/app/exams`
3. Verify 1 exam shows: "Examen PER - Noviembre 2025"
4. Click "Empezar práctica"
5. Arrive at exam detail page
6. Enable timer checkbox
7. Click "Comenzar el examen"
8. Answer all 45 questions
9. Click "Finalizar examen"
10. Confirm submission
11. Verify results page shows score
12. Verify pass/fail is correct based on score
13. Review answers
14. Return to dashboard
15. Verify attempt appears in "Intentos recientes"

#### TC-3: Timer Auto-Submit
1. Start exam with timer enabled
2. Manually set timer to 5 seconds (dev tools)
3. Wait for timer to expire
4. Verify auto-submit triggers
5. Verify results page shows "Tiempo agotado" badge

#### TC-4: Score Calculation
Test with known answer patterns:
- 45/45 correct → 100% → PASS
- 35/45 correct → 78% → PASS
- 32/45 correct → 71% → PASS (edge case: just passing)
- 31/45 correct → 69% → FAIL (edge case: just failing)
- 25/45 correct → 56% → FAIL
- 0/45 correct → 0% → FAIL

#### TC-5: Mobile Responsive
1. Open on iPhone SE (375px width)
2. Navigate to `/test`
3. Verify exam card renders (no horizontal scroll)
4. Take exam on mobile
5. Verify all questions readable
6. Verify options are tappable
7. Verify timer visible
8. Complete exam
9. Verify results page renders correctly

### Launch Checklist
- [ ] All acceptance criteria met
- [ ] All test cases pass
- [ ] Code reviewed by peer
- [ ] Staging environment tested
- [ ] Database backup taken
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] Product owner sign-off
- [ ] Stakeholder notification sent
- [ ] Documentation updated

---

## 12. Future Enhancements (Out of Scope)

These are explicitly **not** included in this phase:

1. **Multiple Regional Exams**: Adding exams from different Comunidades Autónomas
2. **Exam Filtering**: Filter by region, date, difficulty
3. **Search Functionality**: Search within exam questions
4. **Bookmarking**: Save questions for later review
5. **Notes Feature**: Add personal notes to questions
6. **Progress Analytics**: Detailed charts showing improvement over time
7. **Question Bank**: Practice individual topics without full exam
8. **Flashcards**: Study mode for memorization
9. **Social Features**: Compare scores with friends
10. **Export Results**: Download results as PDF

These may be considered for future releases after successful deployment of the single PER exam.

---

## 13. Appendices

### A. Question Topics Breakdown
From `examen-per-nov-25-v01.md`:

| Topic | Questions | Count |
|-------|-----------|-------|
| Nomenclatura náutica | 1-4 | 4 |
| Elementos de amarre y fondeo | 5-6 | 2 |
| Seguridad | 7-10 | 4 |
| Legislación | 11-12 | 2 |
| Balizamiento | 13-17 | 5 |
| Reglamento (RIPA) | 18-27 | 10 |
| Maniobra y navegación | 28-29 | 2 |
| Emergencias en la mar | 30-32 | 3 |
| Meteorología | 33-36 | 4 |
| Teoría de la navegación | 37-41 | 5 |
| Carta de navegación | 42-45 | 4 |
| **TOTAL** | | **45** |

### B. Current vs. Future State Comparison

| Aspect | Current State | After Implementation |
|--------|---------------|---------------------|
| Public Page Exams | 12 fake entries | 1 real exam |
| User Portal Exams | 4 dummy exams | 1 real exam |
| Exam Topics | Math, Biology, Physics | PER (Nautical) |
| Question Count | Varies (29, 35, etc.) | 45 (official) |
| Data Source | Fabricated | Official Nov 2025 PER |
| User Confidence | Low (fake data) | High (authentic) |
| Production Ready | No | Yes |

### C. File Size Analysis
- Source MD file: ~11 KB
- Expected JSON file: ~30-35 KB (with formatting)
- Impact on bundle: Negligible (JSON loaded server-side)
- Page load impact: None (data fetched on page load, not in bundle)

### D. Browser Compatibility
Tested configurations (to be verified in Phase 4):
- Chrome 120+ (Desktop & Mobile)
- Firefox 115+ (Desktop)
- Safari 17+ (Desktop & iOS)
- Edge 120+ (Desktop)

### E. Glossary
- **PER**: Patrón de Embarcaciones de Recreo (Recreational Boat Captain License)
- **Comunidad Autónoma**: Autonomous Community (Spanish regional government)
- **RIPA**: Reglamento Internacional para Prevenir los Abordajes (International Regulations for Preventing Collisions at Sea)
- **TestNauti**: The platform name (Test + Náutico/Nautical)
- **Convocatoria**: Official exam session/sitting
- **Eslora**: Length of vessel

---

## 14. Stakeholder Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Lead Developer | | | |
| QA Lead | | | |
| Project Manager | | | |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-22 | Claude Code | Initial PRD creation |

---

**END OF DOCUMENT**
