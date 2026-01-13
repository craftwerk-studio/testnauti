# TestNauti

**Exam practice platform for nautical certifications in Spain**

TestNauti helps students prepare for nautical certification exams (PER, PNB, PY, CY) using authentic past papers and comprehensive practice tests.

---

## Project Structure

```
TestNauti/
├── code/              # Next.js application (see code/README.md)
├── scripts/           # Utility scripts (see scripts/README.md)
├── data/              # Source data files (see data/README.md)
├── docs/              # Project documentation (see docs/README.md)
├── .claude/           # Claude Code configuration
├── CLAUDE.md          # Instructions for Claude Code
└── README.md          # This file
```

---

## Quick Start

### Running the Application

```bash
cd code/
npm install
npm run dev
```

Visit http://localhost:3000

Full setup instructions: [code/START_HERE.md](code/START_HERE.md)

### Using Scripts

```bash
# Transform exam data
npx tsx scripts/exams/batch-transform-exams.ts data/exams/ --year 2025

# Enrich school data
cd scripts/schools/enrich-schools/
npm install
npm run start
```

Full documentation: [scripts/README.md](scripts/README.md)

---

## Documentation

- **[Getting Started](code/START_HERE.md)** - Quick overview and setup
- **[Application Guide](code/README.md)** - Complete development guide
- **[Architecture](code/ARCHITECTURE.md)** - Technical architecture
- **[Scripts](scripts/README.md)** - All utility scripts
- **[Data](data/README.md)** - Data organization
- **[Documentation Index](docs/README.md)** - All guides and research

---

## Key Features

- 🎯 **Exam Practice** - Authentic past papers and practice tests
- 🏫 **School Directory** - Find nautical schools across Spain
- 📊 **Progress Tracking** - Monitor your learning progress
- 🔐 **Secure Authentication** - Clerk-based user management
- 📱 **Responsive Design** - Works on all devices

---

## Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript (strict mode)
- **Auth:** Clerk
- **Database:** PostgreSQL + Prisma ORM
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel

---

## Contributing

This is a private project. For questions or issues, contact the maintainers.

---

## License

Proprietary - All rights reserved
