import Link from 'next/link';
import { loadExams } from '@/lib/loadExams';
import { Clock, BookOpen, Calendar } from 'lucide-react';

export default function ExamsPage() {
  const exams = loadExams();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Exámenes de práctica disponibles
        </h1>
        <p className="text-lg text-gray-600">
          Practica con exámenes oficiales reales de años anteriores. Construye confianza experimentando condiciones y preguntas auténticas de examen.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">{exams.length}</span> exámenes disponibles
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">
              Exámenes oficiales reales
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">
              Modo de práctica cronometrado
            </span>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      {exams.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Aún no hay exámenes disponibles
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Estamos preparando exámenes oficiales auténticos para ti. ¡Vuelve pronto para comenzar a practicar!
          </p>
          <p className="text-sm text-gray-500">
            Se añaden nuevos exámenes regularmente para ayudarte a prepararte con confianza.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col"
            >
              {/* Card Header with Subject Badge */}
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {exam.subject}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {exam.year}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                  {exam.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {exam.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{exam.totalQuestions} preguntas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{exam.durationMinutes} min</span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Action Button */}
              <div className="p-6 pt-0">
                <Link
                  href={`/app/exams/${exam.id}`}
                  className="block w-full"
                >
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Empezar práctica
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Info */}
      {exams.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Cómo funciona
              </h3>
              <p className="text-sm text-blue-800">
                Cada examen contiene preguntas auténticas de convocatorias pasadas. Selecciona un examen arriba para comenzar a practicar. Irás a través de cada pregunta una por una, igual que en un examen real. Al final, verás tu puntuación y podrás revisar tus respuestas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

