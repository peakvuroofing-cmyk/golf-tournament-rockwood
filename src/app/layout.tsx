import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <h1 className="text-xl font-bold text-gray-900">
                  {process.env.NEXT_PUBLIC_EVENT_NAME}
                </h1>
                <nav className="hidden md:flex space-x-8">
                  <a href="/" className="text-gray-700 hover:text-primary-600">Home</a>
                  <a href="/register" className="text-primary-600 font-medium">Register</a>
                </nav>
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="bg-white border-t mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600">
                <p>&copy; 2026 Rockwood Park Golf Course Charity Golf Tournament. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}