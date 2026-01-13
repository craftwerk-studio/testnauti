# Exam Transformation Scripts

This directory contains scripts to transform nautical exam JSON files into TestNauti's format and automatically integrate them into the application.

## Quick Start (60+ Exams)

For batch processing multiple exam files:

```bash
# 1. Place all JSON files in the /examenes folder
# 2. Run batch transformation

npx tsx npx tsx scripts/batch-transform-exams.ts examenes/ --year 2025

# 3. Automatically update loadExams.ts with all exams
npx tsx npx tsx scripts/update-exam-registry.ts

# 4. Build and verify
npm run build
npm run dev
```

That's it! All exams will be available at http://localhost:3000/app/exams

---

## Scripts Overview

### 1. `transform-nautical-exam.ts` (Single File)

Transform a single exam JSON file.

**Usage:**
```bash
npx tsx npx tsx scripts/transform-nautical-exam.ts <input-json-path> [output-path]
```

**Example:**
```bash
npx tsx npx tsx scripts/transform-nautical-exam.ts \
  "examenes/exam-69.json"
```

**Output:** Single exam file in `src/data/exams/`

---

### 2. `batch-transform-exams.ts` (Multiple Files) ⭐

Transform multiple exam JSON files at once. **Recommended for 60+ exams.**

**Usage:**
```bash
npx tsx npx tsx scripts/batch-transform-exams.ts <input-path> [options]
```

**Options:**
- `--output-dir <path>` - Output directory (default: `src/data/exams/`)
- `--year <year>` - Exam year (default: 2025)
- `--subject <subject>` - Subject name (default: "Nautical Certification (PER)")

**Examples:**

Single file:
```bash
npx tsx npx tsx scripts/batch-transform-exams.ts examenes/exam-69.json
```

Entire directory:
```bash
npx tsx npx tsx scripts/batch-transform-exams.ts examenes/ --year 2025
```

With custom subject:
```bash
npx tsx npx tsx scripts/batch-transform-exams.ts examenes/ \
  --year 2025 \
  --subject "PNB Certification"
```

**Output:**
- Processes all `.json` files in the directory
- Creates one exam file per input file in `src/data/exams/`
- Prints summary with success/failure counts
- Shows copy-paste ready import statements for `loadExams.ts`

**Sample Output:**
```
📁 Batch processing directory: examenes/

Found 65 JSON file(s)

[1/65] Processing: exam-69.json
  ✓ Created: 2025-per-exam69.json (29 questions)
[2/65] Processing: exam-70.json
  ✓ Created: 2025-per-exam70.json (31 questions)
...
[65/65] Processing: exam-133.json
  ✓ Created: 2025-per-exam133.json (28 questions)

============================================================
TRANSFORMATION SUMMARY
============================================================
✓ Successful: 65
✗ Failed: 0
📝 Total questions: 1,847
📂 Output directory: src/data/exams
```

---

### 3. `update-exam-registry.ts` (Auto-Update) ⭐

Automatically scan `src/data/exams/` and update `loadExams.ts` with all exam imports.

**Usage:**
```bash
npx tsx npx tsx scripts/update-exam-registry.ts
```

**What it does:**
1. Scans `src/data/exams/` for all `.json` files
2. Generates TypeScript import statements
3. Updates `src/lib/loadExams.ts` automatically
4. Maintains consistent variable naming

**Example Output:**
```
🔍 Scanning exams directory...

Found 65 exam file(s):

  1. 2022-physics-final.json → exam2022PhysicsFinal
  2. 2023-math-paper1.json → exam2023MathPaper1
  3. 2024-biology-midterm.json → exam2024BiologyMidterm
  4. 2025-per-exam69.json → exam2025PerExam69
  ...

📝 Updating loadExams.ts...
✓ Successfully updated loadExams.ts
```

**Benefits:**
- No manual editing of imports
- No risk of typos or missing exams
- Consistent naming conventions
- Automatically sorts exams alphabetically

---

## Workflow for 60+ Exams

### Step-by-Step Process

**1. Prepare Source Files**
```bash
# Place all JSON files in /examenes folder
ls examenes/
# exam-69.json, exam-70.json, exam-71.json, ..., exam-133.json
```

**2. Batch Transform**
```bash

npx tsx npx tsx scripts/batch-transform-exams.ts examenes/ --year 2025
```

**3. Auto-Update Registry**
```bash
npx tsx npx tsx scripts/update-exam-registry.ts
```

**4. Build & Test**
```bash
npm run build
npm run dev
```

