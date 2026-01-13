# School Enrichment Script

AI-powered script that scrapes school websites and updates missing fields in the Notion database.

## Setup

1. **Install dependencies** (already done if you ran npm install):
   ```bash
   npm install
   ```

2. **Add Anthropic API key** to `.env.local`:
   ```bash
   echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" >> .env.local
   ```

## Usage

### Dry Run (Preview Changes)
Preview what would be updated without actually modifying Notion:

```bash
npm run enrich-schools
```

### Test on Limited Schools
Test on first 5 schools:

```bash
npm run enrich-schools -- --limit 5
```

### Execute Updates
Actually update Notion database:

```bash
npm run enrich-schools:execute

# Or with limit:
npm run enrich-schools -- --execute --limit 10
```

### Target Specific School
Process a single school by ID:

```bash
npm run enrich-schools -- --school-id "academia-nautica-madrid"
```

## Options

- `--dry-run` - Preview changes without updating (default)
- `--execute` - Actually update Notion database
- `--limit N` - Process only first N schools
- `--school-id ID` - Process only specified school
- `--use-browser` - Use browser rendering (not yet implemented)

## Output

The script generates two files:
- `enrich-schools-report-YYYY-MM-DD.md` - Detailed markdown report
- `enrich-schools-results-YYYY-MM-DD.csv` - CSV export of results

## Cost Estimates

- Per school: ~$0.018 (with prompt caching)
- 100 schools: ~$1.80
- 287 schools (all missing data): ~$2.80

## How It Works

1. **Fetch** schools from Notion that have missing fields
2. **Scrape** each school's website using Cheerio
3. **Extract** data using Claude Haiku AI (intelligent extraction)
4. **Update** Notion with only the missing fields
5. **Report** success/failure with detailed logs

## Safety Features

- Dry-run mode by default (requires --execute to update)
- Never overwrites existing non-empty fields
- Comprehensive error handling
- Rate limiting (respectful crawling)
- Graceful shutdown (Ctrl+C saves partial report)
