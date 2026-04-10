import Link from 'next/link';

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy via-secondary-800 to-secondary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-primary-300 mb-3">Give Back</p>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif mb-4">Donate to the Cause</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Can&apos;t make it to the tournament? Support NorTex Society and make a difference in the Fort Worth community.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Impact section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '⚽', title: 'Youth Sports', desc: 'Supporting local youth athletic programs and leagues in Tarrant County' },
            { icon: '🍱', title: 'Food Outreach', desc: 'Community food banks and meal programs for families in need' },
            { icon: '🤝', title: 'Local Charities', desc: 'Fort Worth area non-profits making a difference every day' },
          ].map((item) => (
            <div key={item.title} className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl p-6 shadow ring-1 ring-primary-100 text-center">
              <div className="text-5xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Donate CTA */}
        <div className="bg-gradient-to-r from-navy to-secondary-900 text-white rounded-3xl p-10 text-center mb-8">
          <div className="text-5xl mb-4">💚</div>
          <h2 className="text-3xl font-bold mb-3">Every Dollar Counts</h2>
          <p className="text-primary-100 max-w-lg mx-auto mb-8">
            All proceeds from the NorTex Society Golf Tournament go directly to supporting local charities and community programs in the Fort Worth area. No amount is too small.
          </p>
          <a
            href="mailto:info@rockwoodgolftournament.com?subject=Donation Inquiry — Rockwood Golf Tournament"
            className="inline-block px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg text-lg"
          >
            Contact Us to Donate →
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
