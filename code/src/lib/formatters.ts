/**
 * Shared formatting utilities for the TestNauti application
 */

/**
 * Format seconds into a human-readable time string
 * @param seconds - Number of seconds to format
 * @param options - Formatting options
 * @returns Formatted time string (e.g., "1:30:45" or "45m")
 */
export function formatTime(
  seconds: number | null | undefined,
  options: { style?: 'clock' | 'compact' } = {}
): string {
  const { style = 'clock' } = options;

  if (seconds === null || seconds === undefined) {
    return 'Sin tiempo';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (style === 'compact') {
    // Compact style: "1h 30m" or "45m"
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Clock style: "1:30:45" or "30:45"
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format a date into a localized string for Spanish users
 * @param date - Date to format (Date object or string/number that can be parsed)
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: { includeTime?: boolean } = {}
): string {
  const { includeTime = true } = options;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (includeTime) {
    return new Intl.DateTimeFormat('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Format a percentage score with color class based on pass thresholds
 * @param percentage - Score percentage (0-100)
 * @returns Object with formatted value and color class
 */
export function formatScore(percentage: number): {
  value: string;
  colorClass: string;
  passed: boolean;
} {
  const PASS_THRESHOLD = 70;
  const WARNING_THRESHOLD = 50;

  let colorClass: string;
  if (percentage >= PASS_THRESHOLD) {
    colorClass = 'text-green-600';
  } else if (percentage >= WARNING_THRESHOLD) {
    colorClass = 'text-yellow-600';
  } else {
    colorClass = 'text-red-600';
  }

  return {
    value: `${percentage}%`,
    colorClass,
    passed: percentage >= PASS_THRESHOLD,
  };
}

// Constants for thresholds (extracted magic numbers)
export const SCORE_THRESHOLDS = {
  PASS: 70,
  WARNING: 50,
} as const;

export const TIME_THRESHOLDS = {
  CRITICAL_SECONDS: 600, // 10 minutes
} as const;
