# TestNauti – Project Context

## What is TestNauti?

TestNauti is a web application that helps students prepare for real exams by practicing with authentic past papers.

- Users take full-length practice tests that are exact replicas of previous official exams.
- All questions are multiple-choice with exactly **4 options (a, b, c, d)** and **only one correct answer**.
- The goal is to give students confidence that the questions they practice are relevant and match the real exam format, difficulty, and topics.

## Core Value Proposition

“Practice with real past exams → feel ready for the actual test.”

## Key Features (Current & Planned)

**MVP (already in progress)**
- Browse and select past exams
- Take a full practice test (question-by-question flow)
- Single-answer selection enforced
- Submit → see score + review correct/incorrect answers
- Clean, focused UI that mimics exam conditions

**Near-term**
- Optional timer
- Dashboard with past attempt history
- Basic progress tracking per user

**Future**
- Explanations for answers
- Category/subject filtering
- Mock exam mode vs. practice mode
- Analytics (weak areas, improvement over time)

## Data Model – Exams & Questions

All exams are stored as static JSON files (easy to version control and add new exams over time).

Example structure (`data/exams/2023-math-paper1.json`):

```json
{
  "id": "2023-math-paper1",
  "title": "Mathematics Paper 1 – 2023",
  "subject": "Mathematics",
  "year": 2023,
  "durationMinutes": 120,
  "totalQuestions": 40,
  "description": "Official past paper from the 2023 national exam.",
  "questions": [
    {
      "number": 1,
      "text": "What is the value of 2 + 2 × 3?",
      "options": {
        "a": "8",
        "b": "12",
        "c": "6",
        "d": "10"
      },
      "correctAnswer": "a"
    }
    // ... more questions
  ]
}
We will maintain a folder data/exams/ and add new JSON files whenever a new past paper becomes available.

## Technical Constraints & Decisions

Framework: Next.js 14+ (App Router)
Authentication: Clerk (already integrated with middleware route protection)
Styling: Tailwind CSS
Language: TypeScript (strict mode)
Deployment: Vercel (edge middleware + serverless functions)
State Management: Start simple – React useState/context for quiz flow. Introduce Zustand only if needed.
Database: None in MVP. User progress tracking will be added later (likely Prisma + Postgres or Supabase).
Exam Storage: Static JSON files in the repository (initial approach). Easy to add new exams via PR.

## Route Structure (Protected App Area)

All exam-related features live under the protected /app directory:
text/app
├── dashboard/          → User home, future progress overview
├── exams/
│   ├── page.tsx        → Exam catalog (list of all available exams)
│   ├── [examId]/
│   │   ├── page.tsx    → Exam details + "Start Test" button
│   │   ├── test/
│   │   │   └── page.tsx → The actual quiz engine
│   │   └── results/
│   │       └── page.tsx → Score + answer review (or handled in test page)
├── settings/           → User settings
└── layout.tsx          → App-wide protected layout with navigation
Public marketing routes (/, /features, /pricing, etc.) remain separate.

## Development Philosophy

Incremental & focused: Build one complete flow at a time (catalog → start → test → results).
Keep it simple: Avoid premature complexity (no custom backend until necessary).
Real-exam feel: Clean UI, large readable text, no distractions during test.
Mobile-friendly from day one.

## Current Development Phase Plan

1. ✅ **Data model & exam loading (types + JSON loader)** - COMPLETED
   - TypeScript types defined in `src/types/exam.ts`
   - 3 sample exams created in `src/data/exams/`
   - Load utility created in `src/lib/loadExams.ts`
   - Debug page at `/debug/exams` working perfectly
2. ✅ **Exam catalog page** - COMPLETED
   - Main catalog page at `/app/exams` with beautiful card layout
   - Responsive design (desktop 3-col, tablet 2-col, mobile 1-col)
   - Stats bar showing exam count and features
   - "Start Practice" buttons linking to exam detail pages
   - "How it works" info section
3. ✅ **Exam detail / start page** - COMPLETED
   - Detail page at `/app/exams/[examId]` with full exam information
   - Breadcrumb navigation back to catalog
   - Clean, focused layout with exam metadata
   - "Before You Start" instructions section
   - Prominent "Start Test" button linking to test page
   - "Exam Not Found" error state with friendly message
4. ✅ **Quiz engine core** - COMPLETED
   - Interactive test page at `/app/exams/[examId]/test`
   - One question at a time with radio button options
   - Previous/Next navigation with progress bar
   - Answer tracking and state management
   - Submit functionality at last question
   - Results page at `/app/exams/[examId]/results`
   - Detailed score display and answer review
5. ✅ **Timer + UX polish** - COMPLETED
   - Optional countdown timer (toggleable on detail page)
   - Auto-submit when time expires
   - Question navigation sidebar (desktop) and overlay (mobile)
   - Clickable question numbers with status indicators
   - Time taken display on results
   - Enhanced retake functionality
6. ✅ **User progress tracking** - COMPLETED
   - Prisma + PostgreSQL database integration
   - Automatic attempt saving with full metadata
   - Comprehensive dashboard with stats and recent attempts
   - Enhanced results page with confirmation
   - Complete setup documentation
7. ✅ **Final polish & production readiness** - COMPLETED
   - Complete documentation review
   - Mobile responsiveness verification
   - Empty state handling
   - All user flows tested and verified
8. **Launch & manual exam management** - CURRENT
   - New exams are added by placing JSON files in `src/data/exams/` and deploying
   - This keeps us on Clerk free tier (no custom roles needed) and maintains full version control
   - Simple, reliable workflow: create JSON → commit → deploy → exam appears in catalog
   - Future: May add admin UI if scaling requires it, but manual process works perfectly for MVP