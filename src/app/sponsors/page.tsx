import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';

const currentSponsors = [
  { src: '/sponsor-ktr-fences.jpg', name: 'KTR Fences' },
  { src: '/sponsor-peakvu.jpg', name: 'PeakVu Property Services' },
  { src: '/sponsor-lemon-squeeze.jpg', name: "T's Lemon Squeeze" },
  { src: '/sponsor-tlc-designs.png', name: 'TLC Custom Designs' },
  { src: '/sponsor-globe-life.jpg', name: 'Globe Life Insurance' },
  { src: '/sponsor-baker-services.jpg', name: 'Baker Services' },
];

const packages = [
  {
    name: 'Hole Sponsor',
    price: '$250',
    perks: ['Signage at one hole', 'Name in event program', 'Social media mention'],
  },
  {
    name: 'Eagle Sponsor',
    price: '$500',
    perks: ['Signage at two holes', 'Logo on event materials', 'Social media feature', 'Name announced at event'],
    highlight: true,
  },
  {
    name: 'Title Sponsor',
    price: 'Contact Us',
    perks: ['Premier course signage', 'Logo on all materials', 'Banner at registration', 'Dedicated social campaign', 'Named in event title'],
  },
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0f0f0f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex flex-col items-center gap-2 mb-3">
            <p className="text-sm uppercase tracking-widest text-primary-400">Community Partners</p>
            <span className="h-px w-12 bg-primary-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif mb-4 tracking-tight">Our Sponsors</h1>
          <p className="text-secondary-300 text-lg max-w-2xl mx-auto">
            The NorTex Society Golf Tournament is made possible by the generous support of local businesses and organizations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Current Sponsors */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10 font-serif">2026 Tournament Sponsors</h2>
        <div className="flex flex-wrap justify-center gap-8 mb-20">
          {currentSponsors.map((s) => (
            <div key={s.name} className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-slate-100 flex flex-col items-center w-48 hover:shadow-xl transition-shadow">
              <Image src={s.src} alt={s.name} width={120} height={120} className="object-contain mb-3 h-28 w-auto" style={{ mixBlendMode: 'multiply' }} />
              <p className="font-semibold text-gray-800 text-sm text-center">{s.name}</p>
            </div>
          ))}
        </div>

        {/* Sponsorship Packages */}
        <div className="bg-[#fafaf7] rounded-3xl p-10 ring-1 ring-primary-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3 font-serif">Become a Sponsor</h2>
          <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
            Support local charity while getting your brand in front of the Fort Worth community. Packages available for every budget.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl p-6 shadow-lg flex flex-col ${pkg.highlight ? 'bg-primary-600 text-white ring-4 ring-primary-400 scale-105' : 'bg-white text-gray-900'}`}
              >
                <div className={`text-sm font-semibold uppercase tracking-widest mb-2 ${pkg.highlight ? 'text-primary-200' : 'text-primary-600'}`}>{pkg.name}</div>
                <div className={`text-4xl font-bold mb-4 tabular-nums tracking-tight ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>{pkg.price}</div>
                <ul className="space-y-2 flex-1">
                  {pkg.perks.map((perk) => (
                    <li key={perk} className={`flex items-center gap-2 text-sm ${pkg.highlight ? 'text-primary-100' : 'text-gray-600'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${pkg.highlight ? 'bg-white text-primary-600' : 'bg-primary-100 text-primary-700'}`}><Check aria-hidden="true" className="w-2.5 h-2.5" strokeWidth={3} /></span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a
              href="mailto:info@rockwoodgolftournament.com?subject=Sponsorship Inquiry"
              className="inline-block px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              Contact Us About Sponsorship →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
