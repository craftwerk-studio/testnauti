import Link from 'next/link';
import MarketingNav from '@/components/MarketingNav';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escuela no encontrada
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Lo sentimos, la escuela que buscas no existe en nuestro directorio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/escuelas"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Ver todas las escuelas
            </Link>
            <Link
              href="/"
              className="bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

