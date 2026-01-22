# PRD: Reactivate Tests Section with Real PER Data

## Introduction

Replace placeholder test data in TestNauti.co with authentic PER (Patrón de Embarcaciones de Recreo) exam content from November 2025. This involves converting the existing markdown exam file to the platform's JSON format, updating both the public marketing page and authenticated user portal, and adding messaging about future regional exam expansion.

**Current State:**
- Public `/test` page shows 12 fake placeholder exams from `src/data/pastExams.ts`
- User portal `/app/exams` loads 4 dummy JSON files (math, biology, physics topics)
- Real PER exam exists in markdown format at `data/exams/examen-per-nov-25-v01.md`

**Target State:**
- One authentic PER exam (45 questions, November 2025) displayed across all sections (web and portal)
- Dummy exams hidden from UI (files preserved for data integrity)
- Clear messaging about upcoming regional exams

## Goals

- Convert the November 2025 PER exam from markdown to validated JSON format
- Display authentic exam content on public test page (single exam)
- Enable registered users to practice with real PER exam questions
- Maintain existing UI/UX while updating data source
- Add informational banner about future Comunidad Autónoma exams
- Create validation tooling for future exam imports
- Write automated tests to ensure exam functionality

## User Stories

### US-001: Create Exam Validation Script
**Description:** As a developer, I want a validation script so that I can verify exam JSON files are correctly formatted before deployment.

**Acceptance Criteria:**
- [ ] Create `scripts/exams/validate-exam.ts` script
- [ ] Validates all required fields: id, title, subject, year, durationMinutes, totalQuestions, description, questions
- [ ] Validates each question has: number, text, options (a,b,c,d), correctAnswer
- [ ] Validates correctAnswer is one of 'a', 'b', 'c', 'd'
- [ ] Validates question count matches totalQuestions
- [ ] Outputs clear error messages for any failures
- [ ] Exits with code 0 on success, 1 on failure
- [ ] Typecheck passes

### US-002: Convert PER Exam Markdown to JSON
**Description:** As a developer, I need the November 2025 PER exam in JSON format so it can be loaded by the platform.

