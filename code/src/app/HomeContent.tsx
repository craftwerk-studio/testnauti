'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NauticalSchool } from '@/types/exam';

interface HomeContentProps {
  featuredSchools: NauticalSchool[];
}

export default function HomeContent({ featuredSchools }: HomeContentProps) {
  const [searchCity, setSearchCity] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      router.push(`/escuelas?search=${encodeURIComponent(searchCity)}`);
    } else {
      router.push('/escuelas');
    }
  };

  // 🎉 TestNauti is now a complete, production-ready exam practice platform!
  // Phase 7 Complete - Ready to help students succeed!
  if (typeof window !== 'undefined') {
    console.log(
      '%c🎉 TestNauti - Production Ready! 🎉',
      'color: #2563eb; font-size: 20px; font-weight: bold; padding: 10px;'
    );
    console.log(
      '%cA complete exam practice platform built with Next.js 15, TypeScript, Clerk, and Prisma.',
      'color: #4b5563; font-size: 14px;'
    );
    console.log(
      '%c✅ Interactive quiz engine\n✅ Progress tracking\n✅ Timer functionality\n✅ Mobile responsive\n✅ Ready to help students succeed!',
      'color: #059669; font-size: 12px; line-height: 1.6;'
    );
  }

  return (
    <>
      <main>
        {/* 1. Buscador Principal - Hero Style */}
        <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                  ⚓ Tu plataforma para aprobar el PER
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Encuentra tu escuela náutica
              </h1>
              <p className="text-xl text-white/90 drop-shadow max-w-2xl mx-auto">
                El directorio más completo de escuelas náuticas en España
              </p>
            </div>

            {/* Barra de búsqueda */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch}>
                <div className="bg-white rounded-full shadow-2xl p-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="block w-full pl-14 pr-4 py-4 text-base border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="¿Dónde quieres estudiar?"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Buscar
                    </button>
                  </div>
                </div>
              </form>

              {/* Ciudades populares */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <span className="text-white/80 text-sm">Ciudades populares:</span>
                {['Barcelona', 'Madrid', 'Valencia', 'Sevilla', 'Málaga'].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSearchCity(city);
                      router.push(`/escuelas?search=${encodeURIComponent(city)}`);
                    }}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all border border-white/30"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Carrusel de Escuelas Destacadas */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Escuelas Destacadas
            </h2>
            <p className="text-lg text-gray-600">
              Las mejores escuelas náuticas de España
            </p>
          </div>

          <div className="relative">
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-6 min-w-max">
                {featuredSchools.map((school) => (
                  <Link
                    key={school.id}
                    href={`/escuelas/${school.id}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 w-80 flex-shrink-0 group block"
                  >
                    {school.image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={school.image}
                          alt={school.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="320px"
                        />
                        <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-lg">
                          <span className="text-gray-900 text-xs font-bold flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Destacada
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {school.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {school.city}, {school.province}
                      </p>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {school.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {school.courses.slice(0, 3).map((course) => (
                          <span
                            key={course}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                          >
                            {course}
                          </span>
                        ))}
                        {school.courses.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{school.courses.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                        Ver detalles
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Ver todas las escuelas */}
          <div className="text-center mt-8">
            <Link
              href="/escuelas"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg"
            >
              Ver todas las escuelas
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 3. Test Gratis - Hidden for launch */}
        {false && (
          <div className="bg-gradient-to-b from-gray-50 to-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 sm:p-12 border-2 border-cyan-200 shadow-xl">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="inline-block mb-4">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      🔥 Última Convocatoria
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Practica con Tests Oficiales
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                    Haz el test de la convocatoria de <span className="font-bold text-blue-600">Julio 2024</span> y 
                    comprueba tu nivel. Examen oficial con 45 preguntas reales del PER.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                      <div className="text-3xl mb-2">📋</div>
                      <div className="text-2xl font-bold text-gray-900">45</div>
                      <div className="text-sm text-gray-600">Preguntas</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                      <div className="text-3xl mb-2">⏱️</div>
                      <div className="text-2xl font-bold text-gray-900">60</div>
                      <div className="text-sm text-gray-600">Minutos</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                      <div className="text-3xl mb-2">✓</div>
                      <div className="text-2xl font-bold text-gray-900">100%</div>
                      <div className="text-sm text-gray-600">Oficial</div>
                    </div>
                  </div>

                  <Link
                    href="/sign-up"
                    className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 px-10 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 mb-4"
                  >
                    🚀 Comenzar Test Gratis
                  </Link>
                  
                  <p className="text-sm text-gray-600 mb-8">
                    Regístrate gratis en menos de 1 minuto • Sin tarjeta de crédito
                  </p>

                  <div className="pt-6 border-t border-cyan-200">
                    <Link
                      href="/test"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-base"
                    >
                      Ver todos los tests de convocatorias anteriores
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Hero - Encuentra tu escuela y practica gratis */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                ⚓ Todo lo que necesitas
              </span>
            </div>
            <h2 className="mx-auto max-w-4xl font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Encuentra tu escuela y{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                practica gratis
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl tracking-tight text-gray-700 mb-10">
              El directorio más completo de escuelas náuticas en España. 
              Todo lo que necesitas en un solo lugar.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* Hidden for launch - will be re-enabled later */}
              {false && (
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Comenzar ahora
                </Link>
              )}
              <Link
                href="/escuelas"
                className="bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200"
              >
                Ver escuelas
              </Link>
            </div>
            
            {/* Hidden for launch - will be re-enabled later */}
            {false && (
              <p className="mt-6 text-sm text-gray-500">
                ✓ Sin tarjeta de crédito • ✓ Acceso inmediato • ✓ 100% Gratis
              </p>
            )}
          </div>
        </div>

        {/* 5. CTA Section - Hidden for launch */}
        {false && (
          <div className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl px-8 py-12 sm:py-16 text-center shadow-2xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  ¿Listo para aprobar el PER?
                </h2>
                <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                  Únete a miles de estudiantes que ya están practicando y encontrando su escuela ideal con TestNauti
                </p>
                <Link
                  href="/sign-up"
                  className="inline-block bg-white text-blue-600 hover:bg-gray-50 px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Crear mi cuenta gratis →
                </Link>
                <p className="mt-6 text-white/80 text-sm">
                  ✓ Sin tarjeta de crédito • ✓ Menos de 1 minuto • ✓ 100% Gratis
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 6. Footer */}
      <footer className="border-t border-gray-100 mt-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-600 text-sm">
            © 2026 TestNauti. Directorio de escuelas náuticas en España.{' '}
            
              Desarrollado por <a
              href="https://craftwerk.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >Craftwerk Studio
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
