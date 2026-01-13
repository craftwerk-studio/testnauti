'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

export interface SaveAttemptData {
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number | null;
  wasTimed: boolean;
  wasAutoSubmitted: boolean;
}

export async function saveExamAttempt(data: SaveAttemptData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Calculate percentage
    const percentage = Math.round((data.score / data.totalQuestions) * 100);

    // Ensure user exists (upsert)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // Save attempt
    const attempt = await prisma.examAttempt.create({
      data: {
        userId,
        examId: data.examId,
        examTitle: data.examTitle,
        score: data.score,
        totalQuestions: data.totalQuestions,
        percentage,
        timeTakenSeconds: data.timeTakenSeconds,
        wasTimed: data.wasTimed,
        wasAutoSubmitted: data.wasAutoSubmitted,
      },
    });

    // Revalidate dashboard to show new attempt
    revalidatePath('/app/dashboard');

    logger.examAction('attempt_saved', data.examId, userId, {
      score: data.score,
      percentage,
      wasTimed: data.wasTimed,
    });

    return { success: true, attemptId: attempt.id };
  } catch (error) {
    logger.error(
      'Failed to save exam attempt',
      { examId: data.examId, action: 'save_attempt' },
      error instanceof Error ? error : new Error(String(error))
    );
    return { success: false, error: 'Failed to save attempt' };
  }
}

export async function getUserAttempts(limit?: number) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const attempts = await prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });

    return attempts;
  } catch (error) {
    logger.error(
      'Failed to fetch user attempts',
      { action: 'get_attempts' },
      error instanceof Error ? error : new Error(String(error))
    );
    return [];
  }
}

export async function getUserStats() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const attempts = await prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    const totalAttempts = attempts.length;
    const averageScore =
      totalAttempts > 0
        ? Math.round(
            attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts
          )
        : 0;

    // Get best score per exam
    const examBestScores = attempts.reduce((acc, attempt) => {
      if (!acc[attempt.examId] || attempt.percentage > acc[attempt.examId]) {
        acc[attempt.examId] = attempt.percentage;
      }
      return acc;
    }, {} as Record<string, number>);

    const bestScore = totalAttempts > 0 ? Math.max(...Object.values(examBestScores)) : 0;

    return {
      totalAttempts,
      averageScore,
      bestScore,
      recentAttempts: attempts.slice(0, 5),
    };
  } catch (error) {
    logger.error(
      'Failed to fetch user stats',
      { action: 'get_stats' },
      error instanceof Error ? error : new Error(String(error))
    );
    return {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      recentAttempts: [],
    };
  }
}

