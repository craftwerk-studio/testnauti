import fs from 'fs';
import path from 'path';
import type { Exam, Question, AnswerOption, QuestionOptions } from '../../code/src/types/exam';

interface ValidationError {
  field: string;
  message: string;
}

const VALID_ANSWERS: AnswerOption[] = ['a', 'b', 'c', 'd'];

/**
 * Validates that a value is a non-empty string
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates that a value is a positive integer
 */
function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/**
 * Validates question options object
 */
function validateOptions(options: unknown, questionNum: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!options || typeof options !== 'object') {
    errors.push({
      field: `questions[${questionNum}].options`,
      message: 'Options must be an object',
    });
    return errors;
  }

  const opts = options as QuestionOptions;
  for (const key of VALID_ANSWERS) {
    if (!isNonEmptyString(opts[key])) {
      errors.push({
        field: `questions[${questionNum}].options.${key}`,
        message: `Option '${key}' must be a non-empty string`,
      });
    }
  }

  return errors;
}

/**
 * Validates a single question
 */
function validateQuestion(question: unknown, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const q = question as Question;

  // Check if question is an object
  if (!question || typeof question !== 'object') {
    errors.push({
      field: `questions[${index}]`,
      message: 'Question must be an object',
    });
    return errors;
  }

  // Validate number
  if (!isPositiveInteger(q.number)) {
    errors.push({
      field: `questions[${index}].number`,
      message: 'Question number must be a positive integer',
    });
  }

  // Validate text
  if (!isNonEmptyString(q.text)) {
    errors.push({
      field: `questions[${index}].text`,
      message: 'Question text must be a non-empty string',
    });
  }

  // Validate options
  errors.push(...validateOptions(q.options, index));

  // Validate correctAnswer
  if (!VALID_ANSWERS.includes(q.correctAnswer)) {
    errors.push({
      field: `questions[${index}].correctAnswer`,
      message: `correctAnswer must be one of: ${VALID_ANSWERS.join(', ')} (got: ${q.correctAnswer})`,
    });
  }

  return errors;
}

/**
 * Validates a complete exam JSON structure
 */
function validateExam(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    errors.push({
      field: 'root',
      message: 'Exam data must be an object',
    });
    return errors;
  }

  const exam = data as Exam;

  // Required string fields
  const requiredStringFields: (keyof Exam)[] = ['id', 'title', 'subject', 'description'];
  for (const field of requiredStringFields) {
    if (!isNonEmptyString(exam[field])) {
      errors.push({
        field,
        message: `${field} must be a non-empty string`,
      });
    }
  }

  // Required positive integer fields
  if (!isPositiveInteger(exam.year)) {
    errors.push({
      field: 'year',
      message: 'year must be a positive integer',
    });
  }

  if (!isPositiveInteger(exam.durationMinutes)) {
    errors.push({
      field: 'durationMinutes',
      message: 'durationMinutes must be a positive integer',
    });
  }

  if (!isPositiveInteger(exam.totalQuestions)) {
    errors.push({
      field: 'totalQuestions',
      message: 'totalQuestions must be a positive integer',
    });
  }

  // Validate questions array exists
  if (!Array.isArray(exam.questions)) {
    errors.push({
      field: 'questions',
      message: 'questions must be an array',
    });
    return errors;
  }

  // Validate each question
  exam.questions.forEach((question, index) => {
    errors.push(...validateQuestion(question, index));
  });

  // Validate question count matches totalQuestions
  if (isPositiveInteger(exam.totalQuestions) && exam.questions.length !== exam.totalQuestions) {
    errors.push({
      field: 'totalQuestions',
      message: `totalQuestions (${exam.totalQuestions}) does not match actual question count (${exam.questions.length})`,
    });
  }

  return errors;
}

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: npx tsx scripts/exams/validate-exam.ts <exam-json-path>');
    console.error('');
    console.error('Examples:');
    console.error('  npx tsx scripts/exams/validate-exam.ts code/src/data/exams/2025-per-nov-v01.json');
    console.error('  npx tsx scripts/exams/validate-exam.ts ./my-exam.json');
    process.exit(1);
  }

  const inputPath = args[0];

  // Check file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  // Read and parse JSON
  let data: unknown;
  try {
    const content = fs.readFileSync(inputPath, 'utf-8');
    data = JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error: Failed to parse JSON file`);
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  // Validate
  console.log(`Validating: ${path.basename(inputPath)}\n`);
  const errors = validateExam(data);

  if (errors.length === 0) {
    const exam = data as Exam;
    console.log('✓ Validation passed!');
    console.log('');
    console.log('Summary:');
    console.log(`  ID: ${exam.id}`);
    console.log(`  Title: ${exam.title}`);
    console.log(`  Subject: ${exam.subject}`);
    console.log(`  Year: ${exam.year}`);
    console.log(`  Duration: ${exam.durationMinutes} minutes`);
    console.log(`  Questions: ${exam.totalQuestions}`);
    process.exit(0);
  } else {
    console.error(`❌ Validation failed with ${errors.length} error(s):\n`);
    errors.forEach((error, index) => {
      console.error(`  ${index + 1}. [${error.field}] ${error.message}`);
    });
    process.exit(1);
  }
}

main();
