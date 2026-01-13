# TestNauti - Real Exam Practice Platform

A comprehensive Next.js web application where students practice with authentic past exam papers. Built with TypeScript, Next.js 15, Clerk authentication, and PostgreSQL.

## 🎯 What is TestNauti?

TestNauti helps students prepare for real exams by practicing with authentic past papers. All questions are multiple-choice (4 options, single correct answer), mimicking actual exam conditions.

**Core Value**: Practice with real past exams → feel ready for the actual test.

## ✨ Features

### Phase 1-6 (Complete MVP)
- ✅ **Exam Catalog** - Browse available past papers by subject and year
- ✅ **Exam Details** - View exam information before starting
- ✅ **Interactive Quiz Engine** - Take tests one question at a time
- ✅ **Progress Tracking** - Visual progress bar and question navigation
- ✅ **Optional Timer** - Practice under realistic timed conditions
- ✅ **Auto-Submit** - Automatic submission when time expires
- ✅ **Question Navigation** - Sidebar with clickable question numbers (desktop & mobile)
- ✅ **Detailed Results** - See score, review all answers, identify mistakes
- ✅ **Progress Tracking** - All attempts saved to database
- ✅ **Dashboard** - View stats, recent attempts, and improvement over time
- ✅ **User Authentication** - Secure sign-in with Clerk
- ✅ **Responsive Design** - Mobile-first, works on all devices

### Future Enhancements (Post-Launch)
- Advanced analytics and insights (weak areas, improvement trends)
- Explanations for correct answers
- Subject/category filtering
- Export results (PDF/CSV)
- Optional: Admin UI for exam management (if scaling requires it)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Clerk Authentication

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your API keys

### 3. Set Up Database

Choose one:
- **Vercel Postgres** (recommended for Vercel deployments)
- **Supabase** (free alternative)

See **QUICK_DATABASE_SETUP.md** for step-by-step instructions.

### 4. Configure Environment Variables

Create `.env` in the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database (from Step 3)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

### 5. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              # Landing page
│   │   ├── features/             # Features page
│   │   └── pricing/              # Pricing page
│   ├── app/                      # Protected app area
│   │   ├── dashboard/            # User dashboard with stats
│   │   ├── exams/
│   │   │   ├── page.tsx          # Exam catalog
│   │   │   └── [examId]/
│   │   │       ├── page.tsx      # Exam details
│   │   │       ├── test/         # Quiz engine
│   │   │       └── results/      # Results page
│   │   └── settings/             # User settings
│   ├── actions/
│   │   └── examAttempts.ts       # Server actions for DB
│   ├── sign-in/                  # Clerk sign-in
│   └── sign-up/                  # Clerk sign-up
├── components/
│   ├── MarketingNav.tsx          # Marketing navigation
│   └── AppNav.tsx                # App navigation
├── data/
│   └── exams/                    # JSON exam files
├── lib/
│   ├── db.ts                     # Prisma client
│   └── loadExams.ts              # Exam loading utilities
├── types/
│   └── exam.ts                   # TypeScript types
└── middleware.ts                 # Route protection

prisma/
└── schema.prisma                 # Database schema
```

## 🗄️ Database Schema

### Users
- Linked to Clerk user ID
- Minimal data (ID, email, name)

### ExamAttempts
- Complete attempt history
- Score, percentage, time taken
- Timed/untimed flag
- Auto-submit flag
- Timestamp

See `DATABASE_SETUP.md` for detailed schema information.

## 📊 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio GUI
```

## 🎓 How It Works

### For Students

1. **Browse Exams** - View available past papers
2. **Start Test** - Choose timed or untimed mode
3. **Take Test** - Answer questions one at a time
4. **Navigate** - Jump to any question via sidebar
5. **Submit** - Review all answers before submitting
6. **Review Results** - See score and correct answers
7. **Track Progress** - View history and stats on dashboard

### For Developers

1. **Add Exams** - Drop JSON files in `src/data/exams/`
2. **Auto-Loading** - Exams automatically appear in catalog
3. **Type-Safe** - Full TypeScript support
4. **Server Actions** - Secure database operations
5. **Edge Ready** - Optimized for Vercel Edge

## 🔒 Authentication & Security

