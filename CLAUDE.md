# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TestNauti is an exam practice platform built with Next.js 16 that helps students prepare for nautical certification exams (PER, PNB, etc.) using authentic past papers. Production-ready, deployed on Vercel.

**Note**: The Next.js project is in the `code/` subdirectory. Run all commands from there.

## Commands

Run from `code/` directory:

```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Production build
npm run lint             # ESLint check
npm run db:generate      # Generate Prisma client types
npm run db:push          # Push schema changes (dev only)
npm run db:studio        # Open Prisma Studio GUI for data browsing
npm run db:migrate:dev   # Create and apply migrations (development)
npm run db:migrate:deploy # Apply migrations (production)
npm run db:migrate:status # Check migration status
npm run test             # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:coverage    # Run tests with coverage report
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1.1 (App Router) with TypeScript strict mode
- **Auth**: Clerk (`@clerk/nextjs`) with middleware-based route protection
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS 4

### Route Structure
```
/                        # Public landing page
/app/*                   # Protected routes (auth required via middleware)
  /dashboard             # User stats and recent attempts
  /exams                 # Exam catalog grid
  /exams/[examId]        # Exam details page
  /exams/[examId]/test   # Quiz engine (TestClient.tsx)
  /exams/[examId]/results # Results and answer review
/escuelas/*              # Public nautical schools directory
/sign-in, /sign-up       # Clerk auth pages
```

### Key Directories
- `src/app/actions/` - Server actions with Clerk auth checks for DB operations
- `src/data/exams/` - Static JSON files containing exam questions
- `src/lib/db.ts` - Prisma client singleton
- `src/lib/loadExams.ts` - Exam loading utilities
- `src/lib/formatters.ts` - Shared formatting utilities (time, date, score)
- `src/types/exam.ts` - TypeScript interfaces for Exam, Question types
- `prisma/schema.prisma` - Database models (User, ExamAttempt)
- `prisma/migrations/` - Database migration files

### Authentication Flow
All `/app/*` routes are protected by `src/middleware.ts` using Clerk's `createRouteMatcher()`. Server actions in `src/app/actions/examAttempts.ts` verify auth before database operations.

### Data Flow
1. Exams loaded from JSON files via `loadExams()` in `src/lib/loadExams.ts`
2. Quiz state managed client-side in `TestClient.tsx`
3. Results saved via `saveExamAttempt()` server action
4. Dashboard fetches stats via `getUserStats()` server action

## Adding New Exams

Create a JSON file in `src/data/exams/`:
```json
{
  "id": "2024-per-paper1",
  "title": "PER Exam 2024",
  "subject": "Navigation",
  "year": 2024,
  "durationMinutes": 60,
  "totalQuestions": 40,
  "questions": [
    {
      "number": 1,
      "text": "Question text?",
      "options": { "a": "...", "b": "...", "c": "...", "d": "..." },
      "correctAnswer": "b"
    }
  ]
}
```
Exams automatically appear in the catalog.

## Database Schema

Two models in `prisma/schema.prisma`:
- **User**: Linked to Clerk user ID, minimal fields
- **ExamAttempt**: Tracks score, time taken, timed status, completion timestamp

After schema changes:
- Development: `npm run db:migrate:dev` (creates migration + applies)
- Production: `npm run db:migrate:deploy` (applies pending migrations)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

## Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json)

## Documentation

Core documentation files (in `code/` directory):
- **README.md** - Complete project guide (users & developers)
- **START_HERE.md** - Quick overview and getting started
- **CONTEXT.md** - Project goals and philosophy
- **ARCHITECTURE.md** - Technical architecture details
- **DATABASE_SETUP.md** - Detailed database configuration
- **QUICK_DATABASE_SETUP.md** - 5-minute database setup
- **LAUNCH_READY.md** - Production launch checklist

Additional documentation:
- **docs/reference/** - Reference guides (migration, local dev setup, project overview)
- **docs/archive/** - Historical notes (brand updates, SEO implementation, old setup guides)
