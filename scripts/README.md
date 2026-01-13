# Scripts

Utility scripts for data transformation, school enrichment, and maintenance tasks.

## Directory Structure

```
scripts/
├── exams/              # Exam transformation scripts
│   ├── batch-transform-exams.ts
│   ├── transform-nautical-exam.ts
│   ├── update-exam-registry.ts
│   └── README.md
└── schools/            # School data scripts
    ├── enrich-schools/     # AI-powered enrichment
    └── notion-setup/       # Notion database setup
```

## Quick Reference

### Exam Scripts

Transform and import exam data:

```bash
# Transform all exams
npx tsx scripts/exams/batch-transform-exams.ts data/exams/ --year 2025

# Update exam registry
npx tsx scripts/exams/update-exam-registry.ts
```

See [exams/README.md](exams/README.md) for details.

### School Scripts

Enrich school data with AI:

```bash
cd scripts/schools/enrich-schools/
npm run start          # Dry run
npm run execute        # Actually update Notion
```

See [schools/README.md](schools/README.md) for details.

## Running from Root

All scripts should be run from the project root directory.

## Dependencies

Scripts have their own `package.json` files. Install dependencies in each script directory before running.
