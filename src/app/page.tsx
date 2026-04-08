import Link from 'next/link';
import { MapPin, Clock, Users } from 'lucide-react';
import { PhotoGallery } from '@/components/PhotoGallery';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Golf Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy via-secondary-600 to-primary-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Banner Text */}
            <div className="text-center lg:text-left">
              <div className="inline-block px-6 py-2 bg-primary-500 rounded-full text-sm font-semibold mb-6 text-white">
                COMMUNITY CHARITY EVENT
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-4 font-serif">
                CHARITY GOLF TOURNAMENT
              </h1>
              <p className="text-xl text-primary-100 mb-4 font-semibold">
                Rockwood Park Golf Course
              </p>
              <p className="text-lg text-gray-200 mb-8">
                Saturday, June 20, 2026 • Registration 7:00 AM • Shotgun Start 8:00 AM
              </p>
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                REGISTER YOUR TEAM TODAY
              </Link>
            </div>

            {/* Right: Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pricing Cards */}
              <div className="bg-white bg-opacity-95 rounded-lg p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="text-5xl font-bold text-primary-600 mb-2">$135</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Individual</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    18 Holes of Golf
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    BBQ Lunch Included
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    Awards & Prizes
                  </li>
                </ul>
              </div>

              <div className="bg-primary-600 text-white rounded-lg p-8 shadow-xl hover:shadow-2xl transition-shadow transform hover:scale-105">
                <div className="text-5xl font-bold mb-2">$500</div>
                <h3 className="text-2xl font-bold mb-4">Team of 4</h3>
                <ul className="space-y-2 text-primary-50">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                    Best Value Option
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                    $125 per player
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                    Come Together 🏌️
                  </li>
                </ul>
              </div>
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
      <div className="py-16 bg-white">
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
      <div className="bg-secondary-50 py-16">
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

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-secondary-700 to-secondary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
      </div>
    </div>
  );
}