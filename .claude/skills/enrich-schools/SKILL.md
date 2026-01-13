---
name: enrich-schools
description: Run the school enrichment script to update Notion database by scraping websites and extracting data with AI
user-invocable: true
disable-model-invocation: true
allowed-tools: Bash(cd:*), Bash(npm:*), Read
---

# School Enrichment Script

AI-powered tool to enrich nautical school data in Notion by scraping their websites and intelligently extracting missing information using Claude.

## Quick Start

### Dry Run (Preview Changes)
```bash
cd scripts/schools/enrich-schools
npm run start
```
Shows what would be updated without actually modifying Notion.

### Execute (Update Notion)
```bash
cd scripts/schools/enrich-schools
npm run execute
```
Actually updates the Notion database with scraped data.

### Test Mode (5 Schools)
```bash
cd scripts/schools/enrich-schools
npm run test              # Dry run on 5 schools
npm run test:execute      # Execute on 5 schools
```

## How It Works

1. **Fetch** schools from Notion database that have missing fields
2. **Scrape** each school's website (with retry logic)
3. **Extract** data using Claude AI (address, courses, social media, etc.)
4. **Update** Notion with only the missing fields (non-destructive)
5. **Generate** comprehensive reports (markdown + CSV)

## What Gets Updated

The script extracts and updates these fields if they're empty in Notion:

- **Address** - Physical address from website
- **City** - City name
- **Area** - Comunidad Autónoma (region)
- **Location** - Formatted address for maps
- **Description** - Brief description of the school
- **Email** - Contact email
- **Services** - Courses offered (PER, PNB, PY, CY, etc.)
- **Social Media** - Facebook, Instagram, LinkedIn, Twitter/X URLs

**Important**: The script ONLY updates fields that are currently empty. Existing data is never overwritten.

## CLI Options

- `--execute` - Actually update Notion (without this, it's a dry run)
- `--limit N` - Process only first N schools (useful for testing)

Examples:
```bash
npm run start -- --limit 10        # Preview 10 schools
npm run execute -- --limit 5       # Update 5 schools
```

## Requirements

### Environment Variables

Create `.env` file in `scripts/schools/enrich-schools/` directory:

```env
NOTION_TOKEN=secret_xxx...
ANTHROPIC_API_KEY=sk-ant-xxx...
NOTION_ESCUELAS_DB_ID=xxx...
```

### Dependencies

Already installed if you ran the script before:
```bash
cd scripts/schools/enrich-schools
npm install
```

## Output

After running, you'll find two reports in `scripts/schools/enrich-schools/`:

1. **Markdown Report** (`enrich-schools-report-YYYY-MM-DD.md`)
   - Summary statistics
   - Success/failure breakdown
   - Cost analysis
   - Updated fields distribution
   - Recommendations

2. **CSV Export** (`enrich-schools-results-YYYY-MM-DD.csv`)
   - Row-by-row results
   - Importable to spreadsheet

## Cost Estimates

Based on Claude 3 Haiku pricing:
- **Per school**: ~$0.003-$0.008 (average $0.004)
- **100 schools**: ~$0.40-$0.80
- **All 137 schools**: ~$0.55-$1.10

The script uses Claude 3 Haiku (`claude-3-haiku-20240307`) for cost efficiency with prompt caching enabled.

## Typical Results

From recent run:
- **Success rate**: 74% (102/137 schools)
- **Average time**: 6.3 seconds per school
- **Total cost**: $0.59 for 137 schools
- **Most common updates**: Services (102), Description (98), City/Area/Location (82)

**Common failures**:
- 404 errors (broken websites)
- 403 forbidden (firewall blocks)
- Fetch failures (offline sites)
- Notion validation errors (commas in select fields)

## Workflow

When you invoke `/enrich-schools`, I'll:

1. Ask which mode you want (dry-run or execute)
2. Optionally ask if you want to limit to N schools
3. Change to the script directory
4. Run the appropriate npm command
5. Monitor progress and show output
6. Display summary when complete
7. Show paths to generated reports

## Troubleshooting

### "NOTION_TOKEN is not defined"
Make sure `.env` file exists in `scripts/schools/enrich-schools/` with all required variables.

### "Invalid select option, commas not allowed"
Some schools return course descriptions with commas which Notion's multi-select doesn't allow. These are logged as validation errors - you'll need to manually fix them in Notion.

### "fetch failed" errors
Some school websites are offline, have aggressive firewalls, or block automated requests. These schools will need manual data entry.

### Script runs but no updates
Check that you used `--execute` flag. Without it, the script runs in dry-run mode (preview only).

## Advanced Usage

For detailed information about:
- Architecture and how the AI extraction works
- Customizing extracted fields
- Modifying the AI prompts
- Adding new data sources
- Cost optimization strategies

See [USAGE.md](USAGE.md) for comprehensive documentation.

## Example Session

```
You: /enrich-schools

Me: I'll help you run the school enrichment script.

    Which mode would you like?
    • Dry run (preview changes without updating)
    • Execute (actually update Notion)

You: Execute

Me: How many schools? (Enter number or press Enter for all 137)

You: 10

Me: Running enrichment on 10 schools with actual updates...

[Shows progress and output]

✅ Complete! Updated 8/10 schools successfully.
Total cost: $0.03

Reports saved:
- scripts/schools/enrich-schools/enrich-schools-report-2026-01-12.md
- scripts/schools/enrich-schools/enrich-schools-results-2026-01-12.csv
```
