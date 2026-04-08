import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_EVENT_NAME || 'Golf Tournament Registration',
  description: 'Register for the Rockwood Park Golf Course Charity Golf Tournament',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-white flex flex-col">
          {/* Premium Header */}
          <header className="bg-gradient-to-r from-navy via-secondary-800 to-secondary-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
                  <div className="text-2xl font-serif font-bold">🏌️</div>
                  <div className="hidden sm:block">
                    <h1 className="text-sm font-semibold text-primary-300">ROCKWOOD PARK</h1>
                    <p className="text-xs text-primary-200">Charity Golf Tournament</p>
                  </div>
                </Link>
                <nav className="flex space-x-8 items-center">
                  <Link href="/" className="text-primary-100 hover:text-white font-medium transition-colors">
                    Home
                  </Link>
                  <Link href="/register" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                    Register
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Premium Footer */}
          <footer className="bg-gradient-to-r from-navy to-secondary-900 text-white border-t-4 border-primary-600 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Event Info */}
                <div>
                  <h3 className="font-bold text-primary-300 mb-4">EVENT INFO</h3>
                  <p className="text-sm text-gray-300 mb-2">📍 Rockwood Park Golf Course</p>
                  <p className="text-sm text-gray-300 mb-2">1851 Jacksboro Hwy, Fort Worth, TX 76114</p>
                  <p className="text-sm text-gray-300">📞 (817) 392-6560</p>
                </div>
                
                {/* Schedule */}
                <div>
                  <h3 className="font-bold text-primary-300 mb-4">SCHEDULE</h3>
                  <p className="text-sm text-gray-300 mb-2">📅 Saturday, June 20, 2026</p>
                  <p className="text-sm text-gray-300 mb-2">⏰ Registration: 7:00 AM</p>
                  <p className="text-sm text-gray-300">⛳ Shotgun Start: 8:00 AM</p>
                </div>
                
                {/* Pricing */}
                <div>
                  <h3 className="font-bold text-primary-300 mb-4">PRICING</h3>
                  <p className="text-sm text-gray-300 mb-2">💵 Individual: $135</p>
                  <p className="text-sm text-gray-300">👥 Team of 4: $500</p>
                </div>
              </div>
              
              <div className="border-t border-secondary-700 pt-6 text-center text-gray-400 text-sm">
                <p>&copy; 2026 Rockwood Park Golf Course Charity Golf Tournament</p>
                <p className="mt-2 text-xs">Supporting local charities and community programs</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}