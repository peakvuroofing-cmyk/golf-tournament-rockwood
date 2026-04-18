import { MapPin, Phone, Mail, Clock, Flag } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0f0f0f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex flex-col items-center gap-2 mb-3">
            <p className="text-sm uppercase tracking-widest text-primary-400">Get in Touch</p>
            <span className="h-px w-12 bg-primary-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif mb-4 tracking-tight">Contact NorTex Society</h1>
          <p className="text-secondary-300 text-lg max-w-xl mx-auto">
            Questions about registration, sponsorship, or the event? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Cards */}
          <div className="space-y-5">
            <div className="bg-secondary-800 border border-secondary-700 rounded-2xl p-6 shadow flex items-start gap-4">
              <div className="bg-primary-500 text-secondary-900 rounded-xl p-3 shrink-0"><MapPin className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-white mb-1">Location</h3>
                <p className="text-secondary-300">Rockwood Park Golf Course</p>
                <p className="text-secondary-400 text-sm">1851 Jacksboro Hwy, Fort Worth, TX 76114</p>
              </div>
            </div>

            <div className="bg-secondary-800 border border-secondary-700 rounded-2xl p-6 shadow flex items-start gap-4">
              <div className="bg-primary-500 text-secondary-900 rounded-xl p-3 shrink-0"><Phone className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-white mb-1">Phone</h3>
                <p className="text-secondary-300">(817) 392-6560</p>
                <p className="text-secondary-400 text-sm">Pro shop during business hours</p>
              </div>
            </div>

            <div className="bg-secondary-800 border border-secondary-700 rounded-2xl p-6 shadow flex items-start gap-4">
              <div className="bg-primary-500 text-secondary-900 rounded-xl p-3 shrink-0"><Mail className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-white mb-1">Email</h3>
                <a href="mailto:info@rockwoodgolftournament.com" className="text-primary-400 hover:text-primary-300 font-medium">
                  info@rockwoodgolftournament.com
                </a>
                <p className="text-secondary-400 text-sm mt-0.5">We respond within 24 hours</p>
              </div>
            </div>

            <div className="bg-secondary-800 border border-secondary-700 rounded-2xl p-6 shadow flex items-start gap-4">
              <div className="bg-primary-500 text-secondary-900 rounded-xl p-3 shrink-0"><Clock className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-white mb-1">Tournament Day</h3>
                <p className="text-secondary-300">Saturday, June 20, 2026</p>
                <p className="text-secondary-400 text-sm">Registration 7:00 AM · Shotgun Start 8:00 AM</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <div className="bg-[#0f0f0f] text-white rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 text-primary-400">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { label: 'Register for the Tournament', href: '/register' },
                  { label: 'View BBQ Menu', href: '/bbq-menu' },
                  { label: 'Sponsorship Opportunities', href: '/sponsors' },
                  { label: 'Donate to the Cause', href: '/donate' },
                  { label: 'About Rockwood Park', href: '/about' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors group"
                  >
                    <span className="font-medium">{link.label}</span>
                    <span className="text-primary-400 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-primary-500 rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-2"><Flag aria-hidden="true" className="h-8 w-8 text-secondary-900" strokeWidth={1.75} /></div>
              <h3 className="font-bold text-secondary-900 text-lg mb-2">Ready to Play?</h3>
              <p className="text-secondary-800 text-sm mb-4">Spots are limited — register today to secure your place.</p>
              <Link
                href="/register"
                className="inline-block px-6 py-2.5 bg-secondary-900 text-primary-400 font-bold rounded-xl hover:bg-secondary-800 transition-colors"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
