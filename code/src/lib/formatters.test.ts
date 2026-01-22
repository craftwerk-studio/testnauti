import { describe, it, expect } from 'vitest';
import {
  formatTime,
  formatDate,
  formatScore,
  SCORE_THRESHOLDS,
  TIME_THRESHOLDS,
} from './formatters';

describe('formatTime', () => {
  describe('clock style (default)', () => {
    it('formats seconds under an hour', () => {
      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(59)).toBe('0:59');
      expect(formatTime(3599)).toBe('59:59');
    });

    it('formats hours correctly', () => {
      expect(formatTime(3600)).toBe('1:00:00');
      expect(formatTime(3661)).toBe('1:01:01');
      expect(formatTime(7200)).toBe('2:00:00');
    });

    it('pads minutes and seconds', () => {
      expect(formatTime(61)).toBe('1:01');
      expect(formatTime(3605)).toBe('1:00:05');
    });
  });

  describe('compact style', () => {
    it('formats minutes only when under an hour', () => {
      expect(formatTime(90, { style: 'compact' })).toBe('1m');
      expect(formatTime(1800, { style: 'compact' })).toBe('30m');
    });

    it('formats hours and minutes', () => {
      expect(formatTime(3600, { style: 'compact' })).toBe('1h 0m');
      expect(formatTime(5400, { style: 'compact' })).toBe('1h 30m');
    });
  });

  describe('null handling', () => {
    it('returns "Sin tiempo" for null', () => {
      expect(formatTime(null)).toBe('Sin tiempo');
    });

    it('returns "Sin tiempo" for undefined', () => {
      expect(formatTime(undefined)).toBe('Sin tiempo');
    });
  });
});

describe('formatDate', () => {
  const testDate = new Date('2024-06-15T14:30:00');

  it('formats date with time by default', () => {
    const result = formatDate(testDate);
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('formats date without time when specified', () => {
    const result = formatDate(testDate, { includeTime: false });
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('accepts string dates', () => {
    const result = formatDate('2024-06-15T14:30:00');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('accepts timestamp numbers', () => {
    const result = formatDate(testDate.getTime());
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});

describe('formatScore', () => {
  it('returns green for passing scores (>=70)', () => {
    const result = formatScore(70);
    expect(result.value).toBe('70%');
    expect(result.colorClass).toBe('text-green-600');
    expect(result.passed).toBe(true);
  });

  it('returns green for high scores', () => {
    const result = formatScore(100);
    expect(result.colorClass).toBe('text-green-600');
    expect(result.passed).toBe(true);
  });

  it('returns yellow for warning scores (50-69)', () => {
    const result = formatScore(50);
    expect(result.value).toBe('50%');
    expect(result.colorClass).toBe('text-yellow-600');
    expect(result.passed).toBe(false);
  });

  it('returns red for failing scores (<50)', () => {
    const result = formatScore(49);
    expect(result.value).toBe('49%');
    expect(result.colorClass).toBe('text-red-600');
    expect(result.passed).toBe(false);
  });

  it('handles zero', () => {
    const result = formatScore(0);
    expect(result.value).toBe('0%');
    expect(result.colorClass).toBe('text-red-600');
    expect(result.passed).toBe(false);
  });
});

describe('constants', () => {
  it('exports SCORE_THRESHOLDS', () => {
    expect(SCORE_THRESHOLDS.PASS).toBe(70);
    expect(SCORE_THRESHOLDS.WARNING).toBe(50);
  });

  it('exports TIME_THRESHOLDS', () => {
    expect(TIME_THRESHOLDS.CRITICAL_SECONDS).toBe(600);
  });
});

/**
 * Score calculation tests for PER exam (45 questions)
 * US-012: Verify pass/fail logic at 70% threshold
 *
 * The percentage calculation uses: Math.round((correctCount / totalQuestions) * 100)
 * Pass threshold: percentage >= 70
 */
describe('PER Exam Score Calculation (US-012)', () => {
  const TOTAL_QUESTIONS = 45;

  // Helper function that mirrors the app's calculation logic
  const calculatePercentage = (correct: number, total: number): number => {
    return Math.round((correct / total) * 100);
  };

  const isPassing = (percentage: number): boolean => {
    return percentage >= SCORE_THRESHOLDS.PASS;
  };

  it('45/45 correct = 100% = PASS', () => {
    const percentage = calculatePercentage(45, TOTAL_QUESTIONS);
    expect(percentage).toBe(100);

    const result = formatScore(percentage);
    expect(result.passed).toBe(true);
    expect(result.value).toBe('100%');
    expect(result.colorClass).toBe('text-green-600');
  });

  it('32/45 correct = 71% = PASS (edge case - just above threshold)', () => {
    // 32/45 = 0.7111... → Math.round(71.11) = 71
    const percentage = calculatePercentage(32, TOTAL_QUESTIONS);
    expect(percentage).toBe(71);

    const result = formatScore(percentage);
    expect(result.passed).toBe(true);
    expect(result.value).toBe('71%');
    expect(result.colorClass).toBe('text-green-600');
  });

  it('31/45 correct = 69% = FAIL (edge case - just below threshold)', () => {
    // 31/45 = 0.6889... → Math.round(68.89) = 69
    const percentage = calculatePercentage(31, TOTAL_QUESTIONS);
    expect(percentage).toBe(69);

    const result = formatScore(percentage);
    expect(result.passed).toBe(false);
    expect(result.value).toBe('69%');
    expect(result.colorClass).toBe('text-yellow-600'); // 69% is in warning range (50-69)
  });

  it('0/45 correct = 0% = FAIL', () => {
    const percentage = calculatePercentage(0, TOTAL_QUESTIONS);
    expect(percentage).toBe(0);

    const result = formatScore(percentage);
    expect(result.passed).toBe(false);
    expect(result.value).toBe('0%');
    expect(result.colorClass).toBe('text-red-600');
  });

  it('70% threshold is correctly applied', () => {
    // Exactly 70% should pass
    expect(isPassing(70)).toBe(true);
    expect(formatScore(70).passed).toBe(true);

    // 69% should fail
    expect(isPassing(69)).toBe(false);
    expect(formatScore(69).passed).toBe(false);
  });

  it('minimum passing score for 45 questions is 32 correct', () => {
    // 31/45 = 68.89% → rounds to 69% → FAIL
    const score31 = calculatePercentage(31, TOTAL_QUESTIONS);
    expect(isPassing(score31)).toBe(false);

    // 32/45 = 71.11% → rounds to 71% → PASS
    const score32 = calculatePercentage(32, TOTAL_QUESTIONS);
    expect(isPassing(score32)).toBe(true);

    // This confirms 32 is the minimum passing score for 45 questions
  });
});
