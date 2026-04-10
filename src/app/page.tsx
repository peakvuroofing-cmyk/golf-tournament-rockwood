import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Users } from 'lucide-react';
import { PhotoGallery } from '@/components/PhotoGallery';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Golf Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy via-secondary-600 to-primary-700 text-white">
        {/* Corner logos */}
        <div className="absolute top-4 left-4 z-10">
          <Image
            src="/logo-rockwood.png"
            alt="Rockwood Park Golf Course"
            width={400}
            height={200}
            className="object-contain mix-blend-screen"
            style={{ filter: 'invert(1)' }}
          />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <Image
            src="/logo-fortworthgolf.png"
            alt="Fort Worth Golf"
            width={400}
            height={200}
            className="object-contain mix-blend-screen"
          />
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Banner Text */}
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-3 mb-6">
                <Image src="/logo-nortex.jpg" alt="NorTex Society" width={56} height={56} className="rounded-xl object-cover shadow-lg" />
                <span className="px-4 py-2 bg-primary-500 rounded-full text-sm font-bold text-white tracking-wide">NORTEX SOCIETY</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-4 font-serif">
                CHARITY GOLF TOURNAMENT
              </h1>
              <p className="text-xl text-primary-100 mb-4 font-semibold">
                Hosted at Rockwood Park Golf Course
              </p>
              <p className="text-lg text-gray-200 mb-8">
                Saturday, June 20, 2026 • Registration 7:00 AM • Shotgun Start 8:00 AM
              </p>
              <Link
                href="/register"
                className="inline-block px-10 py-5 bg-white text-primary-700 hover:bg-primary-50 font-extrabold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl ring-4 ring-white/40 tracking-wide"
              >
                ⛳ REGISTER YOUR TEAM TODAY
              </Link>
            </div>

            {/* Right: Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pricing Cards — clickable */}
              <Link
                href="/register"
                className="group bg-white bg-opacity-95 rounded-lg p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 hover:ring-2 hover:ring-primary-400 cursor-pointer"
              >
                <div className="text-5xl font-bold text-primary-600 mb-2">$135</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Individual</h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>18 Holes of Golf</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>BBQ Lunch Included</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>Awards &amp; Prizes</li>
                </ul>
                <span className="text-primary-600 font-semibold text-sm group-hover:underline">Register →</span>
              </Link>

              <Link
                href="/register"
                className="group bg-primary-600 text-white rounded-lg p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 hover:bg-primary-700 hover:ring-2 hover:ring-white/40 cursor-pointer"
              >
                <div className="text-5xl font-bold mb-2">$500</div>
                <h3 className="text-2xl font-bold mb-4">Team of 4</h3>
                <ul className="space-y-2 text-primary-50 mb-4">
                  <li className="flex items-center"><span className="w-2 h-2 bg-white rounded-full mr-2"></span>Best Value Option</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-white rounded-full mr-2"></span>$125 per player</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-white rounded-full mr-2"></span>Come Together 🏌️</li>
                </ul>
                <span className="text-white font-semibold text-sm group-hover:underline">Register →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Flyer Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Flyer poster */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-200 rounded-3xl blur-2xl opacity-30 scale-105" />
                <Image
                  src="/flyer.jpg"
                  alt="Rockwood Park Charity Golf Tournament 2026"
                  width={460}
                  height={640}
                  className="relative rounded-3xl shadow-2xl ring-4 ring-primary-100 w-full max-w-sm lg:max-w-md"
                />
              </div>
            </div>

            {/* Action panel */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Image src="/logo-nortex.jpg" alt="NorTex Society" width={48} height={48} className="rounded-lg object-cover shadow" />
                  <span className="text-sm uppercase tracking-widest text-primary-600 font-bold">NorTex Society Presents</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 font-serif mb-4">Join Us on the Course</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  NorTex Society is proud to host its Charity Golf Tournament on <strong>Saturday, June 20, 2026</strong> at Rockwood Park Golf Course in Fort Worth. All proceeds support local charities and community programs.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Date', value: 'June 20, 2026' },
                  { label: 'Registration', value: '7:00 AM' },
                  { label: 'Shotgun Start', value: '8:00 AM' },
                  { label: 'Format', value: 'Shotgun Start' },
                ].map((item) => (
                  <div key={item.label} className="bg-primary-50 rounded-xl p-4 ring-1 ring-primary-100">
                    <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold mb-1">{item.label}</p>
                    <p className="font-bold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="flex-1 text-center px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg text-lg"
                >
                  $135 — Individual
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center px-6 py-4 bg-navy hover:bg-secondary-800 text-white font-bold rounded-xl transition-colors shadow-lg text-lg"
                >
                  $500 — Team of 4
                </Link>
              </div>

              <p className="text-sm text-gray-500 text-center">
                BBQ lunch included with all registrations · <Link href="/bbq-menu" className="text-primary-600 hover:underline">View menu →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 font-serif">
            Rockwood Park Golf Course
          </h2>
          <PhotoGallery />
        </div>
      </div>

      {/* Course Information */}
      <div id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg p-12">
            <h2 className="text-4xl font-bold text-secondary-900 mb-6 font-serif">About Rockwood Park</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                The original Rockwood Park Golf Course was opened for play in 1938 and was designed by Golf Course Architect John Bredemus. In November 2015, the course underwent a comprehensive $5.1 Million renovation led by the design team of John Colligan and associate Trey Kemp.
              </p>
              <p className="mb-4">
                The renovation included a new routing plan with new greens, tees, fairways, bunkering system, and drainage. The course was lengthened to play up to 7,053 yards with four sets of tees ranging from 5,400 to 7,100 yards, playing to a Par 72.
              </p>
              <p>
                For more information, call the pro shop at <span className="font-semibold text-primary-600">(817) 392-6560</span> or visit us at 1851 Jacksboro Hwy, Fort Worth, TX 76114.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BBQ Menu Section */}
      <div id="bbq-menu" className="bg-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Menu */}
            <div>
              <h2 className="text-4xl font-bold text-secondary-900 mb-8 font-serif">
                Tournament BBQ Menu
              </h2>
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-primary-600 text-2xl mr-4">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">BBQ Chicken OR Jalapeño Sausage</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 text-2xl mr-4">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">Potato Salad, Baked Beans, BBQ Sauce</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 text-2xl mr-4">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">Rolls, Pickles, Onions</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 text-2xl mr-4">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">Unsweetened Tea & Water</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <MapPin className="w-8 h-8 text-primary-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Venue</h3>
                    <p className="text-gray-700">Rockwood Golf Course</p>
                    <p className="text-gray-600">1851 Jacksboro Hwy</p>
                    <p className="text-gray-600">Fort Worth, TX 76114</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <Clock className="w-8 h-8 text-primary-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Schedule</h3>
                    <p className="text-gray-700"><span className="font-semibold">Registration:</span> 7:00 AM</p>
                    <p className="text-gray-700"><span className="font-semibold">Shotgun Start:</span> 8:00 AM</p>
                    <p className="text-gray-700"><span className="font-semibold">Date:</span> Saturday, June 20, 2026</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-600 text-white rounded-lg p-6 shadow-lg">
                <div className="flex items-start">
                  <Users className="w-8 h-8 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Supporting Local Charities</h3>
                    <p className="text-primary-100">All proceeds benefit the community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 font-serif">
            What&apos;s Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '⛳', title: '18 Holes of Golf', desc: 'Championship course shotgun start format' },
              { icon: '🏆', title: 'Prizes & Awards', desc: 'Compete for amazing prizes and recognition' },
              { icon: '🍖', title: 'Catered BBQ', desc: 'Delicious tournament lunch included' },
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div id="sponsors" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-slate-500 mb-3">Our Sponsors</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Thank You to Our Sponsors</h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            This tournament is made possible by the generous support of our sponsors. Interested in sponsoring? Reach out to us — various packages are available.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="bg-white rounded-xl p-5 shadow flex flex-col items-center w-44">
              <Image src="/sponsor-ktr-fences.jpg" alt="KTR Fences" width={120} height={120} className="object-contain mb-3" style={{ mixBlendMode: 'multiply' }} />
              <p className="font-semibold text-gray-800 text-sm text-center">KTR Fences</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow flex flex-col items-center w-44">
              <Image src="/sponsor-peakvu.jpg" alt="PeakVu Property Services" width={120} height={120} className="object-contain mb-3" style={{ mixBlendMode: 'multiply' }} />
              <p className="font-semibold text-gray-800 text-sm text-center">PeakVu Property Services</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow flex flex-col items-center w-44">
              <Image src="/sponsor-lemon-squeeze.jpg" alt="T's Lemon Squeeze" width={120} height={120} className="object-contain mb-3" style={{ mixBlendMode: 'multiply' }} />
              <p className="font-semibold text-gray-800 text-sm text-center">T&apos;s Lemon Squeeze</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow flex flex-col items-center w-44">
              <Image src="/sponsor-tlc-designs.png" alt="TLC Custom Designs" width={120} height={120} className="object-contain mb-3" style={{ mixBlendMode: 'multiply' }} />
              <p className="font-semibold text-gray-800 text-sm text-center">TLC Custom Designs</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow flex flex-col items-center w-44">
              <Image src="/sponsor-globe-life.jpg" alt="Globe Life Insurance" width={120} height={120} className="object-contain mb-3" style={{ mixBlendMode: 'multiply' }} />
              <p className="font-semibold text-gray-800 text-sm text-center">Globe Life Insurance</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow flex flex-col items-center w-44">
              <Image src="/sponsor-baker-services.jpg" alt="Baker Services" width={120} height={120} className="object-contain mb-3" style={{ mixBlendMode: 'multiply' }} />
              <p className="font-semibold text-gray-800 text-sm text-center">Baker Services</p>
            </div>
          </div>
          <a
            href="mailto:info@rockwoodgolftournament.com?subject=Sponsorship Inquiry"
            className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors"
          >
            Become a Sponsor
          </a>
        </div>
      </div>

      {/* Donate Section */}
      <div id="donate" className="py-16 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-slate-500 mb-3">Give Back</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Donate to the Cause</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can&apos;t make it to the tournament? You can still make a difference. All donations go directly to supporting local charities and community programs in the Fort Worth area.
          </p>
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-left max-w-xl mx-auto">
            <h3 className="font-bold text-gray-900 mb-4">Your donation supports:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-3 flex-shrink-0"></span>Local youth sports programs</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-3 flex-shrink-0"></span>Community food banks and outreach</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-primary-600 rounded-full mr-3 flex-shrink-0"></span>Fort Worth area charitable organizations</li>
            </ul>
          </div>
          <a
            href="mailto:info@rockwoodgolftournament.com?subject=Donation Inquiry"
            className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors"
          >
            Contact Us to Donate
          </a>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-slate-500 mb-3">Get in Touch</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Contact Us</h2>
          <p className="text-gray-600 mb-10">Questions about registration, sponsorship, or the event? We&apos;d love to hear from you.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 shadow">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600 text-sm">Rockwood Park Golf Course</p>
              <p className="text-gray-600 text-sm">1851 Jacksboro Hwy</p>
              <p className="text-gray-600 text-sm">Fort Worth, TX 76114</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
              <a href="tel:8173926560" className="text-primary-600 hover:text-primary-700 font-semibold">(817) 392-6560</a>
              <p className="text-gray-500 text-sm mt-1">Pro Shop</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow">
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <a href="mailto:info@rockwoodgolftournament.com" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">info@rockwoodgolftournament.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-secondary-700 to-secondary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center gap-8">
            {/* Left sponsor */}
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <Image
                  src="/sponsor-ktr-fences.jpg"
                  alt="KTR Fences - Tournament Sponsor"
                  width={160}
                  height={160}
                  className="object-contain rounded-lg"
                />
                <p className="text-center text-gray-600 text-xs mt-2 font-semibold">Tournament Sponsor</p>
              </div>
            </div>

            {/* Center CTA */}
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4 font-serif">Ready to Tee Off?</h2>
              <p className="text-xl text-secondary-100 mb-8 max-w-2xl mx-auto">
                Limited spots available. Secure your registration today and join us for an unforgettable day of golf.
              </p>
              <Link
                href="/register"
                className="inline-block px-10 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                REGISTER NOW
              </Link>
            </div>

            {/* Right sponsor */}
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <Image
                  src="/sponsor-peakvu.jpg"
                  alt="PeakVu Property Services - Tournament Sponsor"
                  width={160}
                  height={160}
                  className="object-contain rounded-lg"
                />
                <p className="text-center text-gray-600 text-xs mt-2 font-semibold">Tournament Sponsor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}