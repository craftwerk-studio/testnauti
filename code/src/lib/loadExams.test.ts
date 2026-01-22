import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadExams,
  findExamById,
  getUniqueSubjects,
  getUniqueYears,
  getExamCount,
  filterExams,
  clearExamCache,
} from './loadExams';

describe('loadExams', () => {
  beforeEach(() => {
    clearExamCache();
  });

  it('returns an array of exams', () => {
    const exams = loadExams();
    expect(Array.isArray(exams)).toBe(true);
    expect(exams.length).toBeGreaterThan(0);
  });

  it('returns exams sorted by year descending', () => {
    const exams = loadExams();
    for (let i = 1; i < exams.length; i++) {
      if (exams[i].year !== exams[i - 1].year) {
        expect(exams[i].year).toBeLessThan(exams[i - 1].year);
      }
    }
  });

  it('returns exams with same year sorted by subject ascending', () => {
    const exams = loadExams();
    const sameYearExams = exams.filter((e) => e.year === exams[0].year);
    if (sameYearExams.length > 1) {
      for (let i = 1; i < sameYearExams.length; i++) {
        expect(
          sameYearExams[i].subject.localeCompare(sameYearExams[i - 1].subject)
        ).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('returns cached results on subsequent calls', () => {
    const exams1 = loadExams();
    const exams2 = loadExams();
    expect(exams1).toBe(exams2); // Same reference
  });

  it('each exam has required properties', () => {
    const exams = loadExams();
    exams.forEach((exam) => {
      expect(exam).toHaveProperty('id');
      expect(exam).toHaveProperty('title');
      expect(exam).toHaveProperty('subject');
      expect(exam).toHaveProperty('year');
      expect(exam).toHaveProperty('durationMinutes');
      expect(exam).toHaveProperty('totalQuestions');
      expect(exam).toHaveProperty('questions');
      expect(Array.isArray(exam.questions)).toBe(true);
    });
  });
});

describe('findExamById', () => {
  beforeEach(() => {
    clearExamCache();
  });

  it('finds an existing exam', () => {
    const exams = loadExams();
    const firstExam = exams[0];
    const found = findExamById(firstExam.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(firstExam.id);
  });

  it('returns undefined for non-existent exam', () => {
    const found = findExamById('non-existent-id');
    expect(found).toBeUndefined();
  });

  it('uses cached map for O(1) lookups', () => {
    const exams = loadExams();
    const firstExam = exams[0];

    // First lookup builds the cache
    findExamById(firstExam.id);

    // Subsequent lookups use the cache
    const found1 = findExamById(firstExam.id);
    const found2 = findExamById(firstExam.id);

    expect(found1).toBe(found2); // Same reference
  });
});

describe('getUniqueSubjects', () => {
  beforeEach(() => {
    clearExamCache();
  });

  it('returns an array of unique subjects', () => {
    const subjects = getUniqueSubjects();
    expect(Array.isArray(subjects)).toBe(true);
    expect(subjects.length).toBeGreaterThan(0);

    // Check uniqueness
    const uniqueSet = new Set(subjects);
    expect(uniqueSet.size).toBe(subjects.length);
  });

  it('returns subjects sorted alphabetically', () => {
    const subjects = getUniqueSubjects();
    const sorted = [...subjects].sort();
    expect(subjects).toEqual(sorted);
  });

  it('returns cached results', () => {
    const subjects1 = getUniqueSubjects();
    const subjects2 = getUniqueSubjects();
    expect(subjects1).toBe(subjects2);
  });
});

describe('getUniqueYears', () => {
  beforeEach(() => {
    clearExamCache();
  });

  it('returns an array of unique years', () => {
    const years = getUniqueYears();
    expect(Array.isArray(years)).toBe(true);
    expect(years.length).toBeGreaterThan(0);

    // Check uniqueness
    const uniqueSet = new Set(years);
    expect(uniqueSet.size).toBe(years.length);
  });

  it('returns years sorted descending', () => {
    const years = getUniqueYears();
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBeLessThan(years[i - 1]);
    }
  });

  it('returns cached results', () => {
    const years1 = getUniqueYears();
    const years2 = getUniqueYears();
    expect(years1).toBe(years2);
  });
});

describe('getExamCount', () => {
  it('returns the total number of exams', () => {
    const count = getExamCount();
    const exams = loadExams();
    expect(count).toBe(exams.length);
  });
});

describe('filterExams', () => {
  beforeEach(() => {
    clearExamCache();
  });

  it('returns all exams with no filters', () => {
    const filtered = filterExams({});
    const all = loadExams();
    expect(filtered.length).toBe(all.length);
  });

  it('filters by subject', () => {
    const subjects = getUniqueSubjects();
    if (subjects.length > 0) {
      const filtered = filterExams({ subject: subjects[0] });
      filtered.forEach((exam) => {
        expect(exam.subject).toBe(subjects[0]);
      });
    }
  });

  it('filters by year', () => {
    const years = getUniqueYears();
    if (years.length > 0) {
      const filtered = filterExams({ year: years[0] });
      filtered.forEach((exam) => {
        expect(exam.year).toBe(years[0]);
      });
    }
  });

  it('filters by both subject and year', () => {
    const exams = loadExams();
    const firstExam = exams[0];
    const filtered = filterExams({
      subject: firstExam.subject,
      year: firstExam.year,
    });
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((exam) => {
      expect(exam.subject).toBe(firstExam.subject);
      expect(exam.year).toBe(firstExam.year);
    });
  });

  it('returns empty array for non-matching filters', () => {
    const filtered = filterExams({ year: 1900 });
    expect(filtered).toEqual([]);
  });
});

describe('clearExamCache', () => {
  it('clears all caches', () => {
    // Populate caches
    loadExams();
    findExamById('test');
    getUniqueSubjects();
    getUniqueYears();

    // Clear
    clearExamCache();

    // After clearing, new calls should create new arrays
    const exams1 = loadExams();
    clearExamCache();
    const exams2 = loadExams();

    // Different references after cache clear
    expect(exams1).not.toBe(exams2);
  });
});

/**
 * Tests specific to the current PER exam configuration
 * These tests verify the real November 2025 PER exam is correctly loaded
 */
describe('PER Exam Loading (US-011)', () => {
  beforeEach(() => {
    clearExamCache();
  });

  it('loadExams() returns exactly 1 exam', () => {
    const exams = loadExams();
    expect(exams.length).toBe(1);
  });

  it('findExamById("2025-per-nov-v01") returns the correct exam', () => {
    const exam = findExamById('2025-per-nov-v01');
    expect(exam).toBeDefined();
    expect(exam?.id).toBe('2025-per-nov-v01');
    expect(exam?.title).toBe('Examen PER - Noviembre 2025');
    expect(exam?.subject).toBe('PER');
    expect(exam?.year).toBe(2025);
  });

  it('findExamById("nonexistent") returns undefined', () => {
    const exam = findExamById('nonexistent');
    expect(exam).toBeUndefined();
  });

  it('PER exam has exactly 45 questions', () => {
    const exam = findExamById('2025-per-nov-v01');
    expect(exam).toBeDefined();
    expect(exam?.questions.length).toBe(45);
    expect(exam?.totalQuestions).toBe(45);
  });

  it('all questions have valid correctAnswer (a, b, c, or d)', () => {
    const exam = findExamById('2025-per-nov-v01');
    expect(exam).toBeDefined();

    const validAnswers = ['a', 'b', 'c', 'd'];
    exam?.questions.forEach((question, index) => {
      expect(
        validAnswers.includes(question.correctAnswer),
        `Question ${index + 1} has invalid correctAnswer: "${question.correctAnswer}"`
      ).toBe(true);
    });
  });

  it('all questions have required fields', () => {
    const exam = findExamById('2025-per-nov-v01');
    expect(exam).toBeDefined();

    exam?.questions.forEach((question, index) => {
      expect(question.number, `Question ${index + 1} missing number`).toBeDefined();
      expect(question.text, `Question ${index + 1} missing text`).toBeDefined();
      expect(question.options, `Question ${index + 1} missing options`).toBeDefined();
      expect(question.options.a, `Question ${index + 1} missing option a`).toBeDefined();
      expect(question.options.b, `Question ${index + 1} missing option b`).toBeDefined();
      expect(question.options.c, `Question ${index + 1} missing option c`).toBeDefined();
      expect(question.options.d, `Question ${index + 1} missing option d`).toBeDefined();
      expect(question.correctAnswer, `Question ${index + 1} missing correctAnswer`).toBeDefined();
    });
  });

  it('getUniqueSubjects() returns ["PER"]', () => {
    const subjects = getUniqueSubjects();
    expect(subjects).toEqual(['PER']);
  });

  it('getUniqueYears() returns [2025]', () => {
    const years = getUniqueYears();
    expect(years).toEqual([2025]);
  });
});
