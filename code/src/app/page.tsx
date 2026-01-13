import { Suspense } from 'react';
import MarketingNav from '@/components/MarketingNav';
import { getNauticalSchools } from '@/data/nauticalSchools';
import HomeContent from './HomeContent';

// Loading component for Suspense boundary
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center mb-8">
            <div className="h-16 bg-white/20 rounded-lg mx-auto max-w-2xl mb-4 animate-pulse"></div>
            <div className="h-8 bg-white/20 rounded-lg mx-auto max-w-xl animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main page component - async server component
export default async function Home() {
  const schools = await getNauticalSchools();
  const featuredSchools = schools.filter(school => school.featured);

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <Suspense fallback={<LoadingSkeleton />}>
        <HomeContent featuredSchools={featuredSchools} />
      </Suspense>
    </div>
  );
}
