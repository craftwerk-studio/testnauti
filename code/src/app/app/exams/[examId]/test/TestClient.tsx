'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Exam, AnswerOption } from '@/types/exam';
import { ChevronLeft, ChevronRight, CheckCircle, Timer, Menu, X, AlertTriangle } from 'lucide-react';
import { saveExamAttempt } from '@/app/actions/examAttempts';
import { formatTime, TIME_THRESHOLDS } from '@/lib/formatters';

interface TestClientProps {
  exam: Exam;
}

export default function TestClient({ exam }: TestClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTimed = searchParams.get('timed') === 'true';

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerOption>>({});
  const [timeRemaining, setTimeRemaining] = useState(exam.durationMinutes * 60); // in seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showNavSidebar, setShowNavSidebar] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref to track latest answers for timer callback
  const answersRef = useRef(answers);
  const timeRemainingRef = useRef(timeRemaining);

  // Keep refs in sync with state
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  const currentQuestion = exam.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  // Submit function that uses refs to avoid stale closure
  const performSubmit = useCallback(async (autoSubmit: boolean) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const currentAnswers = answersRef.current;
    const currentTimeRemaining = timeRemainingRef.current;

    // Calculate score
    let correctCount = 0;
    exam.questions.forEach((question) => {
      if (currentAnswers[question.number] === question.correctAnswer) {
        correctCount++;
      }
    });

    // Calculate time taken (only if timed)
    const timeTaken = isTimed ? exam.durationMinutes * 60 - currentTimeRemaining : null;

    // Store results in sessionStorage for the results page
    const results = {
      examId: exam.id,
      examTitle: exam.title,
      totalQuestions: exam.questions.length,
      correctCount,
      answers: currentAnswers,
      questions: exam.questions,
      timeTaken,
      wasAutoSubmitted: autoSubmit,
    };
    sessionStorage.setItem('testResults', JSON.stringify(results));

    // Save attempt to database
    try {
      const result = await saveExamAttempt({
        examId: exam.id,
        examTitle: exam.title,
        score: correctCount,
        totalQuestions: exam.questions.length,
        timeTakenSeconds: timeTaken,
        wasTimed: isTimed,
        wasAutoSubmitted: autoSubmit,
      });

      if (!result.success) {
        console.error('Failed to save attempt:', result.error);
        sessionStorage.setItem('saveFailed', 'true');
      } else {
        sessionStorage.removeItem('saveFailed');
      }
    } catch (error) {
      console.error('Failed to save attempt:', error);
      sessionStorage.setItem('saveFailed', 'true');
    }

    // Navigate to results page
    router.push(`/app/exams/${exam.id}/results`);
  }, [exam, isTimed, router, isSubmitting]);

  // Timer countdown
  useEffect(() => {
    if (!isTimed) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true);
          clearInterval(interval);
          // Auto-submit when time runs out
          performSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimed, performSubmit]);

  const handleAnswerSelect = (option: AnswerOption) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.number]: option,
    }));
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowNavSidebar(false);
  };

  const handleSubmitClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    performSubmit(false);
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keys if dialog is open
      if (showConfirmDialog || isTimeUp) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'a':
        case 'A':
        case '1':
          e.preventDefault();
          handleAnswerSelect('a');
          break;
        case 'b':
        case 'B':
        case '2':
          e.preventDefault();
          handleAnswerSelect('b');
          break;
        case 'c':
        case 'C':
        case '3':
          e.preventDefault();
          handleAnswerSelect('c');
          break;
        case 'd':
        case 'D':
        case '4':
          e.preventDefault();
          handleAnswerSelect('d');
          break;
        case 'Enter':
          e.preventDefault();
          if (isLastQuestion) {
            handleSubmitClick();
          } else {
            handleNext();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, isLastQuestion, showConfirmDialog, isTimeUp]);

  const selectedAnswer = answers[currentQuestion.number];
  const unansweredCount = exam.questions.length - answeredCount;
  const isTimeCritical = isTimed && timeRemaining < TIME_THRESHOLDS.CRITICAL_SECONDS;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 flex gap-6">
        {/* Question Navigation Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Preguntas</h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((question, index) => {
                const isAnswered = answers[question.number] !== undefined;
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={question.number}
                    onClick={() => handleQuestionJump(index)}
                    aria-label={`Ir a pregunta ${question.number}${isAnswered ? ', respondida' : ', sin responder'}${isCurrent ? ', actual' : ''}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : isAnswered
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {question.number}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-gray-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 rounded"></div>
                <span className="text-gray-600">Respondida</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span className="text-gray-600">Sin responder</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Question Navigation Overlay */}
        {showNavSidebar && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowNavSidebar(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Preguntas</h3>
                <button
                  onClick={() => setShowNavSidebar(false)}
                  aria-label="Cerrar navegación"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((question, index) => {
                  const isAnswered = answers[question.number] !== undefined;
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.number}
                      onClick={() => handleQuestionJump(index)}
                      className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : isAnswered
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {question.number}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{exam.title}</h1>
              <button
                onClick={() => setShowNavSidebar(true)}
                aria-label="Abrir navegación de preguntas"
                className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm font-medium">Preguntas</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-sm flex-wrap gap-2">
              <span className="text-gray-600">
                {exam.subject} • {exam.year}
              </span>
              {isTimed && (
                <div
                  role="timer"
                  aria-live={isTimeCritical ? 'assertive' : 'polite'}
                  aria-label={`Tiempo restante: ${formatTime(timeRemaining)}`}
                  className={`flex items-center gap-2 font-semibold ${
                    isTimeCritical ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  <Timer className="w-4 h-4" aria-hidden="true" />
                  <span>Tiempo restante: {formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-sm mt-3">
              <span className="text-gray-600">
                Pregunta {currentQuestionIndex + 1} de {exam.questions.length}
              </span>
              <span className="text-gray-600">
                Respondidas: {answeredCount} / {exam.questions.length}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="mb-6">
              <div className="text-sm font-semibold text-blue-600 mb-2">
                PREGUNTA {currentQuestion.number}
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {(['a', 'b', 'c', 'd'] as AnswerOption[]).map((option) => (
                <label
                  key={option}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAnswer === option
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.number}`}
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => handleAnswerSelect(option)}
                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <span className="font-semibold text-gray-700 mr-2">
                      {option.toUpperCase()}.
                    </span>
                    <span className="text-gray-900">
                      {currentQuestion.options[option]}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isFirstQuestion
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmitClick}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  {isSubmitting ? 'Entregando...' : 'Entregar examen'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Helper Text */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>Puedes navegar entre las preguntas y cambiar tus respuestas antes de entregar el examen.</p>
            <p className="hidden md:block text-xs text-gray-400">
              Atajos: ← → para navegar • A/B/C/D o 1/2/3/4 para responder • Enter para continuar
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 id="confirm-dialog-title" className="text-lg font-semibold text-gray-900">
                Confirmar entrega
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                ¿Estás seguro de que quieres entregar el examen?
              </p>
              {unansweredCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm font-medium">
                    Tienes {unansweredCount} {unansweredCount === 1 ? 'pregunta sin responder' : 'preguntas sin responder'}.
                  </p>
                </div>
              )}
              {unansweredCount === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">
                    Has respondido todas las preguntas.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelSubmit}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Entregando...' : 'Entregar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Up Overlay */}
      {isTimeUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Timer className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¡Tiempo agotado!
            </h3>
            <p className="text-gray-600">
              El examen se está entregando automáticamente...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
