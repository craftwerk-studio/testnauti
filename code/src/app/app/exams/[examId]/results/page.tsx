'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, BookOpen, ArrowLeft, RotateCw, Clock, History, Check, AlertCircle } from 'lucide-react';
import { Question, AnswerOption } from '@/types/exam';

interface TestResults {
  examId: string;
  examTitle: string;
  totalQuestions: number;
  correctCount: number;
  answers: Record<number, AnswerOption>;
  questions: Question[];
  timeTaken?: number | null;
  wasAutoSubmitted?: boolean;
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<TestResults | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    // Retrieve results from sessionStorage
    const storedResults = sessionStorage.getItem('testResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // If no results found, redirect to catalog
      router.push('/app/exams');
    }
    
    // Check if save failed
    const failed = sessionStorage.getItem('saveFailed');
    setSaveFailed(failed === 'true');
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando resultados...</div>
      </div>
    );
  }

  const percentage = Math.round((results.correctCount / results.totalQuestions) * 100);
  const passed = percentage >= 70; // Arbitrary passing threshold

  // Format time taken
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Saved Confirmation */}
        {saveFailed ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2 text-yellow-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">No se pudo guardar el intento</span>
                <p className="text-sm text-yellow-700 mt-1">
                  Tus resultados se muestran abajo, pero no pudimos guardar este intento en tu historial. 
                  Por favor, verifica tu conexión e inténtalo de nuevo.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <Check className="w-5 h-5" />
              <span className="font-semibold">¡Intento guardado!</span>
              <span className="text-sm text-green-700">
                Puedes ver tu historial de progreso en tu panel principal.
              </span>
            </div>
          </div>
        )}

        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className={`p-8 text-center ${passed ? 'bg-green-50' : 'bg-blue-50'}`}>
            <div className="mb-4">
              {passed ? (
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {results.wasAutoSubmitted ? "¡Se acabó el tiempo!" : "¡Examen completado!"}
            </h1>
            <p className="text-gray-600 mb-2">{results.examTitle}</p>
            {results.wasAutoSubmitted && (
              <p className="text-sm text-gray-500 mb-4">
                Tu examen ha sido entregado automáticamente.
              </p>
            )}
            {results.timeTaken !== null && results.timeTaken !== undefined && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span>Tiempo empleado: {formatTime(results.timeTaken)}</span>
              </div>
            )}
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className="text-5xl font-bold text-gray-900">
                  {results.correctCount}
                  <span className="text-2xl text-gray-500">/{results.totalQuestions}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">Respuestas correctas</div>
              </div>
              <div className="h-16 w-px bg-gray-300" />
              <div>
                <div className="text-5xl font-bold text-gray-900">{percentage}%</div>
                <div className="text-sm text-gray-600 mt-1">Puntuación</div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {results.correctCount}
                </div>
                <div className="text-xs text-gray-600">Correcta</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {results.totalQuestions - results.correctCount}
                </div>
                <div className="text-xs text-gray-600">Incorrecta</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {results.totalQuestions - Object.keys(results.answers).length}
                </div>
                <div className="text-xs text-gray-600">Sin responder</div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Revisión de respuestas</h2>
          <p className="text-gray-600 text-sm">
            Revisa todas las preguntas, tus respuestas y las respuestas correctas a continuación.
          </p>
        </div>

        {/* Questions Review */}
        <div className="space-y-4">
          {results.questions.map((question, index) => {
            const userAnswer = results.answers[question.number];
            const isCorrect = userAnswer === question.correctAnswer;
            const wasAnswered = userAnswer !== undefined;

            return (
              <div
                key={question.number}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-500">
                        PREGUNTA {question.number}
                      </span>
                      {wasAnswered ? (
                        isCorrect ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                            <CheckCircle className="w-3 h-3" />
                            Correcta
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                            <XCircle className="w-3 h-3" />
                            Incorrecta
                          </span>
                        )
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          Sin responder
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {question.text}
                    </h3>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {(['a', 'b', 'c', 'd'] as AnswerOption[]).map((option) => {
                    const isUserAnswer = userAnswer === option;
                    const isCorrectAnswer = question.correctAnswer === option;

                    let optionClass = 'border-gray-200 bg-white';
                    if (isCorrectAnswer) {
                      optionClass = 'border-green-500 bg-green-50';
                    } else if (isUserAnswer && !isCorrect) {
                      optionClass = 'border-red-500 bg-red-50';
                    }

                    return (
                      <div
                        key={option}
                        className={`flex items-start p-3 border-2 rounded-lg ${optionClass}`}
                      >
                        <div className="flex-1 flex items-start gap-2">
                          <span className="font-semibold text-gray-700">
                            {option.toUpperCase()}.
                          </span>
                          <span className="text-gray-900 flex-1">
                            {question.options[option]}
                          </span>
                          <div className="flex items-center gap-2">
                            {isUserAnswer && (
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                Tu respuesta
                              </span>
                            )}
                            {isCorrectAnswer && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/app/dashboard" className="w-full">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                <History className="w-4 h-4" />
                Ver historial
              </button>
            </Link>
            <Link href="/app/exams" className="w-full">
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" />
                Ver exámenes
              </button>
            </Link>
            <Link href={`/app/exams/${results.examId}`} className="w-full">
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                <RotateCw className="w-4 h-4" />
                Repetir examen
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

