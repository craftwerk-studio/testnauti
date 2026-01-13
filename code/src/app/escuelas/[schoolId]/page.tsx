import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import MarketingNav from '@/components/MarketingNav';
import { getNauticalSchools } from '@/data/nauticalSchools';

// Generate static params for all schools (SSG)
export async function generateStaticParams() {
  const schools = await getNauticalSchools();
  return schools.map((school) => ({
    schoolId: school.id,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}): Promise<Metadata> {
  const { schoolId } = await params;
  const schools = await getNauticalSchools();
  const school = schools.find((s) => s.id === schoolId);

  if (!school) {
    return {
      title: 'Escuela no encontrada',
    };
  }

  const title = `${school.name} - Escuela Náutica en ${school.city} | TestNauti`;
  const description = `${school.description} Cursos disponibles: ${school.courses.join(', ')}. Ubicada en ${school.address}.`;

  return {
    title,
    description,
    keywords: [
      'escuela náutica',
      school.city,
      school.province,
      school.region,
      'PER',
      'patrón embarcaciones recreo',
      ...school.courses,
      school.name,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'es_ES',
      url: `https://testnauti.co/escuelas/${school.id}`,
      siteName: 'TestNauti',
      images: school.image
        ? [
            {
              url: school.image,
              width: 1200,
              height: 630,
              alt: school.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: school.image ? [school.image] : undefined,
    },
    alternates: {
      canonical: `https://testnauti.co/escuelas/${school.id}`,
    },
  };
}

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;
  const schools = await getNauticalSchools();
  const school = schools.find((s) => s.id === schoolId);

  if (!school) {
    notFound();
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: school.name,
    description: school.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: school.address,
      addressLocality: school.city,
      addressRegion: school.province,
      addressCountry: 'ES',
    },
    ...(school.phone && { telephone: school.phone }),
    ...(school.email && { email: school.email }),
    ...(school.website && { url: school.website }),
    ...(school.image && { image: school.image }),
    offers: school.courses.map((course: string) => ({
      '@type': 'Course',
      name: course,
      provider: {
        '@type': 'EducationalOrganization',
        name: school.name,
      },
    })),
  };

  // Find related schools in the same region
  const relatedSchools = schools
    .filter((s) => s.region === school.region && s.id !== school.id)
    .slice(0, 3);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        <MarketingNav />

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 overflow-hidden">
          {school.image && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${school.image})` }}
            />
          )}
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumbs */}
            <nav className="mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Inicio
                  </Link>
                </li>
                <li className="text-white/60">/</li>
                <li>
                  <Link
                    href="/escuelas"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Escuelas
                  </Link>
                </li>
                <li className="text-white/60">/</li>
                <li className="text-white font-medium" aria-current="page">
                  {school.name}
                </li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              {school.featured && (
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <svg
                    className="w-5 h-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-semibold text-sm">
                    Escuela Destacada
                  </span>
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {school.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="drop-shadow">
                    {school.city}, {school.province}
                  </span>
                </div>
                <span className="text-white/60">•</span>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="drop-shadow">{school.region}</span>
                </div>
              </div>
              <p className="text-xl text-white/90 drop-shadow mb-8">
                {school.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image */}
              {school.image && (
                <section>
                  <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={school.image}
                      alt={`${school.name} - Escuela náutica en ${school.city}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  </div>
                </section>
              )}

              {/* Courses */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Cursos Disponibles
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {school.courses.map((course: string) => (
                    <div
                      key={course}
                      className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4 text-center"
                    >
                      <div className="text-3xl mb-2">⛵</div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {course}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* About */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sobre {school.name}
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {school.description}
                  </p>
                </div>
              </section>

              {/* Location */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ubicación
                </h2>
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <address className="not-italic text-gray-700">
                      <p className="font-semibold text-gray-900 mb-1">
                        {school.address}
                      </p>
                      <p className="text-sm">
                        {school.city}, {school.province}
                      </p>
                      <p className="text-sm text-gray-600">{school.region}</p>
                    </address>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Contact & CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Contact Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Información de Contacto
                  </h3>
                  <div className="space-y-4">
                    {school.phone && (
                      <a
                        href={`tel:${school.phone}`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <svg
                          className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600">
                            {school.phone}
                          </p>
                        </div>
                      </a>
                    )}

                    {school.email && (
                      <a
                        href={`mailto:${school.email}`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <svg
                          className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 break-all">
                            {school.email}
                          </p>
                        </div>
                      </a>
                    )}

                    {school.website && (
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <svg
                          className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Web</p>
                          <p className="font-medium text-blue-600 group-hover:text-blue-700 break-all">
                            Visitar sitio web →
                          </p>
                        </div>
                      </a>
                    )}

                    {/* Social Media Links */}
                    {(school.facebook || school.instagram || school.linkedin || school.twitter) && (
                      <div className="p-3 rounded-lg border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-600 mb-3">Redes sociales</p>
                        <div className="flex items-center gap-3">
                          {school.facebook && (
                            <a
                              href={school.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 transition-all"
                              aria-label="Facebook"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                            </a>
                          )}
                          {school.instagram && (
                            <a
                              href={school.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:text-white text-gray-600 transition-all"
                              aria-label="Instagram"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </a>
                          )}
                          {school.linkedin && (
                            <a
                              href={school.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white text-gray-600 transition-all"
                              aria-label="LinkedIn"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                          )}
                          {school.twitter && (
                            <a
                              href={school.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-black hover:text-white text-gray-600 transition-all"
                              aria-label="X (Twitter)"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="text-xl font-bold mb-2">
                    ¿Ya estás matriculado?
                  </h3>
                  <p className="text-white/90 mb-6 text-sm leading-relaxed">
                    Practica para tu examen del PER con tests reales y mejora tu
                    puntuación
                  </p>
                  <Link
                    href="/sign-up"
                    className="block w-full bg-white text-blue-600 hover:bg-gray-50 text-center px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    Comenzar a practicar
                  </Link>
                </div>

                {/* Browse More */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Buscar más escuelas
                  </h3>
                  <Link
                    href={`/escuelas?search=${encodeURIComponent(school.city)}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium block mb-2"
                  >
                    → Ver más escuelas en {school.city}
                  </Link>
                  <Link
                    href="/escuelas"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium block"
                  >
                    → Ver todas las escuelas
                  </Link>
                </div>

                {/* For school owners */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-3xl mb-2">🏫</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ¿Es tu escuela?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Reclama tu perfil, actualiza tu información o solicita destacar tu escuela
                  </p>
                  <Link
                    href={`/escuelas/${school.id}/actualizar`}
                    className="block text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    Actualizar mi escuela →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Schools */}
          {relatedSchools.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Otras escuelas en {school.region}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedSchools.map((relatedSchool) => (
                  <Link
                    key={relatedSchool.id}
                    href={`/escuelas/${relatedSchool.id}`}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all group"
                  >
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedSchool.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {relatedSchool.city}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {relatedSchool.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {relatedSchool.courses.slice(0, 3).map((course: string) => (
                        <span
                          key={course}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                        >
                          {course}
                        </span>
                      ))}
                      {relatedSchool.courses.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          +{relatedSchool.courses.length - 3}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 mt-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-center text-gray-600 text-sm">
              © 2025 TestNauti. Directorio de escuelas náuticas en España.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

