import Link from 'next/link';
import MarketingNav from '@/components/MarketingNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Para Escuelas Náuticas - Promociona tu Escuela',
  description: 'Aumenta la visibilidad de tu escuela náutica en España. Llega a miles de estudiantes que buscan su escuela ideal para sacarse el PER.',
  keywords: ['escuela náutica', 'promoción escuela náutica', 'publicidad escuela náutica', 'marketing náutico', 'directorio escuelas náuticas'],
};

export default function ParaEscuelasPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      
      <main>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center">
              <div className="inline-block mb-4">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                  🏫 Para Escuelas Náuticas
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                Aumenta la visibilidad de tu escuela náutica
              </h1>
              <p className="text-xl text-white/90 drop-shadow max-w-3xl mx-auto mb-8">
                Llega a miles de estudiantes que buscan su escuela ideal para sacarse el PER. 
                Destaca entre la competencia y atrae más alumnos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:escuelas@testnauti.co?subject=Quiero destacar mi escuela náutica"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  📧 Contactar ahora
                </a>
                <a
                  href="#planes"
                  className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200"
                >
                  Ver planes y precios
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="text-5xl font-bold text-blue-600 mb-2">+10K</div>
                <div className="text-gray-600">Estudiantes al mes</div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="text-5xl font-bold text-blue-600 mb-2">+500</div>
                <div className="text-gray-600">Búsquedas diarias</div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="text-5xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Enfocado en náutica</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué aparecer en TestNauti?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plataforma de referencia para estudiantes que buscan su escuela náutica ideal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-500">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Audiencia Cualificada
              </h3>
              <p className="text-gray-600">
                Llega directamente a estudiantes que buscan activamente escuelas náuticas en tu zona.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-cyan-500">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Destaca tu Escuela
              </h3>
              <p className="text-gray-600">
                Aparece en posiciones destacadas con badge especial y mayor visibilidad.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-teal-500">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Gestión Sencilla
              </h3>
              <p className="text-gray-600">
                Actualiza tu información, fotos y datos de contacto fácilmente.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-indigo-500">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Página Propia
              </h3>
              <p className="text-gray-600">
                Tu escuela tendrá una página detallada con toda tu información y cursos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-purple-500">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                SEO Optimizado
              </h3>
              <p className="text-gray-600">
                Mejora tu presencia online y aparece en búsquedas de Google.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-pink-500">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Contacto Directo
              </h3>
              <p className="text-gray-600">
                Los estudiantes pueden contactarte directamente desde tu página.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="planes" className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Planes y Precios
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Elige el plan que mejor se adapte a las necesidades de tu escuela
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Plan Básico - Gratuito */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
                <div className="bg-gray-100 px-6 py-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">Gratis</div>
                  <p className="text-gray-600">Para siempre</p>
                </div>
                <div className="px-6 py-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Ficha en el directorio</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Información básica</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Datos de contacto</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-400">Sin badge destacado</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-400">Sin fotos destacadas</span>
                    </li>
                  </ul>
                  <a
                    href="mailto:escuelas@testnauti.co?subject=Registro Plan Básico"
                    className="block w-full text-center bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Registrar mi escuela
                  </a>
                </div>
              </div>

              {/* Plan Destacado - Recomendado */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-500 transform scale-105 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Más Popular
                  </span>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 px-6 py-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Destacado</h3>
                  <div className="text-5xl font-bold text-white mb-2">49€</div>
                  <p className="text-blue-100">al mes</p>
                </div>
                <div className="px-6 py-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-900 font-medium">Todo lo del plan Básico</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-900 font-medium">Badge "Destacada" ⭐</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-900 font-medium">Aparece en carrusel home</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-900 font-medium">Fotos destacadas</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-900 font-medium">Posición prioritaria</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-900 font-medium">Página detallada con imágenes</span>
                    </li>
                  </ul>
                  <a
                    href="mailto:escuelas@testnauti.co?subject=Quiero el Plan Destacado"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    Destacar mi escuela
                  </a>
                </div>
              </div>

              {/* Plan Premium */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                  <div className="text-4xl font-bold text-white mb-2">A medida</div>
                  <p className="text-gray-300">Personalizado</p>
                </div>
                <div className="px-6 py-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-900 font-medium">Todo lo del plan Destacado</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Banners publicitarios</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Newsletter destacado</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Estadísticas avanzadas</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Soporte prioritario</span>
                    </li>
                  </ul>
                  <a
                    href="mailto:escuelas@testnauti.co?subject=Consulta Plan Premium"
                    className="block w-full text-center bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Contactar
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 text-sm">
                💡 Todos los precios son sin IVA. Puedes cancelar en cualquier momento.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section - ¿Ya tienes tu escuela registrada? */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 sm:p-12 border-2 border-cyan-200 shadow-xl">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-5xl mb-4">🏫</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                ¿Ya tienes tu escuela registrada?
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 mb-8">
                Si tu escuela ya aparece en nuestro directorio y quieres actualizar tu información 
                o contratar el plan destacado, contáctanos.
              </p>
              <a
                href="mailto:escuelas@testnauti.co?subject=Actualizar información de mi escuela"
                className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                📧 Gestionar mi escuela
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Preguntas Frecuentes
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿Cómo registro mi escuela?
                </h3>
                <p className="text-gray-600">
                  Simplemente envíanos un email a <a href="mailto:escuelas@testnauti.co" className="text-blue-600 hover:underline">escuelas@testnauti.co</a> con 
                  los datos de tu escuela y nos pondremos en contacto contigo para completar el registro.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿Puedo cambiar de plan más adelante?
                </h3>
                <p className="text-gray-600">
                  Sí, puedes actualizar o cambiar tu plan en cualquier momento. Contáctanos y te ayudaremos con el cambio.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿Cómo actualizo mi información?
                </h3>
                <p className="text-gray-600">
                  Envíanos un email con los cambios que quieres realizar y actualizaremos tu ficha en un máximo de 24-48 horas.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿Qué forma de pago aceptáis?
                </h3>
                <p className="text-gray-600">
                  Aceptamos transferencia bancaria y tarjeta de crédito. Te enviaremos los detalles tras confirmar tu plan.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿Hay permanencia?
                </h3>
                <p className="text-gray-600">
                  No, no hay permanencia. Puedes cancelar tu suscripción en cualquier momento sin penalización.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl px-8 py-12 sm:py-16 text-center shadow-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              ¿Listo para destacar tu escuela?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Únete a las escuelas náuticas que ya están aumentando su visibilidad con TestNauti
            </p>
            <a
              href="mailto:escuelas@testnauti.co?subject=Quiero destacar mi escuela náutica"
              className="inline-block bg-white text-blue-600 hover:bg-gray-50 px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Contactar ahora →
            </a>
            <p className="mt-6 text-white/80 text-sm">
              📧 escuelas@testnauti.co • Respuesta en menos de 24 horas
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
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
    </div>
  );
}

