import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserStats } from '@/app/actions/examAttempts';
import { BookOpen, TrendingUp, Trophy, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatTime, formatDate, formatScore, SCORE_THRESHOLDS } from '@/lib/formatters';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const stats = await getUserStats();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          ¡Bienvenido{user?.firstName ? `, ${user.firstName}` : ''}!
        </h1>
        <p className="text-gray-600">
          Sigue tu progreso y continúa practicando para tus exámenes.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Attempts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</div>
              <div className="text-sm text-gray-600">Intentos totales</div>
            </div>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.averageScore}%</div>
              <div className="text-sm text-gray-600">Puntuación media</div>
            </div>
          </div>
        </div>

        {/* Best Score */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.bestScore}%</div>
              <div className="text-sm text-gray-600">Mejor puntuación</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attempts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Intentos recientes</h2>
          <p className="text-sm text-gray-600 mt-1">Tus últimas sesiones de práctica</p>
        </div>

        {stats.recentAttempts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aún no hay intentos</h3>
            <p className="text-gray-600 mb-6">
              ¡Comienza a practicar para seguir tu progreso!
            </p>
            <Link href="/app/exams">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Ver exámenes
              </button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {stats.recentAttempts.map((attempt) => (
              <div key={attempt.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {attempt.examTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDate(attempt.completedAt)}
                      </div>
                      {attempt.timeTakenSeconds && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {formatTime(attempt.timeTakenSeconds, { style: 'compact' })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${formatScore(attempt.percentage).colorClass}`}>
                        {formatScore(attempt.percentage).value}
                      </div>
                      <div className="text-xs text-gray-500">
                        {attempt.score}/{attempt.totalQuestions}
                      </div>
                    </div>
                    {formatScore(attempt.percentage).passed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : attempt.percentage >= SCORE_THRESHOLDS.WARNING ? (
                      <XCircle className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </div>
                {attempt.wasAutoSubmitted && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      Tiempo agotado
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/app/exams">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-lg font-medium transition-colors">
              <BookOpen className="w-5 h-5" />
              Ver exámenes
            </button>
          </Link>
          {stats.recentAttempts.length > 0 && (
            <Link href={`/app/exams/${stats.recentAttempts[0].examId}`}>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-3 rounded-lg font-medium transition-colors">
                Practicar de nuevo
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Motivational Section */}
      {stats.totalAttempts > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">¡Sigue así!</h3>
              <p className="text-sm text-blue-800">
                {stats.averageScore >= SCORE_THRESHOLDS.PASS
                  ? `¡Buen trabajo! Tu promedio es ${stats.averageScore}%. Sigue practicando para mantener tu rendimiento.`
                  : `Has completado ${stats.totalAttempts} intento${stats.totalAttempts > 1 ? 's' : ''}. ¡Sigue practicando para mejorar tu puntuación!`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
