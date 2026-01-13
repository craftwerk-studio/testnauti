# School Data

Raw school data files and extractions.

## Files

- `schools-list-*.json` - School data exports from Notion
- `schools-list-*.csv` - School data in CSV format

## Data Sources

- Manual curation
- Web scraping
- Official registries (DGMM, Autonomous Communities)

## Processing

Process this data with:

```bash
cd scripts/schools/enrich-schools/
npm run execute
```

## Schema

School data typically includes:
- Name
- Website URL
- Address & Location
- Courses offered (PER, PNB, PY, CY)
- Contact information
- Social media links

See `scripts/schools/enrich-schools/types.ts` for detailed schema.