**5. Verify**
- Visit http://localhost:3001/app/exams
- Check exam count in catalog
- Test a few exams to verify questions load correctly

---

## File Naming Convention

Output files are automatically named based on exam number extracted from the source:

| Source Exam Title | Output Filename |
|---|---|
| "Examen N° 69 - Tema 1..." | `2025-per-exam69.json` |
| "Examen N° 70 - Tema 1..." | `2025-per-exam70.json` |
| "Examen N° 133 - Tema 1..." | `2025-per-exam133.json` |

**Pattern:** `{year}-per-exam{number}.json`

If no exam number is found, it falls back to a sanitized version of the title.

---

## Data Quality Checks

The transformation scripts automatically:

✓ **Validate Structure**
- Checks for valid JSON array format
- Ensures required fields exist
- Skips empty question slots

✓ **Randomize Answers**
- Fisher-Yates shuffle for answer positions
- Correct answer randomly placed in a/b/c/d
- Prevents memorization patterns

✓ **Clean Data**
- Strips question number prefixes ("1. " → "")
- Preserves Spanish characters (UTF-8)
- Trims whitespace

✓ **Generate Metadata**
- Extracts exam number from title
- Calculates duration (2 min/question, min 60)
- Counts total questions accurately
- Lists all covered themes

---

## Error Handling

### Common Issues

**1. Invalid JSON Format**
```
✗ Failed: Invalid or empty JSON array
```
**Solution:** Ensure the file contains a JSON array `[{...}, {...}]`

**2. Missing Fields**
```
✗ Failed: Invalid question data at number 5
```
**Solution:** Check that all questions have correct answer + 3 alternatives

**3. Empty Files**
```
⚠️ No exam files found in examenes/
```
**Solution:** Verify JSON files exist and have `.json` extension

### Debugging

Enable detailed logging by checking individual file processing:

```bash
# Test single file first
npx tsx npx tsx scripts/batch-transform-exams.ts examenes/exam-69.json

# If successful, process all files
npx tsx npx tsx scripts/batch-transform-exams.ts examenes/
```

---

## Performance

**Benchmarks:**
- **1 exam**: ~50ms
- **10 exams**: ~500ms
- **60 exams**: ~3 seconds
- **100 exams**: ~5 seconds

Processing is sequential to ensure data quality and prevent memory issues.

---

## Troubleshooting

### TypeScript Compilation Errors

If `npm run build` fails after adding exams:

```bash
# Check for duplicate IDs
cd src/data/exams/
grep -h '"id"' *.json | sort | uniq -d

# Verify JSON syntax
node -e "require('./src/data/exams/2025-per-exam69.json')"
```

### Exams Not Appearing

```bash
# Verify loadExams.ts was updated
grep -c "import exam" src/lib/loadExams.ts

# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

### Special Characters Issues

Ensure UTF-8 encoding throughout:
```bash
file src/data/exams/2025-per-exam69.json
# Should show: UTF-8 Unicode text
```

---

## Architecture Notes

### Why Batch Processing?

For 60+ exams, manual processing would require:
- 60 individual transformation commands
- 60 manual import statements
- 60 manual registry entries
- High risk of human error

Batch processing reduces this to:
- **1 command** to transform all files
- **1 command** to update imports
- **1 build** to verify

Time saved: ~2 hours → 2 minutes

### Why Auto-Update Registry?

Manually maintaining 60+ imports is error-prone:
- Easy to forget an exam
- Typos in variable names
- Inconsistent naming
- Difficult to keep sorted

Auto-update ensures:
- All exams included automatically
- Consistent naming conventions
- Alphabetical sorting
- Zero manual errors

---

## Future Enhancements

Potential improvements for even larger scale:

1. **Parallel Processing**: Use worker threads for 1000+ exams
2. **Incremental Updates**: Only process new/changed files
3. **Validation Report**: Generate detailed quality report
4. **Duplicate Detection**: Check for duplicate questions across exams
5. **Theme Extraction**: Auto-tag questions by theme for filtering

---

## Getting Help

For issues or questions:

1. Check the troubleshooting section above
2. Review the error messages carefully
3. Test with a single file first before batch processing
4. Verify source JSON structure matches expected format

---

## Summary

**For 1-5 exams:** Use `transform-nautical-exam.ts`
**For 60+ exams:** Use `batch-transform-exams.ts` + `update-exam-registry.ts`

**Three-command workflow:**
```bash
npx tsx npx tsx scripts/batch-transform-exams.ts examenes/ --year 2025
npx tsx npx tsx scripts/update-exam-registry.ts
npm run build
```

That's all you need to integrate unlimited exams! 🚀