- **Clerk** handles all authentication
- **Middleware** protects `/app/*` routes
- **Server Actions** validate user ID
- **Database** operations server-side only
- **Environment variables** for sensitive data

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation, large text
- **Tablet**: Responsive grid layouts
- **Mobile**: Collapsible navigation, touch-friendly

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DATABASE_URL`
   - `DIRECT_URL`
4. Deploy!
5. Run `npx prisma db push` with production DATABASE_URL (one-time)

See **MIGRATION_GUIDE.md** for detailed deployment instructions.

## 📚 Documentation

- **LAUNCH_READY.md** - 🚀 Production launch checklist and celebration!
- **README.md** - This file - complete user and developer guide
- **CONTEXT.md** - Project overview, goals, and philosophy
- **ARCHITECTURE.md** - Technical architecture and diagrams
- **QUICK_DATABASE_SETUP.md** - 5-minute database setup guide
- **DATABASE_SETUP.md** - Detailed database configuration
- **MIGRATION_GUIDE.md** - Deployment and migration instructions
- **PHASE_1_SUMMARY.md** through **PHASE_7_SUMMARY.md** - Development history

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Authentication**: Clerk
- **Database**: PostgreSQL + Prisma
- **Icons**: lucide-react
- **Deployment**: Vercel

## 📝 Adding New Exams

**TestNauti uses a simple, version-controlled approach to adding exams:**

### To add a new exam:

1. **Create a JSON file** in `src/data/exams/` following the format below
2. **Use a unique filename** matching the exam ID (e.g., `2025-math-paper1.json`)
3. **Commit and deploy** (or push to trigger auto-deployment)

**That's it!** The new exam will appear immediately in the catalog.

### Exam JSON Format:

```json
{
  "id": "2024-math-paper1",
  "title": "Mathematics Paper 1 – 2024",
  "subject": "Mathematics",
  "year": 2024,
  "durationMinutes": 120,
  "totalQuestions": 40,
  "description": "Official past paper from 2024.",
  "questions": [
    {
      "number": 1,
      "text": "What is 2 + 2?",
      "options": {
        "a": "3",
        "b": "4",
        "c": "5",
        "d": "6"
      },
      "correctAnswer": "b"
    }
  ]
}
```

### Why Manual JSON Files?

- ✅ **Simple & Reliable**: No complex admin UI to maintain
- ✅ **Version Control**: Full history of all exam changes in git
- ✅ **Free Tier**: Stays on Clerk free plan (no custom roles needed)
- ✅ **Type-Safe**: JSON validated against TypeScript types
- ✅ **Fast**: Exams load instantly (no database queries)

This approach works perfectly for MVP and can scale to hundreds of exams. An admin UI can be added later if needed.

## 🐛 Troubleshooting

### "Can't reach database server"
→ Check `DATABASE_URL` in `.env`

### "Environment variable not found"
→ Restart dev server after creating `.env`

### "PrismaClient is unable to run in browser"
→ Make sure Prisma is only used in server components

See **DATABASE_SETUP.md** for more troubleshooting.

## 🎯 Current Status

**Phase 7 Complete** - Production-Ready Launch Version! 🎉

TestNauti is a complete, fully-functional exam practice platform featuring:
- ✅ Beautiful exam catalog and detail pages
- ✅ Interactive quiz engine with question navigation
- ✅ Optional timer with auto-submit
- ✅ Comprehensive progress tracking and dashboard
- ✅ Results review with detailed feedback
- ✅ PostgreSQL database integration
- ✅ Clerk authentication
- ✅ Mobile-responsive design
- ✅ Complete documentation

**🚀 Ready to help students succeed!**

New exams can be added instantly by creating JSON files in `src/data/exams/` and deploying. Simple, version-controlled, and reliable.

## 🔮 Future Enhancements (Post-Launch)

- Advanced analytics dashboard (weak areas, improvement trends over time)
- Answer explanations and study tips
- Subject/category filtering
- Social features (leaderboards, study groups)
- Export functionality (PDF/CSV reports)
- Mobile app (React Native)
- Optional: Admin UI for exam management (if needed at scale)

## 📄 License

MIT

## 🤝 Contributing

This is a learning project. Feel free to fork and customize for your needs!

## 📞 Support

- Check documentation files in the project root
- Review phase summaries for technical details
- See `DATABASE_SETUP.md` for database issues

---

**Built with ❤️ for students preparing for exams**
