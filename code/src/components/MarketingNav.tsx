import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function MarketingNav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              TestNauti
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/escuelas"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Escuelas
              </Link>
              {/* Hidden for launch - will be re-enabled later */}
              {false && (
                <Link
                  href="/test"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  Tests
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              {/* Hidden for launch - will be re-enabled later */}
              {false && (
                <>
                  <Link
                    href="/sign-in"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Comenzar
                  </Link>
                </>
              )}
            </SignedOut>
            <SignedIn>
              <Link
                href="/app/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Mi progreso
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

