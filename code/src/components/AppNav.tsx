import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function AppNav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/app/dashboard" className="text-2xl font-bold text-blue-600">
              TestNauti
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/app/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Mi progreso
              </Link>
              <Link
                href="/app/exams"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Exámenes
              </Link>
              <Link
                href="/app/settings"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Ajustes
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

