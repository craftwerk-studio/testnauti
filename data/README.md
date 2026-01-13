# Data Directory

Source and raw data files for the TestNauti project.

## Directory Structure

```
data/
├── exams/          # Raw exam JSON files (input for transformation)
└── schools/        # School data extractions and lists
```

## Data Flow

### Exams
1. **Input:** Raw exam files placed in `data/exams/`
2. **Processing:** Transform with `scripts/exams/batch-transform-exams.ts`
3. **Output:** Processed files in `code/src/data/exams/`
4. **Consumption:** Loaded by application via `code/src/lib/loadExams.ts`

### Schools
1. **Input:** School data in `data/schools/`
2. **Processing:** Enrich with `scripts/schools/enrich-schools/`
3. **Output:** Updated in Notion database
4. **Consumption:** Application fetches from Notion API

## File Formats

### Exam Files
Raw exam JSON files exported from external sources. Format varies by source.

### School Files
CSV/JSON files with school information (name, website, location, etc.).

## Important Notes

- This directory contains **source/raw data** - do not modify manually
- Processed data goes to `code/src/data/` directory
- Add new data files here, then run appropriate transformation scripts
- See [scripts/README.md](../scripts/README.md) for processing instructions
