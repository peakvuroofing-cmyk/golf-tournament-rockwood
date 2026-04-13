import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Users } from 'lucide-react';
import { PhotoGallery } from '@/components/PhotoGallery';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-secondary-900">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary-900 text-white">
        {/* Gold glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500 opacity-10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-600 opacity-10 rounded-full blur-[100px]" />
        </div>

        {/* Corner venue logos — Fort Worth Golf on LEFT, Rockwood on RIGHT */}
        <div className="absolute top-4 left-4 z-10 opacity-50 hover:opacity-80 transition-opacity">
          <Image src="/logo-fortworthgolf.png" alt="Fort Worth Golf" width={200} height={80} className="object-contain" />
        </div>
        <div className="absolute top-4 right-4 z-10 opacity-50 hover:opacity-80 transition-opacity">
          <Image src="/logo-rockwood.png" alt="Rockwood Park Golf Course" width={200} height={80} className="object-contain" style={{ filter: 'invert(1)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div className="text-center lg:text-left">
              {/* First Annual Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/50 text-primary-400 rounded-full px-5 py-2 text-sm font-bold tracking-widest uppercase mb-6">
                ⭐ First Annual Event · 2026
              </div>

              {/* NorTex Crest — large, matching logo prominence */}
              <div className="flex items-center gap-5 justify-center lg:justify-start mb-5">
                <Image
                  src="/logo-nortex-crest.png"
                  alt="NorTex Society"
                  width={150}
                  height={150}
                  className="object-contain drop-shadow-2xl"
                />
                <span className="text-primary-400 font-bold text-xl tracking-widest uppercase">NorTex Society</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold mb-3 leading-tight font-serif">
                <span className="text-white">CHARITY GOLF</span><br />
                <span className="text-primary-400">TOURNAMENT</span>
              </h1>

              <p className="text-secondary-300 text-lg mb-2">Hosted at <span className="text-white font-semibold">Rockwood Park Golf Course</span> · Fort Worth, TX</p>
              <p className="text-secondary-300 mb-8">Saturday, June 20, 2026 · Registration 7:00 AM · Shotgun Start 8:00 AM</p>

              <Link
                href="/register"
                className="inline-block px-10 py-5 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-extrabold text-xl rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-primary-500/30 tracking-wide"
              >
                ⛳ REGISTER YOUR TEAM TODAY
              </Link>
              <p className="mt-4 text-secondary-400 text-sm">$135 Individual · $500 Team of 4 · BBQ Included</p>
            </div>

            {/* Right — Pricing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Link href="/register" className="group bg-secondary-800 border border-secondary-700 hover:border-primary-500 rounded-2xl p-7 shadow-xl hover:shadow-primary-500/20 transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl font-extrabold text-primary-400 mb-1">$135</div>
                <h3 className="text-xl font-bold text-white mb-4">Individual</h3>
                <ul className="space-y-2 text-secondary-300 text-sm mb-4">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />18 Holes of Golf</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />BBQ Lunch Included</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />Awards &amp; Prizes</li>
                </ul>
                <span className="text-primary-400 text-sm font-semibold group-hover:underline">Register →</span>
              </Link>

              <Link href="/register" className="group bg-primary-500 hover:bg-primary-400 rounded-2xl p-7 shadow-xl hover:shadow-primary-500/40 transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl font-extrabold text-secondary-900 mb-1">$500</div>
                <h3 className="text-xl font-bold text-secondary-900 mb-4">Team of 4</h3>
                <ul className="space-y-2 text-secondary-800 text-sm mb-4">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary-900 rounded-full" />Best Value Option</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary-900 rounded-full" />$125 per player</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary-900 rounded-full" />Come Together 🏌️</li>
                </ul>
                <span className="text-secondary-900 text-sm font-semibold group-hover:underline">Register →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── FIRST ANNUAL BANNER ──────────────────────────────────────────── */}
      <div className="bg-primary-500 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-secondary-900 text-sm font-bold uppercase tracking-widest mb-2">Mark Your Calendar</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary-900 font-serif mb-3">
            The 1st Annual NorTex Society Charity Golf Tournament
          </h2>
          <p className="text-secondary-800 text-lg max-w-2xl mx-auto mb-6">
            Be part of history — this is the inaugural event. Join Fort Worth&apos;s newest charity golf tradition and help us raise funds for youth sports programs across Tarrant County.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-secondary-900">
            {[
              { icon: '📅', label: 'June 20, 2026' },
              { icon: '📍', label: 'Rockwood Park Golf Course' },
              { icon: '⏰', label: 'Shotgun Start 8:00 AM' },
              { icon: '🏆', label: 'Prizes & Awards' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 bg-secondary-900/10 rounded-full px-4 py-2 font-semibold text-sm">
                <span>{item.icon}</span>{item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLYER SECTION ────────────────────────────────────────────────── */}
      <div className="py-20 bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500 rounded-3xl blur-3xl opacity-20 scale-110" />
                <Image src="/flyer.jpg" alt="NorTex Society First Annual Charity Golf Tournament 2026" width={460} height={640}
                  className="relative rounded-3xl shadow-2xl ring-2 ring-primary-500/30 w-full max-w-sm lg:max-w-md" />
              </div>
            </div>

            <div className="space-y-6 text-white">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Image src="/logo-nortex-crest.png" alt="NorTex Society" width={56} height={56} className="object-contain" />
                  <span className="text-primary-400 text-sm uppercase tracking-widest font-bold">NorTex Society Presents</span>
                </div>
                <h2 className="text-4xl font-bold font-serif mb-2">
                  Our <span className="text-primary-400">First Annual</span> Tournament
                </h2>
                <p className="text-secondary-300 text-lg leading-relaxed">
                  NorTex Society is proud to launch its first charity golf tournament on <strong className="text-white">Saturday, June 20, 2026</strong> at Rockwood Park Golf Course in Fort Worth. All proceeds go directly to youth sports programs across North Texas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Date', value: 'June 20, 2026' },
                  { label: 'Registration', value: '7:00 AM' },
                  { label: 'Shotgun Start', value: '8:00 AM' },
                  { label: 'Format', value: 'Shotgun Start' },
                ].map((item) => (
                  <div key={item.label} className="bg-secondary-700 border border-secondary-600 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-primary-400 font-semibold mb-1">{item.label}</p>
                    <p className="font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="flex-1 text-center px-6 py-4 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold rounded-xl transition-colors shadow-lg text-lg">
                  $135 — Individual
                </Link>
                <Link href="/register" className="flex-1 text-center px-6 py-4 bg-white hover:bg-gray-100 text-secondary-900 font-bold rounded-xl transition-colors shadow-lg text-lg">
                  $500 — Team of 4
                </Link>
              </div>

              <p className="text-secondary-400 text-sm text-center">
                BBQ lunch included · <Link href="/bbq-menu" className="text-primary-400 hover:underline">View menu →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PHOTO GALLERY ────────────────────────────────────────────────── */}
      <div className="py-16 bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-primary-400 text-sm uppercase tracking-widest font-semibold mb-2">The Venue</p>
          <h2 className="text-4xl font-bold text-center text-white mb-12 font-serif">Rockwood Park Golf Course</h2>
          <PhotoGallery />
        </div>
      </div>

      {/* ── ABOUT / BBQ ──────────────────────────────────────────────────── */}
      <div id="about" className="py-16 bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary-700 border border-secondary-600 rounded-2xl p-10">
            <h2 className="text-4xl font-bold text-white mb-4 font-serif">About Rockwood Park</h2>
            <div className="space-y-3 text-secondary-300 text-lg leading-relaxed">
              <p>The original Rockwood Park Golf Course was opened for play in 1938 and designed by Golf Course Architect John Bredemus. In November 2015, the course underwent a $5.1 Million renovation led by John Colligan and associate Trey Kemp.</p>
              <p>The renovation included new greens, tees, fairways, bunkering, and drainage — lengthened to play up to <span className="text-white font-semibold">7,053 yards</span> with four tee sets, playing to a <span className="text-white font-semibold">Par 72</span>.</p>
              <p>Pro Shop: <span className="text-primary-400 font-semibold">(817) 392-6560</span> · 1851 Jacksboro Hwy, Fort Worth, TX 76114</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BBQ MENU ─────────────────────────────────────────────────────── */}
      <div id="bbq-menu" className="py-16 bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold mb-2">Included With Registration</p>
              <h2 className="text-4xl font-bold text-white mb-6 font-serif">Tournament BBQ Menu</h2>
              <div className="bg-secondary-800 border border-secondary-700 rounded-2xl p-6 space-y-4">
                {[
                  'BBQ Chicken OR Jalapeño Sausage',
                  'Potato Salad, Baked Beans, BBQ Sauce',
                  'Rolls, Pickles, Onions',
                  'Unsweetened Tea & Water',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="text-primary-400 text-xl font-bold">✓</span>
                    <p className="text-white font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { Icon: MapPin, title: 'Venue', lines: ['Rockwood Golf Course', '1851 Jacksboro Hwy', 'Fort Worth, TX 76114'] },
                { Icon: Clock, title: 'Schedule', lines: ['Registration: 7:00 AM', 'Shotgun Start: 8:00 AM', 'Saturday, June 20, 2026'] },
              ].map(({ Icon, title, lines }) => (
                <div key={title} className="bg-secondary-800 border border-secondary-700 rounded-2xl p-6 flex items-start gap-4">
                  <Icon className="w-7 h-7 text-primary-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white mb-2">{title}</h3>
                    {lines.map(l => <p key={l} className="text-secondary-300 text-sm">{l}</p>)}
                  </div>
                </div>
              ))}
              <div className="bg-primary-500 rounded-2xl p-6 flex items-start gap-4">
                <Users className="w-7 h-7 text-secondary-900 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-secondary-900 mb-1">Supporting Local Charities</h3>
                  <p className="text-secondary-800 text-sm">All proceeds fund youth sports in Fort Worth &amp; Tarrant County</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────────────────── */}
      <div className="py-16 bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-primary-400 text-sm uppercase tracking-widest font-semibold mb-2">Every Registration Includes</p>
          <h2 className="text-4xl font-bold text-center text-white mb-12 font-serif">What&apos;s Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '⛳', title: '18 Holes of Golf', desc: 'Championship course shotgun start format' },
              { icon: '🏆', title: 'Prizes & Awards', desc: 'Compete for amazing prizes and recognition' },
              { icon: '🍖', title: 'Catered BBQ Lunch', desc: 'Full BBQ spread included with every registration' },
            ].map((item) => (
              <div key={item.title} className="bg-secondary-700 border border-secondary-600 hover:border-primary-500 rounded-2xl p-8 text-center transition-colors">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-secondary-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SPONSORS ─────────────────────────────────────────────────────── */}
      <div id="sponsors" className="py-16 bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold mb-2">Community Partners</p>
          <h2 className="text-3xl font-bold text-white mb-3 font-serif">Thank You to Our Sponsors</h2>
          <p className="text-secondary-400 mb-10 max-w-2xl mx-auto">The NorTex Society Golf Tournament is made possible by the generous support of local businesses.</p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { src: '/sponsor-ktr-fences.jpg', name: 'KTR Fences' },
              { src: '/sponsor-peakvu.jpg', name: 'PeakVu Property Services' },
              { src: '/sponsor-lemon-squeeze.jpg', name: "T's Lemon Squeeze" },
              { src: '/sponsor-tlc-designs.png', name: 'TLC Custom Designs' },
              { src: '/sponsor-globe-life.jpg', name: 'Globe Life Insurance' },
              { src: '/sponsor-baker-services.jpg', name: 'Baker Services' },
            ].map((s) => (
              <div key={s.name} className="bg-white rounded-xl p-4 shadow-lg flex flex-col items-center w-40 hover:shadow-primary-500/20 hover:shadow-xl transition-shadow">
                <Image src={s.src} alt={s.name} width={100} height={100} className="object-contain mb-2 h-24 w-auto" style={{ mixBlendMode: 'multiply' }} />
                <p className="font-semibold text-gray-800 text-xs text-center">{s.name}</p>
              </div>
            ))}
          </div>
          <a href="mailto:info@rockwoodgolftournament.com?subject=Sponsorship Inquiry"
            className="inline-block px-8 py-3 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold rounded-xl transition-colors">
            Become a Sponsor
          </a>
        </div>
      </div>

      {/* ── DONATE ───────────────────────────────────────────────────────── */}
      <div id="donate" className="py-16 bg-secondary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold mb-2">Give Back</p>
          <h2 className="text-3xl font-bold text-white mb-4 font-serif">Donate to the Cause</h2>
          <p className="text-secondary-300 mb-6 max-w-2xl mx-auto">
            Can&apos;t make it to the tournament? You can still make a difference. All donations go directly to youth sports programs in Fort Worth.
          </p>
          <div className="bg-secondary-700 border border-secondary-600 rounded-2xl p-8 mb-8 text-left max-w-xl mx-auto">
            <h3 className="font-bold text-white mb-4">Your donation supports:</h3>
            <ul className="space-y-3">
              {['Local youth sports programs', 'Community food banks and outreach', 'Fort Worth area charitable organizations'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-secondary-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <a href="mailto:info@rockwoodgolftournament.com?subject=Donation Inquiry"
            className="inline-block px-8 py-3 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold rounded-xl transition-colors">
            Contact Us to Donate
          </a>
        </div>
      </div>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <div id="contact" className="py-16 bg-secondary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold mb-2">Get in Touch</p>
          <h2 className="text-3xl font-bold text-white mb-4 font-serif">Contact Us</h2>
          <p className="text-secondary-300 mb-10">Questions about registration, sponsorship, or the event? We&apos;d love to hear from you.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📍', title: 'Location', lines: ['Rockwood Park Golf Course', '1851 Jacksboro Hwy', 'Fort Worth, TX 76114'] },
              { icon: '📞', title: 'Phone', lines: ['(817) 392-6560', 'Pro Shop'] },
              { icon: '✉️', title: 'Email', lines: ['info@rockwoodgolftournament.com'] },
            ].map((card) => (
              <div key={card.title} className="bg-secondary-800 border border-secondary-700 rounded-2xl p-6 hover:border-primary-500 transition-colors">
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-bold text-white mb-2">{card.title}</h3>
                {card.lines.map(l => <p key={l} className="text-secondary-300 text-sm">{l}</p>)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <div className="bg-primary-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center gap-8">
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <Image src="/sponsor-ktr-fences.jpg" alt="KTR Fences" width={140} height={140} className="object-contain rounded-lg" />
                <p className="text-center text-gray-600 text-xs mt-2 font-semibold">Tournament Sponsor</p>
              </div>
            </div>
            <div className="text-center">
              <Image src="/logo-nortex-crest.png" alt="NorTex Society" width={90} height={90} className="object-contain mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold text-secondary-900 mb-2 font-serif">Ready to Tee Off?</h2>
              <p className="text-secondary-800 mb-6 max-w-sm mx-auto">Limited spots for our <strong>First Annual</strong> tournament. Secure your place today.</p>
              <Link href="/register"
                className="inline-block px-10 py-4 bg-secondary-900 hover:bg-secondary-800 text-primary-400 font-extrabold text-lg rounded-2xl transition-all hover:scale-105 shadow-lg">
                REGISTER NOW
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <Image src="/sponsor-peakvu.jpg" alt="PeakVu Property Services" width={140} height={140} className="object-contain rounded-lg" />
                <p className="text-center text-gray-600 text-xs mt-2 font-semibold">Tournament Sponsor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
