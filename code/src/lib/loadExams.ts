import { Exam } from '@/types/exam';

// Import all exam JSON files
// To add a new exam: 1) Create JSON file in src/data/exams/ 2) Import and add to examRegistry below
import exam2023Math from '@/data/exams/2023-math-paper1.json';
import exam2024Biology from '@/data/exams/2024-biology-midterm.json';
import exam2022Physics from '@/data/exams/2022-physics-final.json';
import exam2025PER from '@/data/exams/2025-per-exam69.json';

/**
 * Registry of all available exams
 * Add new exam imports here - they will automatically appear in the catalog
 */
const examRegistry: Exam[] = [
  exam2023Math as Exam,
  exam2024Biology as Exam,
  exam2022Physics as Exam,
  exam2025PER as Exam,
];

// Cached data to avoid recalculation
let cachedSortedExams: Exam[] | null = null;
let cachedExamMap: Map<string, Exam> | null = null;
let cachedSubjects: string[] | null = null;
let cachedYears: number[] | null = null;

/**
 * Sort exams by year (newest first), then by subject alphabetically
 */
function sortExams(exams: Exam[]): Exam[] {
  return [...exams].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year; // Descending year
    }
    return a.subject.localeCompare(b.subject); // Ascending subject
  });
}

/**
 * Build a map for O(1) exam lookups by ID
 */
function buildExamMap(exams: Exam[]): Map<string, Exam> {
  return new Map(exams.map((exam) => [exam.id, exam]));
}

/**
 * Get all available exams, sorted by year (newest first), then by subject alphabetically
 * Results are cached for performance
 */
export function loadExams(): Exam[] {
  if (!cachedSortedExams) {
    cachedSortedExams = sortExams(examRegistry);
  }
  return cachedSortedExams;
}

/**
 * Find a specific exam by its ID
 * Uses cached map for O(1) lookup performance
 */
export function findExamById(examId: string): Exam | undefined {
  if (!cachedExamMap) {
    cachedExamMap = buildExamMap(examRegistry);
  }
  return cachedExamMap.get(examId);
}

/**
 * Get unique subjects from all exams (cached)
 */
export function getUniqueSubjects(): string[] {
  if (!cachedSubjects) {
    const subjects = examRegistry.map((exam) => exam.subject);
    cachedSubjects = Array.from(new Set(subjects)).sort();
  }
  return cachedSubjects;
}

/**
 * Get unique years from all exams, sorted descending (cached)
 */
export function getUniqueYears(): number[] {
  if (!cachedYears) {
    const years = examRegistry.map((exam) => exam.year);
    cachedYears = Array.from(new Set(years)).sort((a, b) => b - a);
  }
  return cachedYears;
}

/**
 * Get total number of available exams
 */
export function getExamCount(): number {
  return examRegistry.length;
}

/**
 * Filter exams by subject and/or year
 */
export function filterExams(options: {
  subject?: string;
  year?: number;
}): Exam[] {
  const { subject, year } = options;
  let exams = loadExams();

  if (subject) {
    exams = exams.filter((exam) => exam.subject === subject);
  }

  if (year) {
    exams = exams.filter((exam) => exam.year === year);
  }

  return exams;
}

/**
 * Clear all caches (useful for testing or hot reloading)
 */
export function clearExamCache(): void {
  cachedSortedExams = null;
  cachedExamMap = null;
  cachedSubjects = null;
  cachedYears = null;
}
