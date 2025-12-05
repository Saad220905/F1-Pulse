'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">F1</span>
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              F1 Pulse
            </span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname === '/'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Predictor
            </Link>
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname === '/dashboard'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/drivers"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname?.startsWith('/drivers')
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Drivers
            </Link>
            <Link
              href="/standings"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname === '/standings'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Standings
            </Link>
            <Link
              href="/what-is-f1"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname === '/what-is-f1'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

