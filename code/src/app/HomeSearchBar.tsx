'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const POPULAR_CITIES = ['Barcelona', 'Madrid', 'Valencia', 'Sevilla', 'Málaga'];

export default function HomeSearchBar() {
  const [searchCity, setSearchCity] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchCity.trim();
    if (trimmed) {
      router.push(`/escuelas?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/escuelas');
    }
  };

  return (
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

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <span className="text-white/80 text-sm">Ciudades populares:</span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => router.push(`/escuelas?search=${encodeURIComponent(city)}`)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all border border-white/30"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
