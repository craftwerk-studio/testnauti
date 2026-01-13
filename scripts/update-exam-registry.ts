import fs from 'fs';
import path from 'path';

/**
 * Automatically update loadExams.ts with all exam files in src/data/exams/
 * This script scans the exams directory and generates the import statements and registry array
 */

const EXAMS_DIR = path.join(__dirname, '../code/src/data/exams');
const LOAD_EXAMS_FILE = path.join(__dirname, '../code/src/lib/loadExams.ts');

/**
 * Generate a valid TypeScript variable name from filename
 */
function generateVarName(filename: string): string {
  return 'exam' + filename
    .replace('.json', '')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Scan exams directory and return all JSON files with metadata
 */
function scanExamsDirectory(): Array<{ filename: string; varName: string; path: string }> {
  if (!fs.existsSync(EXAMS_DIR)) {
    console.error(`❌ Exams directory not found: ${EXAMS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(EXAMS_DIR)
    .filter(f => f.endsWith('.json'))
    .sort(); // Sort alphabetically for consistent ordering

  return files.map(filename => ({
    filename,
    varName: generateVarName(filename),
    path: `@/data/exams/${filename}`
  }));
}

/**
 * Generate the imports section
 */
function generateImports(exams: ReturnType<typeof scanExamsDirectory>): string {
  return exams
    .map(exam => `import ${exam.varName} from '${exam.path}';`)
    .join('\n');
}

/**
 * Generate the registry array
 */
function generateRegistry(exams: ReturnType<typeof scanExamsDirectory>): string {
  const entries = exams
    .map(exam => `  ${exam.varName} as Exam,`)
    .join('\n');

  return `const examRegistry: Exam[] = [\n${entries}\n];`;
}

/**
 * Update the loadExams.ts file
 */
function updateLoadExamsFile(exams: ReturnType<typeof scanExamsDirectory>): void {
  // Read current file
  let content = fs.readFileSync(LOAD_EXAMS_FILE, 'utf-8');

  // Generate new imports and registry
  const newImports = generateImports(exams);
  const newRegistry = generateRegistry(exams);

  // Replace imports section (between "Import all exam JSON files" comment and empty line before examRegistry)
  const importsRegex = /(\/\/ Import all exam JSON files[\s\S]*?)(const examRegistry)/;
  content = content.replace(
    importsRegex,
    `// Import all exam JSON files\n// To add a new exam: 1) Create JSON file in src/data/exams/ 2) Run: npx tsx scripts/update-exam-registry.ts\n${newImports}\n\n/**\n * Registry of all available exams\n * Add new exam imports here - they will automatically appear in the catalog\n */\n$2`
  );

  // Replace registry array
  const registryRegex = /const examRegistry: Exam\[] = \[[^\]]*\];/s;
  content = content.replace(registryRegex, newRegistry);

  // Write back
  fs.writeFileSync(LOAD_EXAMS_FILE, content, 'utf-8');
}

/**
 * Main function
 */
function main() {
  try {
    console.log('🔍 Scanning exams directory...\n');

    const exams = scanExamsDirectory();

    if (exams.length === 0) {
      console.log('⚠️  No exam files found in', EXAMS_DIR);
      process.exit(0);
    }

    console.log(`Found ${exams.length} exam file(s):\n`);
    exams.forEach((exam, index) => {
      console.log(`  ${index + 1}. ${exam.filename} → ${exam.varName}`);
    });

    console.log('\n📝 Updating loadExams.ts...');
    updateLoadExamsFile(exams);

    console.log('✓ Successfully updated loadExams.ts');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Review the changes in src/lib/loadExams.ts');
    console.log('2. Run: npm run build');
    console.log('3. Test the exams at: http://localhost:3000/app/exams');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
