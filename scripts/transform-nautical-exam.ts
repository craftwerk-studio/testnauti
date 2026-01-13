import fs from 'fs';
import path from 'path';
import type { Exam, Question, QuestionOptions, AnswerOption } from '../code/src/types/exam';

// Define source data structure
interface SourceBlock {
  Position: string;
  "Exam Title": string;
  Question: string;
  "Correct Answer": string;
  "Alternative Answer 1": string;
  "Alternative Answer 2": string;
  "Alternative Answer 3": string;
  // Repeat for Question 2-5 with numbered suffixes
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
  let sequentialNumber = 1; // Will be renumbered globally later

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
function transformExam(sourceData: SourceBlock[]): Exam {
  const allQuestions: Question[] = [];
  const themes: string[] = [];

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

  // Build exam object
  const exam: Exam = {
    id: "2025-per-exam69",
    title: "PER Exam N° 69 - Complete Exam",
    subject: "Nautical Certification (PER)",
    year: 2025,
    durationMinutes,
    totalQuestions: allQuestions.length,
    description: `Official PER (Patrón de Embarcaciones de Recreo) exam covering: ${themes.join(', ')}.`,
    questions: allQuestions,
  };

  return exam;
}

/**
 * Main CLI function
 */
function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    if (args.length < 1) {
      console.error('Usage: tsx scripts/transform-nautical-exam.ts <input-json-path> [output-path]');
      process.exit(1);
    }

    const inputPath = args[0];
    const outputPath = args[1] || path.join(
      __dirname,
      '../code/src/data/exams/2025-per-exam69.json'
    );

    // Read source data
    console.log(`Reading source data from: ${inputPath}`);
    const sourceData: SourceBlock[] = JSON.parse(
      fs.readFileSync(inputPath, 'utf-8')
    );

    // Transform
    console.log('Transforming exam data...');
    const exam = transformExam(sourceData);

    // Write output
    console.log(`Writing output to: ${outputPath}`);
    fs.writeFileSync(
      outputPath,
      JSON.stringify(exam, null, 2),
      'utf-8'
    );

    // Summary
    console.log('\nTransformation complete!');
    console.log(`- Total questions: ${exam.totalQuestions}`);
    console.log(`- Exam ID: ${exam.id}`);
    console.log(`- Duration: ${exam.durationMinutes} minutes`);
    console.log(`\nNext steps:`);
    console.log(`1. Review the output file: ${outputPath}`);
    console.log(`2. Add to loadExams.ts: import exam2025PER from '@/data/exams/2025-per-exam69.json';`);
    console.log(`3. Add to examRegistry array: exam2025PER as Exam,`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
