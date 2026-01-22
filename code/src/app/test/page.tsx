'use client';

import Link from 'next/link';
import MarketingNav from '@/components/MarketingNav';
import { useState } from 'react';
import { pastExams } from '@/data/pastExams';

type SortOption = 'date' | 'community';

export default function TestPage() {
  const [sortBy, setSortBy] = useState<SortOption>('date');

  // Ordenar exámenes según la opción seleccionada
  const sortedExams = [...pastExams].sort((a, b) => {
    if (sortBy === 'date') {
      // Ordenar por fecha (más reciente primero)
      return b.dateSort.localeCompare(a.dateSort);
    } else {
      // Ordenar por comunidad autónoma (alfabéticamente)
      return a.community.localeCompare(b.community);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <MarketingNav />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              ⚓ Tests Oficiales PER
            </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Practica con exámenes reales
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              de anteriores convocatorias
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Prepárate para tu examen PER con tests auténticos de convocatorias oficiales. 
            Practica en condiciones reales, recibe feedback instantáneo y mejora tu rendimiento.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/sign-up"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto"
            >
              🚀 Crear Cuenta Gratis
            </Link>
            <Link
              href="/sign-in"
              className="bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-4 rounded-full text-lg font-semibold w-full sm:w-auto transition-all duration-200"
            >
              Ya tengo cuenta
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            ✓ Sin tarjeta de crédito • ✓ Acceso inmediato • ✓ 100% Gratis
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-500">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Exámenes Oficiales
            </h3>
            <p className="text-gray-600">
              Practica con preguntas reales de convocatorias anteriores del PER
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-cyan-500">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Condiciones Reales
            </h3>
            <p className="text-gray-600">
              Cronómetro opcional para simular el examen real y gestionar tu tiempo
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-teal-500">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Feedback Instantáneo
            </h3>
            <p className="text-gray-600">
              Revisa tus respuestas y aprende de tus errores al instante
            </p>
          </div>
        </div>

        {/* Future Plans Banner */}
        <div className="mb-16 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-800">
                Próximamente: Exámenes por Comunidad Autónoma
              </h3>
              <p className="mt-2 text-blue-700">
                Estamos trabajando para añadir exámenes específicos de cada Comunidad Autónoma.
                Pronto podrás practicar con tests oficiales de Andalucía, Cataluña, Galicia, País Vasco y más.
              </p>
            </div>
          </div>
        </div>

        {/* Available Tests Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Tests Disponibles
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Actualmente disponemos del examen oficial PER de la convocatoria de Noviembre 2025.
              Estamos añadiendo más exámenes de anteriores convocatorias próximamente.
            </p>

            {/* Filtros de ordenación */}
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('date')}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    sortBy === 'date'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  📅 Fecha
                </button>
                <button
                  onClick={() => setSortBy('community')}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    sortBy === 'community'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  🗺️ Comunidad
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedExams.map((exam, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{exam.icon}</span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {exam.date}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {exam.community}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="mr-2">📋</span>
                      <span>{exam.questions} preguntas</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">⏰</span>
                      <span>{exam.duration} duración</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para empezar a practicar?
          </h2>
          <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
            Únete a miles de estudiantes que ya están practicando para aprobar su examen PER
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Crear mi cuenta gratis ahora
          </Link>
          <p className="mt-6 text-blue-100 text-sm">
            No necesitas tarjeta de crédito. Empieza en menos de 1 minuto.
          </p>
        </div>
      </main>
    </div>
  );
}

