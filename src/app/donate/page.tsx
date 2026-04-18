import Link from 'next/link';
import { Flag, UtensilsCrossed, Heart } from 'lucide-react';

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0f0f0f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex flex-col items-center gap-2 mb-3">
            <p className="text-sm uppercase tracking-widest text-primary-400">Give Back</p>
            <span className="h-px w-12 bg-primary-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif mb-4 tracking-tight">Donate to the Cause</h1>
          <p className="text-secondary-300 text-lg max-w-2xl mx-auto">
            Can&apos;t make it to the tournament? Support NorTex Society and make a difference in the Fort Worth community.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Impact section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { Icon: Flag, title: 'Youth Sports', desc: 'Supporting local youth athletic programs and leagues in Tarrant County' },
            { Icon: UtensilsCrossed, title: 'Food Outreach', desc: 'Community food banks and meal programs for families in need' },
            { Icon: Heart, title: 'Local Charities', desc: 'Fort Worth area non-profits making a difference every day' },
          ].map((item) => (
            <div key={item.title} className="bg-secondary-800 border border-secondary-700 rounded-2xl p-6 shadow ring-1 ring-primary-500/10 text-center">
              <div className="flex justify-center mb-3"><item.Icon aria-hidden="true" className="h-8 w-8 text-primary-400" strokeWidth={1.75} /></div>
              <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
              <p className="text-secondary-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Donate CTA */}
        <div className="bg-[#0f0f0f] text-white rounded-3xl p-10 text-center mb-8">
          <div className="flex justify-center mb-4"><Heart aria-hidden="true" className="h-12 w-12 text-primary-400" strokeWidth={1.75} /></div>
          <h2 className="text-3xl font-bold mb-3">Every Dollar Counts</h2>
          <p className="text-secondary-300 max-w-lg mx-auto mb-8">
            All proceeds from the NorTex Society Golf Tournament go directly to supporting local charities and community programs in the Fort Worth area. No amount is too small.
          </p>
          <a
            href="mailto:info@rockwoodgolftournament.com?subject=Donation Inquiry — Rockwood Golf Tournament"
            className="inline-block px-10 py-4 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold rounded-xl transition-colors shadow-lg text-lg"
          >
            Contact Us to Donate &rarr;
          </a>
        </div>

        {/* Participate instead */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center ring-1 ring-gray-100">
          <h3 className="font-bold text-gray-900 text-xl mb-2">Want to Participate Instead?</h3>
          <p className="text-gray-600 mb-5">Join us on the course June 20, 2026. Individual spots and team packages available.</p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            Register for the Tournament
          </Link>
        </div>
      </div>
    </div>
  );
}
