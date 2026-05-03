import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MarketingNav from '@/components/MarketingNav';
import { getNauticalSchools } from '@/data/nauticalSchools';
import ClaimUpdateForm from './ClaimUpdateForm';

interface PageProps {
  params: Promise<{ schoolId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { schoolId } = await params;
  const schools = await getNauticalSchools();
  const school = schools.find((s) => s.id === schoolId);

  if (!school) {
    return { title: 'Escuela no encontrada | TestNauti' };
  }

  const title = `Actualizar ${school.name} | TestNauti`;
  const description = `Reclama la propiedad de ${school.name} o solicita actualizar su información de contacto, cursos y descripción.`;

  return {
    title,
    description,
    robots: { index: false, follow: false },
  };
}

export default async function ActualizarEscuelaPage({ params }: PageProps) {
  const { schoolId } = await params;
  const schools = await getNauticalSchools();
  const school = schools.find((s) => s.id === schoolId);

  if (!school) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <MarketingNav />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/escuelas" className="hover:text-blue-600 transition-colors">
                Escuelas
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/escuelas/${school.id}`} className="hover:text-blue-600 transition-colors">
                {school.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Actualizar</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              🏫 Gestión de Escuela
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Actualizar información de tu escuela
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reclama la propiedad de tu escuela o solicita actualizar tu información
          </p>
        </div>

        {/* School Info Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">⚓</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{school.name}</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {school.city}, {school.province}
              </p>
            </div>
          </div>
        </div>

        <ClaimUpdateForm school={school} />
      </main>
    </div>
  );
}
