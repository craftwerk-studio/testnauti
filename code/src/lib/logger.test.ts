import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('debug', () => {
    it('logs debug messages', () => {
      logger.debug('test message');
      expect(console.debug).toHaveBeenCalled();
    });

    it('includes context in debug logs', () => {
      logger.debug('test message', { userId: '123' });
      expect(console.debug).toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('logs info messages', () => {
      logger.info('test message');
      expect(console.info).toHaveBeenCalled();
    });

    it('includes context in info logs', () => {
      logger.info('test message', { action: 'test_action' });
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('logs warning messages', () => {
      logger.warn('test warning');
      expect(console.warn).toHaveBeenCalled();
    });

    it('includes error in warning logs', () => {
      const error = new Error('test error');
      logger.warn('test warning', {}, error);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('logs error messages', () => {
      logger.error('test error');
      expect(console.error).toHaveBeenCalled();
    });

    it('includes error object in error logs', () => {
      const error = new Error('test error');
      logger.error('test error message', { userId: '123' }, error);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('examAction', () => {
    it('logs exam actions with context', () => {
      logger.examAction('start_exam', 'exam-123', 'user-456');
      expect(console.info).toHaveBeenCalled();
    });

    it('includes additional context', () => {
      logger.examAction('complete_exam', 'exam-123', 'user-456', {
        score: 85,
        timeTaken: 1800,
      });
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe('userAction', () => {
    it('logs user actions with context', () => {
      logger.userAction('login', 'user-123');
      expect(console.info).toHaveBeenCalled();
    });

    it('includes additional context', () => {
      logger.userAction('update_profile', 'user-123', { field: 'email' });
      expect(console.info).toHaveBeenCalled();
    });
  });
});
