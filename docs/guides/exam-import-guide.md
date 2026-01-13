# Quick Guide: Importing 60+ Exams

## Three-Command Workflow

```bash
# 1. Transform all exams (in /examenes folder)

npx tsx scripts/batch-transform-exams.ts examenes/ --year 2025

# 2. Auto-update imports in loadExams.ts
npx tsx scripts/update-exam-registry.ts

# 3. Build and test (from code/ directory)
cd code/
npm run build
npm run dev
```

Open http://localhost:3000/app/exams to see all exams!

---

## What Each Script Does

### 1. `batch-transform-exams.ts`
- ✓ Processes all `.json` files in `/examenes` folder
- ✓ Converts each to TestNauti format
- ✓ Randomizes answer positions
- ✓ Preserves Spanish characters
- ✓ Saves to `code/src/data/exams/`

**Output:** 60 exam files in the correct format

### 2. `update-exam-registry.ts`
- ✓ Scans `src/data/exams/` directory
- ✓ Generates all import statements
- ✓ Updates `src/lib/loadExams.ts` automatically
- ✓ No manual editing needed!

**Output:** Updated `loadExams.ts` with all 60+ exams

### 3. `npm run build`
- ✓ Validates TypeScript types
- ✓ Ensures no errors
- ✓ Confirms all exams load correctly

**Output:** Production-ready application

---

## File Placement

**Before transformation:**
```
/examenes/
  ├── exam-69.json
  ├── exam-70.json
  ├── exam-71.json
  └── ... (60 more files)
```

**After transformation:**
```
code/src/data/exams/
  ├── 2025-per-exam69.json
  ├── 2025-per-exam70.json
  ├── 2025-per-exam71.json
  └── ... (60 more files)
```

---

## Expected Results

✓ **Batch Processing:** ~3 seconds for 60 exams
✓ **Auto-Import:** ~1 second to update loadExams.ts
✓ **Build Time:** ~30 seconds
✓ **Total Time:** Under 1 minute to import 60+ exams!

Compare to manual work: ~2 hours saved

---

## Verification Checklist

After running the three commands:

- [ ] Check `code/src/data/exams/` has 60+ JSON files
- [ ] Check `code/src/lib/loadExams.ts` has 60+ import statements
- [ ] Run `npm run build` - should succeed with no errors
- [ ] Visit http://localhost:3000/app/exams - should show all exams
- [ ] Test 2-3 exams to verify questions display correctly

---

## Troubleshooting

**If build fails:**
```bash
# Clear cache and retry
rm -rf .next
npm run build
```

**If exams don't appear:**
```bash
# Verify loadExams.ts was updated
cat code/src/lib/loadExams.ts | grep "import exam" | wc -l
# Should show: 60+ (number of exams)
```

**If Spanish characters look wrong:**
```bash
# Check UTF-8 encoding
file code/src/data/exams/2025-per-exam69.json
# Should show: UTF-8 Unicode text
```

---

## For Future Imports

Same process works for any number of exams:

1. Add new JSON files to `/examenes/`
2. Run the three commands again
3. New exams automatically added!

The scripts handle:
- Duplicate detection
- Consistent naming
- Automatic sorting
- Error reporting

---

## Need Help?

See detailed documentation: `code/scripts/README.md`

Questions? Check the troubleshooting section or review error messages carefully.
