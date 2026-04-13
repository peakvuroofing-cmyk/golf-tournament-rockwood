import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Clock, Heart, Trophy, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About NorTex Society | Fort Worth Charity Golf Tournament 2026',
  description:
    'NorTex Society is a Fort Worth, TX community organization dedicated to supporting youth sports programs across Tarrant County. We fund local kids\' athletic leagues, equipment, and opportunities through charity events like our annual golf tournament at Rockwood Park.',
  keywords: [
    'NorTex Society',
    'Fort Worth charity organization',
    'Tarrant County youth sports',
    'Fort Worth youth sports donations',
    'Fort Worth community golf tournament',
    'charity golf Fort Worth TX',
    'kids sports funding Fort Worth',
    'youth athletics Tarrant County',
    'Fort Worth nonprofit golf event',
    'Rockwood Park Golf Tournament',
  ],
  openGraph: {
    title: 'About NorTex Society | Fort Worth Community Organization',
    description: 'Supporting youth sports programs across Fort Worth and Tarrant County, TX.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* SEO-rich hidden context for crawlers */}
      <div className="sr-only">
        <h1>NorTex Society — Fort Worth, Texas Community Organization</h1>
        <p>NorTex Society is a Fort Worth, TX based community group that raises funds to support youth sports programs throughout Tarrant County, including Fort Worth, Haltom City, Saginaw, Azle, and surrounding North Texas communities.</p>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-navy via-secondary-800 to-secondary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/logo-nortex-crest.png"
              alt="NorTex Society Logo"
              width={100}
              height={100}
              className="object-contain mb-6"
            />
            <p className="text-sm uppercase tracking-widest text-primary-400 mb-3">Fort Worth, Texas</p>
            <h1 className="text-4xl sm:text-5xl font-bold font-serif mb-4">About NorTex Society</h1>
            <p className="text-primary-300 text-lg max-w-2xl">
              A North Texas community organization dedicated to empowering local youth through sports
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Who We Are */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-600 font-semibold mb-2">Who We Are</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">NorTex Society — Community First</h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                <strong>NorTex Society</strong> is a Fort Worth, Texas community organization built on a simple belief: every kid in North Texas deserves the chance to play. We bring together local businesses, neighbors, and sports enthusiasts to raise funds that go directly to <strong>youth athletic programs throughout Tarrant County</strong>.
              </p>
              <p>
                From youth football and soccer leagues to baseball, basketball, and track programs — we fund equipment, registration fees, uniforms, and field access for kids who need it most across Fort Worth, Haltom City, Saginaw, Azle, and surrounding North Texas communities.
              </p>
              <p>
                Our flagship fundraiser is the <strong>NorTex Society Charity Golf Tournament</strong>, held annually at Rockwood Park Golf Course in Fort Worth, TX. Every dollar raised at the tournament goes back into the community.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Heart className="w-8 h-8" />, label: 'Mission', value: 'Youth Sports Funding', desc: 'Supporting kids\' athletic programs across North Texas' },
              { icon: <MapPin className="w-8 h-8" />, label: 'Based In', value: 'Fort Worth, TX', desc: 'Serving Tarrant County and surrounding communities' },
              { icon: <Users className="w-8 h-8" />, label: 'Who We Help', value: 'Local Kids', desc: 'All youth sports — football, soccer, baseball, basketball & more' },
              { icon: <Trophy className="w-8 h-8" />, label: 'Fundraiser', value: 'Annual Golf Tournament', desc: 'Rockwood Park Golf Course — June 20, 2026' },
            ].map((item) => (
              <div key={item.label} className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-5 shadow ring-1 ring-primary-100">
                <div className="text-primary-600 mb-3">{item.icon}</div>
                <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold mb-1">{item.label}</p>
                <p className="font-bold text-gray-900 text-sm mb-1">{item.value}</p>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Fund */}
        <div className="bg-gradient-to-r from-navy to-secondary-900 text-white rounded-3xl p-10 mb-20">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-primary-400 mb-2">Our Impact</p>
            <h2 className="text-3xl font-bold font-serif">We Fund Local Kids&apos; Sports</h2>
            <p className="text-secondary-300 mt-3 max-w-2xl mx-auto">
              Every sport, every kid, every community. NorTex Society donates to youth athletic programs of all kinds across Fort Worth and Tarrant County, TX.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
            {[
              { icon: '🏈', sport: 'Football' },
              { icon: '⚽', sport: 'Soccer' },
              { icon: '⚾', sport: 'Baseball' },
              { icon: '🏀', sport: 'Basketball' },
              { icon: '🎾', sport: 'Tennis' },
              { icon: '🏃', sport: 'Track & Field' },
            ].map((s) => (
              <div key={s.sport} className="bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition-colors">
                <div className="text-4xl mb-2">{s.icon}</div>
                <p className="font-semibold text-sm">{s.sport}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Tournament */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-600 font-semibold mb-2">Our Fundraiser</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">The Charity Golf Tournament</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The <strong>NorTex Society Charity Golf Tournament</strong> is held at the historic <strong>Rockwood Park Golf Course</strong> — a Fort Worth landmark opened in 1938 and renovated in 2015 with a $5.1 million redesign. The course plays up to 7,053 yards at Par 72 with stunning views of the Fort Worth skyline.
              </p>
              <p>
                Join us <strong>Saturday, June 20, 2026</strong> for 18 holes, a catered BBQ lunch, prizes, and community. Whether you register as an individual or bring a team of 4, you&apos;re directly funding youth sports in your community.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-700"><MapPin className="w-5 h-5 text-primary-600 shrink-0" /><span>Rockwood Park Golf Course — 1851 Jacksboro Hwy, Fort Worth, TX 76114</span></div>
              <div className="flex items-center gap-3 text-gray-700"><Clock className="w-5 h-5 text-primary-600 shrink-0" /><span>Saturday, June 20, 2026 · Registration 7:00 AM · Shotgun Start 8:00 AM</span></div>
              <div className="flex items-center gap-3 text-gray-700"><Phone className="w-5 h-5 text-primary-600 shrink-0" /><span>Rockwood Pro Shop: (817) 392-6560</span></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/flyer.jpg"
                alt="NorTex Society Charity Golf Tournament 2026 — Rockwood Park Fort Worth TX"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Local Area SEO section */}
        <div className="bg-primary-50 rounded-3xl p-10 ring-1 ring-primary-100 mb-16">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest text-primary-600 font-semibold mb-2">Serving North Texas</p>
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Fort Worth &amp; Tarrant County Communities</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              NorTex Society supports youth sports programs in communities across the Dallas–Fort Worth metroplex, with a focus on underserved kids in Tarrant County.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['Fort Worth', 'Haltom City', 'Saginaw', 'Azle', 'Richland Hills', 'North Richland Hills', 'Watauga', 'Keller', 'Westworth Village', 'River Oaks'].map((city) => (
              <span key={city} className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow ring-1 ring-primary-100">
                {city}, TX
              </span>
            ))}
          </div>
          <p className="text-center text-gray-600 text-sm max-w-xl mx-auto">
            If your youth sports organization is based in the Fort Worth or Tarrant County area and could benefit from our support, we want to hear from you.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Make a Difference?</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">Register for the tournament, become a sponsor, or reach out to learn how NorTex Society can support your youth sports program.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg">
              Register for the Tournament
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl transition-colors shadow ring-1 ring-gray-200">
              Contact NorTex Society
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
