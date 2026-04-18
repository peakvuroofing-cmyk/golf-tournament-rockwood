import Link from 'next/link';
import { UtensilsCrossed, Check } from 'lucide-react';

const menuItems = [
  { name: 'BBQ Chicken OR Jalapeño Sausage', desc: 'Your choice of slow-smoked chicken or spicy jalapeño sausage' },
  { name: 'Potato Salad & Baked Beans', desc: 'Classic southern sides with homestyle BBQ sauce' },
  { name: 'Rolls, Pickles & Onions', desc: 'Fresh rolls with all the fixings' },
  { name: 'Unsweetened Tea & Water', desc: 'Ice cold beverages to keep you refreshed on the course' },
];

export default function BBQMenuPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0f0f0f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex flex-col items-center gap-2 mb-3">
            <p className="text-sm uppercase tracking-widest text-primary-400">Included with Registration</p>
            <span className="h-px w-12 bg-primary-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif mb-4 tracking-tight">Tournament BBQ Menu</h1>
          <p className="text-secondary-300 text-lg max-w-xl mx-auto">A delicious catered BBQ lunch is included with every registration</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {menuItems.map((item) => (
            <div key={item.name} className="bg-secondary-800 rounded-2xl p-6 shadow ring-1 ring-primary-500/20 hover:shadow-lg transition-shadow border border-secondary-700">
              <div className="mb-3"><Check aria-hidden="true" className="h-6 w-6 text-primary-400" strokeWidth={1.75} /></div>
              <h3 className="font-bold text-white text-lg mb-2">{item.name}</h3>
              <p className="text-secondary-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* BBQ Choice reminder */}
        <div className="bg-primary-600 text-white rounded-2xl p-8 text-center mb-8">
          <div className="flex justify-center mb-3"><UtensilsCrossed aria-hidden="true" className="h-10 w-10" strokeWidth={1.75} /></div>
          <h3 className="text-xl font-bold mb-2">Select Your BBQ Choice at Registration</h3>
          <p className="text-primary-100 mb-6">
            When you register, you&apos;ll choose between BBQ Chicken or Jalapeño Sausage so we can prepare the right amount for everyone.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors"
          >
            Register &amp; Choose Your Meal &rarr;
          </Link>
        </div>

        {/* Note */}
        <p className="text-center text-gray-500 text-sm">
          Menu is included with all registrations — Individual ($135) and Team of 4 ($500). Vegetarian option available upon request.
        </p>
      </div>
    </div>
  );
}
