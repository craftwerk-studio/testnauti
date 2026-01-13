# School Scripts

Scripts for managing nautical school data.

## Available Scripts

### 1. Enrich Schools (`enrich-schools/`)

AI-powered tool to enrich school data by scraping websites and extracting information.

```bash
cd scripts/schools/enrich-schools/
npm install
npm run start              # Dry run (preview changes)
npm run execute            # Update Notion database
```

See [enrich-schools/README.md](enrich-schools/README.md) for full documentation.

### 2. Notion Setup (`notion-setup/`)

Scripts to set up and configure Notion database for schools.

```bash
cd scripts/schools/notion-setup/
npm install
node import-schools.js
```

See [notion-setup/README.md](notion-setup/README.md) for details.

## Requirements

- Node.js 18+
- API keys (see `.env` files in each script directory)
- Notion database access

## Output

Results and reports are saved to `/docs/reports/`.
