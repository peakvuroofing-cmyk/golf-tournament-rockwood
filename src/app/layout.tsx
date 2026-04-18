import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavBar } from '@/components/NavBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'NorTex Society Charity Golf Tournament 2026 | Fort Worth, TX',
    template: '%s | NorTex Society',
  },
  description: 'NorTex Society hosts the 2026 Charity Golf Tournament at Rockwood Park Golf Course in Fort Worth, TX. All proceeds support youth sports programs across Tarrant County. Register today — $135 individual or $500 team of 4.',
  keywords: ['NorTex Society', 'charity golf tournament Fort Worth', 'Rockwood Park golf tournament', 'youth sports Fort Worth TX', 'Tarrant County youth athletics', 'Fort Worth community event 2026'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NorTex Society Charity Golf Tournament',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <div className="min-h-screen bg-secondary-900 flex flex-col overflow-x-hidden">
          <NavBar />

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="bg-secondary-900 text-white border-t border-secondary-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-primary-400 mb-4 uppercase tracking-widest text-sm">Event Info</h3>
                  <p className="text-sm text-secondary-300 mb-2">📍 Rockwood Park Golf Course</p>
                  <p className="text-sm text-secondary-300 mb-2">1851 Jacksboro Hwy, Fort Worth, TX 76114</p>
                  <p className="text-sm text-secondary-300">📞 (817) 392-6560</p>
                </div>
                <div>
                  <h3 className="font-bold text-primary-400 mb-4 uppercase tracking-widest text-sm">Schedule</h3>
                  <p className="text-sm text-secondary-300 mb-2">📅 Saturday, June 20, 2026</p>
                  <p className="text-sm text-secondary-300 mb-2">⏰ Registration: 7:00 AM</p>
                  <p className="text-sm text-secondary-300">⛳ Shotgun Start: 8:00 AM</p>
                </div>
                <div>
                  <h3 className="font-bold text-primary-400 mb-4 uppercase tracking-widest text-sm">Pricing</h3>
                  <p className="text-sm text-secondary-300 mb-2">💵 Individual: $135</p>
                  <p className="text-sm text-secondary-300">👥 Team of 4: $500</p>
                </div>
              </div>
              <div className="border-t border-secondary-700 pt-6 text-center text-secondary-500 text-sm">
                <p>&copy; 2026 NorTex Society · 1st Annual Charity Golf Tournament at Rockwood Park Golf Course</p>
                <p className="mt-2 text-xs">Supporting youth sports programs in Fort Worth &amp; Tarrant County, TX</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}