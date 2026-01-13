'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { NauticalSchool } from '@/data/nauticalSchools.backup';

interface EscuelasContentProps {
  schools: NauticalSchool[];
  regions: string[];
  cities: string[];
}

export default function EscuelasContent({ schools, regions, cities }: EscuelasContentProps) {
  const searchParams = useSearchParams();
  const [searchCity, setSearchCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Aplicar búsqueda desde URL al cargar la página
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchCity(searchFromUrl);
    }
  }, [searchParams]);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar ciudades según búsqueda
  const filteredCities = useMemo(() => {
    if (!searchCity) return cities;
    return cities.filter(city =>
      city.toLowerCase().includes(searchCity.toLowerCase())
    );
  }, [searchCity, cities]);

  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      // Filter out inactive schools
      const isActive = school.status !== 'Inactive';

      const matchesCity = !searchCity ||
        school.city.toLowerCase().includes(searchCity.toLowerCase());

      const matchesRegion = selectedRegion === 'all' || school.region === selectedRegion;
      const matchesFeatured = !showOnlyFeatured || school.featured;

      return isActive && matchesCity && matchesRegion && matchesFeatured;
    });
  }, [schools, searchCity, selectedRegion, showOnlyFeatured]);

  return (
    <>
      {/* Hero Section - Estilo Airbnb */}
      <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Encuentra tu escuela náutica
            </h1>
            <p className="text-xl text-white/90 drop-shadow">
              Descubre las mejores escuelas para sacarte el PER en España
            </p>
          </div>

          {/* Barra de búsqueda principal */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-full shadow-2xl p-2">
              <div className="flex flex-col md:flex-row gap-2">
                {/* Búsqueda de ciudad */}
                <div ref={searchRef} className="flex-1 relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchCity}
                      onChange={(e) => {
                        setSearchCity(e.target.value);
                        setShowCityDropdown(true);
                      }}
                      onFocus={() => setShowCityDropdown(true)}
                      className="block w-full pl-14 pr-4 py-4 text-base border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="¿Dónde quieres estudiar?"
                    />
                  </div>

                  {/* Dropdown de ciudades */}
                  {showCityDropdown && searchCity && filteredCities.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 max-h-80 overflow-auto">
                      {filteredCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSearchCity(city);
                            setShowCityDropdown(false);
                          }}
                          className="w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span className="text-gray-900">{city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botón de búsqueda */}
                <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 md:w-auto">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar
                </button>
              </div>
            </div>

            {/* Filtros rápidos */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all flex items-center gap-2 border border-white/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filtros
              </button>

              <button
                onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  showOnlyFeatured
                    ? 'bg-white text-blue-600 border-white shadow-lg'
                    : 'bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30'
                }`}
              >
                ⭐ Solo destacadas
              </button>
            </div>

            {/* Ciudades populares */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <span className="text-white/80 text-sm">Ciudades populares:</span>
              {['Barcelona', 'Madrid', 'Valencia', 'Sevilla', 'Málaga'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSearchCity(city);
                    setShowCityDropdown(false);
                  }}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all border border-white/30"
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Panel de filtros expandido */}
            {showFilters && (
              <div className="mt-4 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Región
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Todas las regiones</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Results header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredSchools.length} {filteredSchools.length === 1 ? 'escuela encontrada' : 'escuelas encontradas'}
          </h2>
          {(searchCity || selectedRegion !== 'all' || showOnlyFeatured) && (
            <button
              onClick={() => {
                setSearchCity('');
                setSelectedRegion('all');
                setShowOnlyFeatured(false);
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Schools grid */}
        {filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <Link
                key={school.id}
                href={`/escuelas/${school.id}`}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
              >
                {school.featured && school.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={school.image}
                      alt={school.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ Destacada
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {school.name}
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
                    {school.city}, {school.region}
                  </p>
                  {school.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {school.description}
                    </p>
                  )}
                  {school.courses.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {school.courses.slice(0, 3).map((course) => (
                        <span
                          key={course}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                        >
                          {course}
                        </span>
                      ))}
                      {school.courses.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          +{school.courses.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No encontramos escuelas
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus filtros o buscar en otra ciudad
            </p>
            <button
              onClick={() => {
                setSearchCity('');
                setSelectedRegion('all');
                setShowOnlyFeatured(false);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Ver todas las escuelas
            </button>
          </div>
        )}

        {/* Call to Action for schools */}
        <div className="mt-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-5xl mb-4">🏫</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Tienes una escuela náutica?
            </h2>
            <p className="text-xl text-white/90 mb-6">
              Registra tu escuela gratis y llega a miles de futuros patrones
            </p>
            <Link
              href="/para-escuelas"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all"
            >
              Registrar mi escuela →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
