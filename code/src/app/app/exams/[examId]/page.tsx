import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findExamById } from '@/lib/loadExams';
import { Clock, BookOpen, ChevronRight, AlertCircle } from 'lucide-react';
import StartTestSection from './StartTestSection';

interface ExamDetailPageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { examId } = await params;
  const exam = findExamById(examId);

  // If exam not found, show 404
  if (!exam) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Examen no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            El examen que buscas no existe o ha sido eliminado.
          </p>
          <Link
            href="/app/exams"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <BookOpen className="w-4 h-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <Link
          href="/app/exams"
          className="hover:text-blue-600 transition-colors"
        >
          Exámenes
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{exam.title}</span>
      </nav>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
              {exam.subject}
            </span>
            <span className="text-lg font-semibold text-gray-500">
              {exam.year}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {exam.title}
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            {exam.description}
          </p>
        </div>

        {/* Metadata Section */}
        <div className="p-8 bg-gray-50 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Detalles del examen
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total de preguntas</div>
                <div className="text-xl font-bold text-gray-900">
                  {exam.totalQuestions}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Duración</div>
                <div className="text-xl font-bold text-gray-900">
                  {exam.durationMinutes} minutos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Antes de comenzar
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <span>Todas las preguntas son de opción múltiple con <strong>cuatro opciones (a, b, c, d)</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <span>Cada pregunta tiene <strong>solo una respuesta correcta</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <span>Puedes navegar entre las preguntas y cambiar tus respuestas</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <span>Tu puntuación se mostrará después de entregar el examen</span>
            </li>
          </ul>
        </div>

        <StartTestSection examId={exam.id} durationMinutes={exam.durationMinutes} />
      </div>

      {/* Bottom Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Modo de práctica
            </h3>
            <p className="text-sm text-blue-800">
              Esta es una prueba de práctica basada en preguntas reales de exámenes pasados. Tómate tu tiempo para entender cada pregunta y construir confianza para el examen real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

