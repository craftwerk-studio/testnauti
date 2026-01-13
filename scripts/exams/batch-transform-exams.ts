import fs from 'fs';
import path from 'path';
import type { Exam, Question, QuestionOptions, AnswerOption } from '../../code/src/types/exam';

// Define source data structure
interface SourceBlock {
  Position: string;
  "Exam Title": string;
  Question: string;
  "Correct Answer": string;
  "Alternative Answer 1": string;
  "Alternative Answer 2": string;
  "Alternative Answer 3": string;
  [key: string]: string;
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Strip question number prefix (e.g., "1. Question text" -> "Question text")
 */
function stripQuestionNumber(text: string): string {
  return text.replace(/^\d+\.\s*/, '').trim();
}

/**
 * Extract theme name from exam title
 * "Examen N° 69 - Tema 1. Nomenclatura Náutica" -> "Nomenclatura Náutica"
 */
function extractTheme(examTitle: string): string {
  const match = examTitle.match(/Tema\s+\d+\.\s+(.+)/);
  return match ? match[1] : examTitle;
}

/**
 * Extract exam number from title
 * "Examen N° 69 - Tema 1. Nomenclatura Náutica" -> 69
 */
function extractExamNumber(examTitle: string): string | null {
  const match = examTitle.match(/Examen\s+N[°º]\s*(\d+)/);
  return match ? match[1] : null;
}

/**
 * Generate a safe filename from exam title
 */
function generateFilename(examTitle: string, year: number): string {
  const examNum = extractExamNumber(examTitle);
  if (examNum) {
    return `${year}-per-exam${examNum}.json`;
  }
  // Fallback: use sanitized title
  const sanitized = examTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${year}-${sanitized}.json`;
}

/**
 * Generate exam ID from filename
 */
function generateExamId(filename: string): string {
  return filename.replace('.json', '');
}

/**
 * Transform a single question with randomized answers
 */
function transformQuestion(
  questionText: string,
  correctAnswer: string,
  alternatives: string[],
  questionNumber: number
): Question {
  // Validate inputs
  if (!questionText || !correctAnswer || alternatives.length !== 3) {
    throw new Error(`Invalid question data at number ${questionNumber}`);
  }

  // Create answer pool
  const allAnswers = [
    { text: correctAnswer, isCorrect: true },
    { text: alternatives[0], isCorrect: false },
    { text: alternatives[1], isCorrect: false },
    { text: alternatives[2], isCorrect: false },
  ];

  // Shuffle answers
  const shuffled = shuffleArray(allAnswers);

  // Map to a/b/c/d format
  const options: QuestionOptions = {
    a: shuffled[0].text,
    b: shuffled[1].text,
    c: shuffled[2].text,
    d: shuffled[3].text,
  };

  // Find correct answer position
  const answerMap: AnswerOption[] = ['a', 'b', 'c', 'd'];
  const correctIndex = shuffled.findIndex(ans => ans.isCorrect);
  const correctAnswerKey = answerMap[correctIndex];

  return {
    number: questionNumber,
    text: stripQuestionNumber(questionText),
    options,
    correctAnswer: correctAnswerKey,
  };
}

/**
 * Extract all questions from a single exam block
 */
function extractQuestionsFromBlock(block: SourceBlock): Question[] {
  const questions: Question[] = [];
  let sequentialNumber = 1;

  // Process Question 1-5
  for (let i = 1; i <= 5; i++) {
    const questionKey = i === 1 ? 'Question' : `Question ${i}`;
    const answerKey = i === 1 ? 'Correct Answer' : `Correct Answer ${i}`;
    const alt1Key = i === 1 ? 'Alternative Answer 1' : `Alternative Answer 1 for Question ${i}`;
    const alt2Key = i === 1 ? 'Alternative Answer 2' : `Alternative Answer 2 for Question ${i}`;
    const alt3Key = i === 1 ? 'Alternative Answer 3' : `Alternative Answer 3 for Question ${i}`;

    const questionText = block[questionKey];
    const correctAnswer = block[answerKey];
    const alt1 = block[alt1Key];
    const alt2 = block[alt2Key];
    const alt3 = block[alt3Key];

    // Skip empty questions
    if (!questionText || questionText.trim() === '') continue;

    // Transform and add
    const question = transformQuestion(
      questionText,
      correctAnswer,
      [alt1, alt2, alt3],
      sequentialNumber++
    );
    questions.push(question);
  }

  return questions;
}

/**
 * Main transformation function
 */
function transformExam(sourceData: SourceBlock[], options: {
  filename: string;
  year?: number;
  subject?: string;
}): Exam {
  const allQuestions: Question[] = [];
  const themes: string[] = [];

  // Get exam number from first block
  const examNumber = sourceData.length > 0 ? extractExamNumber(sourceData[0]["Exam Title"]) : null;

  // Extract questions from all blocks
  sourceData.forEach(block => {
    themes.push(extractTheme(block["Exam Title"]));
    const blockQuestions = extractQuestionsFromBlock(block);
    allQuestions.push(...blockQuestions);
  });

  // Renumber questions sequentially
  allQuestions.forEach((q, index) => {
    q.number = index + 1;
  });

  // Calculate duration (2 min per question, minimum 60)
  const durationMinutes = Math.max(60, Math.ceil(allQuestions.length * 2));

  // Generate metadata
  const year = options.year || 2025;
  const examId = generateExamId(options.filename);
  const subject = options.subject || "Nautical Certification (PER)";
  const title = examNumber
    ? `PER Exam N° ${examNumber} - Complete Exam`
    : `PER Exam - Complete Exam`;

  // Build exam object
  const exam: Exam = {
    id: examId,
    title,
    subject,
    year,
    durationMinutes,
    totalQuestions: allQuestions.length,
    description: `Official PER (Patrón de Embarcaciones de Recreo) exam covering: ${themes.join(', ')}.`,
    questions: allQuestions,
  };

  return exam;
}

/**
 * Process a single JSON file
 */
function processFile(
  inputPath: string,
  outputDir: string,
  options: { year?: number; subject?: string }
): { success: boolean; filename: string; questionCount: number; error?: string } {
  try {
    // Read source data
    const sourceData: SourceBlock[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

    if (!Array.isArray(sourceData) || sourceData.length === 0) {
      return {
        success: false,
        filename: path.basename(inputPath),
        questionCount: 0,
        error: 'Invalid or empty JSON array'
      };
    }

    // Generate filename
    const examTitle = sourceData[0]["Exam Title"] || '';
    const filename = generateFilename(examTitle, options.year || 2025);
    const outputPath = path.join(outputDir, filename);

    // Transform
    const exam = transformExam(sourceData, { filename, ...options });

    // Write output
    fs.writeFileSync(outputPath, JSON.stringify(exam, null, 2), 'utf-8');

    return {
      success: true,
      filename,
      questionCount: exam.totalQuestions
    };
  } catch (error) {
    return {
      success: false,
      filename: path.basename(inputPath),
      questionCount: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Main CLI function - supports single file or directory batch processing
 */
function main() {
  try {
    const args = process.argv.slice(2);

    if (args.length < 1) {
      console.error('Usage: npx tsx scripts/batch-transform-exams.ts <input-path> [options]');
      console.error('');
      console.error('Options:');
      console.error('  --output-dir <path>    Output directory (default: src/data/exams/)');
      console.error('  --year <year>          Exam year (default: 2025)');
      console.error('  --subject <subject>    Subject name (default: "Nautical Certification (PER)")');
      console.error('');
      console.error('Examples:');
      console.error('  # Single file');
      console.error('  npx tsx scripts/batch-transform-exams.ts ../examenes/exam-69.json');
      console.error('');
      console.error('  # Entire directory');
      console.error('  npx tsx scripts/batch-transform-exams.ts ../examenes/ --year 2025');
      process.exit(1);
    }

    const inputPath = args[0];

    // Parse options
    const options: { year?: number; subject?: string; outputDir?: string } = {};
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--year' && args[i + 1]) {
        options.year = parseInt(args[i + 1]);
        i++;
      } else if (args[i] === '--subject' && args[i + 1]) {
        options.subject = args[i + 1];
        i++;
      } else if (args[i] === '--output-dir' && args[i + 1]) {
        options.outputDir = args[i + 1];
        i++;
      }
    }

    const outputDir = options.outputDir || path.join(__dirname, '../code/src/data/exams');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Check if input is a file or directory
    const stats = fs.statSync(inputPath);
    const results: ReturnType<typeof processFile>[] = [];

    if (stats.isDirectory()) {
      // Batch process all JSON files in directory
      console.log(`📁 Batch processing directory: ${inputPath}\n`);

      const files = fs.readdirSync(inputPath)
        .filter(f => f.endsWith('.json'))
        .map(f => path.join(inputPath, f));

      if (files.length === 0) {
        console.error('❌ No JSON files found in directory');
        process.exit(1);
      }

      console.log(`Found ${files.length} JSON file(s)\n`);

      files.forEach((file, index) => {
        console.log(`[${index + 1}/${files.length}] Processing: ${path.basename(file)}`);
        const result = processFile(file, outputDir, options);
        results.push(result);

        if (result.success) {
          console.log(`  ✓ Created: ${result.filename} (${result.questionCount} questions)`);
        } else {
          console.log(`  ✗ Failed: ${result.error}`);
        }
      });
    } else {
      // Single file processing
      console.log(`📄 Processing single file: ${inputPath}\n`);
      const result = processFile(inputPath, outputDir, options);
      results.push(result);

      if (result.success) {
        console.log(`✓ Created: ${result.filename} (${result.questionCount} questions)`);
      } else {
        console.log(`✗ Failed: ${result.error}`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('TRANSFORMATION SUMMARY');
    console.log('='.repeat(60));

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const totalQuestions = successful.reduce((sum, r) => sum + r.questionCount, 0);

    console.log(`✓ Successful: ${successful.length}`);
    console.log(`✗ Failed: ${failed.length}`);
    console.log(`📝 Total questions: ${totalQuestions}`);
    console.log(`📂 Output directory: ${outputDir}`);

    if (failed.length > 0) {
      console.log('\n❌ Failed files:');
      failed.forEach(r => {
        console.log(`  - ${r.filename}: ${r.error}`);
      });
    }

    if (successful.length > 0) {
      console.log('\n📋 NEXT STEPS:');
      console.log('1. Review the generated exam files in:', outputDir);
      console.log('2. Update src/lib/loadExams.ts with new imports:');
      console.log('');
      successful.forEach(r => {
        const varName = r.filename
          .replace('.json', '')
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '');
        console.log(`   import ${varName} from '@/data/exams/${r.filename}';`);
      });
      console.log('');
      console.log('3. Add to examRegistry array:');
      successful.forEach(r => {
        const varName = r.filename
          .replace('.json', '')
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '');
        console.log(`   ${varName} as Exam,`);
      });
      console.log('');
      console.log('4. Run: npm run build');
    }

    process.exit(failed.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