**Acceptance Criteria:**
- [ ] Create `code/src/data/exams/2025-per-nov-v01.json`
- [ ] Contains all 45 questions from `data/exams/examen-per-nov-25-v01.md`
- [ ] Each question has correct text, options (a,b,c,d), and correctAnswer
- [ ] Correct answers match official answer key from source file
- [ ] Special characters (ñ, °, ', etc.) render correctly
- [ ] JSON validates against `Exam` type in `src/types/exam.ts`
- [ ] Validation script passes with no errors
- [ ] Typecheck passes

### US-003: Update Exam Registry to Show Real Exam
**Description:** As a user, I want to see only the real PER exam in the catalog so I can practice with authentic content.

**Acceptance Criteria:**
- [ ] Update `code/src/lib/loadExams.ts` to import new exam JSON
- [ ] Update examRegistry to include only the real PER exam
- [ ] Comment out (not delete) dummy exam imports for data preservation
- [ ] `loadExams()` returns array with 1 exam
- [ ] `findExamById('2025-per-nov-v01')` returns the PER exam
- [ ] `getUniqueSubjects()` returns `['PER']`
- [ ] `getUniqueYears()` returns `[2025]`
- [ ] Typecheck passes

### US-004: Update Public Test Page Data
**Description:** As a prospective student, I want to see the real PER exam on the public test page so I understand what TestNauti offers.

**Acceptance Criteria:**
- [ ] Update `code/src/data/pastExams.ts` to contain single exam entry
- [ ] Exam displays: "Noviembre 2025", "Nacional", 45 questions, 60 min
- [ ] Exam card shows anchor icon (⚓)
- [ ] Grid layout renders correctly with single item
- [ ] Sort buttons remain visible (no functional change needed)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: Add Future Plans Banner to Public Page
**Description:** As a prospective student, I want to know that more regional exams are coming so I understand the platform's roadmap.

**Acceptance Criteria:**
- [ ] Add informational banner to `code/src/app/test/page.tsx`
- [ ] Banner positioned after Benefits section, before Available Tests
- [ ] Blue styling: `bg-blue-50`, `border-l-4 border-blue-500`
- [ ] Contains info icon and text about upcoming Comunidad Autónoma exams
- [ ] Mobile responsive (no horizontal scroll)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Update Test Page Description Text
**Description:** As a prospective student, I want accurate description text so I understand what's currently available.

**Acceptance Criteria:**
- [ ] Update "Tests Disponibles" section description in `code/src/app/test/page.tsx`
- [ ] New text reflects single exam availability
- [ ] Mentions future additions coming soon
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-007: Verify User Portal Exam Catalog
**Description:** As a registered student, I want to see the real PER exam in my exam catalog.

**Acceptance Criteria:**
- [ ] `/app/exams` page shows exactly 1 exam
- [ ] Stats bar shows "1 examen disponible"
- [ ] Exam card displays: "PER" badge, "2025", "Examen PER - Noviembre 2025"
- [ ] Shows "45 preguntas", "60 min"
- [ ] "Empezar práctica" button navigates to `/app/exams/2025-per-nov-v01`
- [ ] Verify in browser using dev-browser skill

### US-008: Verify Exam Test Flow
**Description:** As a registered student, I want to take the real PER exam so I can practice for my certification.

**Acceptance Criteria:**
- [ ] Exam detail page loads at `/app/exams/2025-per-nov-v01`
- [ ] Timer checkbox option works
- [ ] "Comenzar el examen" navigates to test page
- [ ] All 45 questions load and display correctly
- [ ] Options (a,b,c,d) render properly
- [ ] Keyboard shortcuts work (A/B/C/D or 1/2/3/4)
- [ ] Timer counts down from 60 minutes when enabled
- [ ] Submit button works
- [ ] Verify in browser using dev-browser skill

### US-009: Verify Results and Scoring
**Description:** As a registered student, I want accurate scoring so I know how I performed.

**Acceptance Criteria:**
- [ ] Results page shows correct score calculation
- [ ] Pass threshold is 70% (32/45 questions minimum to pass)
- [ ] All 45 questions shown in answer review
- [ ] Correct answers highlighted in green
- [ ] Incorrect user answers shown in red
- [ ] Percentage calculation is accurate
- [ ] Verify in browser using dev-browser skill

### US-010: Verify Dashboard Integration
**Description:** As a registered student, I want my PER exam attempts tracked in my dashboard.

**Acceptance Criteria:**
- [ ] Dashboard shows attempts for PER exam
- [ ] Exam title displays as "Examen PER - Noviembre 2025"
- [ ] Stats (total attempts, average score, best score) calculate correctly
- [ ] "Practicar de nuevo" navigates to the PER exam
- [ ] Verify in browser using dev-browser skill

### US-011: Write Automated Tests for Exam Loading
**Description:** As a developer, I want automated tests so I can catch regressions in exam loading functionality.

**Acceptance Criteria:**
- [ ] Create/update tests in `code/src/__tests__/` or appropriate test directory
- [ ] Test `loadExams()` returns exactly 1 exam
- [ ] Test `findExamById('2025-per-nov-v01')` returns correct exam
- [ ] Test `findExamById('nonexistent')` returns undefined
- [ ] Test exam has 45 questions
- [ ] Test all questions have valid correctAnswer ('a'|'b'|'c'|'d')
- [ ] All tests pass with `npm run test`

### US-012: Write Automated Tests for Score Calculation
**Description:** As a developer, I want automated tests for scoring so I can ensure pass/fail logic is correct.

**Acceptance Criteria:**
- [ ] Test 45/45 correct = 100% = PASS
- [ ] Test 32/45 correct = 71% = PASS (edge case)
- [ ] Test 31/45 correct = 69% = FAIL (edge case)
- [ ] Test 0/45 correct = 0% = FAIL
- [ ] Tests cover the 70% threshold correctly
- [ ] All tests pass with `npm run test`

## Functional Requirements

- FR-1: Create validation script at `scripts/exams/validate-exam.ts` that checks JSON structure
- FR-2: Create exam JSON file `code/src/data/exams/2025-per-nov-v01.json` with all 45 questions
- FR-3: Update `loadExams.ts` to return only the real PER exam (comment out dummy imports)
- FR-4: Update `pastExams.ts` to contain single exam entry for public page
- FR-5: Add future plans banner to `/test` page with blue styling
- FR-6: Update description text in Available Tests section
- FR-7: Ensure all exam pages work with new exam ID `2025-per-nov-v01`
- FR-8: Score calculation must use 70% pass threshold (32/45 minimum)
- FR-9: Write automated tests for exam loading functions
- FR-10: Write automated tests for score calculation logic

## Non-Goals

- Deleting dummy exam JSON files (preserve for data integrity)
- Adding multiple exams from different regions
- Implementing exam filtering or search
- Changing database schema
- Modifying authentication flow
- Adding new UI components (reuse existing)
- Performance optimization
- SEO changes

## Technical Considerations

- JSON structure must match `Exam` interface in `src/types/exam.ts`
- Exam data loaded server-side via `loadExams()` utility
- No database changes required - ExamAttempt model already supports any examId
- Dummy exam files preserved but imports commented out in registry
- UTF-8 encoding required for Spanish characters
- Existing test infrastructure uses Vitest

## Design Considerations

- Reuse existing exam card components (no styling changes)
- Future plans banner follows existing info box patterns
- Single exam should render cleanly in existing grid layouts
- Mobile responsive behavior unchanged

## Success Metrics

- All 45 questions correctly converted and validated
- Public test page renders single exam without layout issues
- User can complete full exam flow (start → answer → submit → results)
- Pass/fail threshold calculates correctly at 70%
- Dashboard tracks attempts properly
- All existing tests pass
- New automated tests pass
- No console errors in browser

## Open Questions

- Should we add topic/category tags to questions for future filtering?
- Should exam metadata include month field for better sorting?
- Should we track which questions users commonly miss for analytics?
