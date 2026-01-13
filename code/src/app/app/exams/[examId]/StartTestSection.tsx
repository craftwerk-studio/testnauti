'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';

interface StartTestSectionProps {
  examId: string;
  durationMinutes: number;
}

export default function StartTestSection({ examId, durationMinutes }: StartTestSectionProps) {
  const [timerEnabled, setTimerEnabled] = useState(true);

  const handleStartTest = () => {
    window.location.href = `/app/exams/${examId}/test?timed=${timerEnabled}`;
  };

  return (
    <>
      {/* Timer Option */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={timerEnabled}
            onChange={(e) => setTimerEnabled(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Practicar con temporizador (recomendado)
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Experimenta condiciones de examen realistas con un temporizador de cuenta atrás de {durationMinutes} minutos
            </div>
          </div>
        </label>
      </div>

      {/* Action Section */}
      <div className="p-8 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleStartTest}
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow-sm"
          >
            <PlayCircle className="w-5 h-5" />
            Comenzar el examen
          </button>
          <Link
            href="/app/exams"
            className="w-full sm:w-auto"
          >
            <button className="w-full sm:w-auto text-gray-600 hover:text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors duration-200">
              Volver al catálogo
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

