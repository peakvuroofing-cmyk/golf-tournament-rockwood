import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy via-secondary-800 to-secondary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-primary-300 mb-3">About the Venue</p>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif mb-4">Rockwood Park Golf Course</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">Est. 1938 — A Fort Worth landmark reimagined for championship play</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">A Historic Course, Modernized</h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                The original Rockwood Park Golf Course was opened for play in <strong>1938</strong> and was designed by Golf Course Architect <strong>John Bredemus</strong>. In November 2015, the course underwent a comprehensive <strong>$5.1 Million renovation</strong> led by the design team of John Colligan and associate Trey Kemp.
              </p>
              <p>
                The renovation included a new routing plan with new greens, tees, fairways, bunkering system, and drainage. The course was lengthened to play up to <strong>7,053 yards</strong> with four sets of tees ranging from 5,400 to 7,100 yards, playing to a <strong>Par 72</strong>.
              </p>
              <p>
                Located just minutes from downtown Fort Worth with stunning skyline views, Rockwood Park is a premier public golf experience in Tarrant County.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://www.fortworthgolf.org/media/widgetkit/rockwood-park_3-af0227a75d1b128374c831ccf5126f75.jpg"
                alt="Rockwood Park Golf Course"
                width={600}
                height={400}
                className="w-full h-72 object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-xl shadow">
                <Image
                  src="/rockwood-birds-eye.jpg"
                  alt="Rockwood Park aerial view"
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-xl shadow">
                <Image
                  src="/rockwood-green.webp"
                  alt="Rockwood Park green"
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Est.', value: '1938' },
            { label: 'Yards', value: '7,053' },
            { label: 'Par', value: '72' },
            { label: 'Renovation', value: '$5.1M' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 text-center shadow ring-1 ring-primary-100">
              <div className="text-3xl font-bold text-primary-700 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="bg-gradient-to-r from-navy to-secondary-900 text-white rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-primary-300">Find Us</h3>
            <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary-400 shrink-0" /><span>1851 Jacksboro Hwy, Fort Worth, TX 76114</span></div>
            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary-400 shrink-0" /><span>(817) 392-6560</span></div>
            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-primary-400 shrink-0" /><span>Tournament Day: Registration 7:00 AM · Shotgun Start 8:00 AM</span></div>
          </div>
          <Link href="/register" className="shrink-0 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
