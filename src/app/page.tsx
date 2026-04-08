import Link from 'next/link';
import { EventDetailsCard } from '@/components/EventDetailsCard';
import { PricingCard } from '@/components/PricingCard';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Join the
          <span className="text-primary-600 block">Charity Golf Tournament</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Support a great cause while enjoying a day of golf at beautiful Rockwood Park Golf Course.
          Individual and team registrations available.
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          Register Now
        </Link>
      </div>

      {/* Event Details and Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <EventDetailsCard />
        <PricingCard />
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What's Included</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">⛳</div>
            <h3 className="font-semibold text-gray-900 mb-2">18 Holes of Golf</h3>
            <p className="text-gray-600">Shotgun start format for maximum fun</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🍖</div>
            <h3 className="font-semibold text-gray-900 mb-2">BBQ Lunch</h3>
            <p className="text-gray-600">Delicious catered meal included</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="font-semibold text-gray-900 mb-2">Prizes & Awards</h3>
            <p className="text-gray-600">Great prizes for winners and fun awards</p>
          </div>
        </div>
      </div>

      {/* Charity Section */}
      <div className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Support Local Charities</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          All proceeds from this tournament go directly to supporting local charities and community programs.
          Your participation makes a real difference.
        </p>
        <Link
          href="/register"
          className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          Register Today
        </Link>
      </div>
    </div>
  );
}