/**
 * Structured logging utility for TestNauti
 * Provides consistent logging format with log levels and metadata
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  examId?: string;
  action?: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// Environment-based log level
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const getMinLogLevel = (): LogLevel => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return 'info';
  }
  return 'debug';
};

const shouldLog = (level: LogLevel): boolean => {
  const minLevel = getMinLogLevel();
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
};

const formatLogEntry = (entry: LogEntry): string => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    // JSON format for production (easier to parse in log aggregators)
    return JSON.stringify(entry);
  }
  // Human-readable format for development
  const contextStr = entry.context
    ? ` ${JSON.stringify(entry.context)}`
    : '';
  const errorStr = entry.error
    ? `\n  Error: ${entry.error.name}: ${entry.error.message}${entry.error.stack ? `\n  ${entry.error.stack}` : ''}`
    : '';
  return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${contextStr}${errorStr}`;
};

const createLogEntry = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): LogEntry => ({
  timestamp: new Date().toISOString(),
  level,
  message,
  context,
  error: error
    ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    : undefined,
});

const log = (level: LogLevel, message: string, context?: LogContext, error?: Error): void => {
  if (!shouldLog(level)) return;

  const entry = createLogEntry(level, message, context, error);
  const formatted = formatLogEntry(entry);

  switch (level) {
    case 'debug':
      console.debug(formatted);
      break;
    case 'info':
      console.info(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'error':
      console.error(formatted);
      break;
  }
};

/**
 * Logger instance with methods for each log level
 */
export const logger = {
  /**
   * Debug level logging (development only)
   */
  debug: (message: string, context?: LogContext) => {
    log('debug', message, context);
  },

  /**
   * Info level logging
   */
  info: (message: string, context?: LogContext) => {
    log('info', message, context);
  },

  /**
   * Warning level logging
   */
  warn: (message: string, context?: LogContext, error?: Error) => {
    log('warn', message, context, error);
  },

  /**
   * Error level logging
   */
  error: (message: string, context?: LogContext, error?: Error) => {
    log('error', message, context, error);
  },

  /**
   * Log an exam-related action
   */
  examAction: (
    action: string,
    examId: string,
    userId?: string,
    additionalContext?: Record<string, unknown>
  ) => {
    log('info', `Exam action: ${action}`, {
      action,
      examId,
      userId,
      ...additionalContext,
    });
  },

  /**
   * Log a user action
   */
  userAction: (action: string, userId: string, additionalContext?: Record<string, unknown>) => {
    log('info', `User action: ${action}`, {
      action,
      userId,
      ...additionalContext,
    });
  },
};

export type { LogLevel, LogContext, LogEntry };
