'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'BBQ Menu', href: '/#bbq-menu' },
  { label: 'Become a Sponsor', href: '/#sponsors' },
  { label: 'Donate', href: '/#donate' },
  { label: 'Contact', href: '/#contact' },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-navy via-secondary-800 to-secondary-900 text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <div className="text-2xl font-serif font-bold">🏌️</div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-primary-300">ROCKWOOD PARK</h1>
              <p className="text-xs text-primary-200">Charity Golf Tournament</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary-100 hover:text-white font-medium transition-colors text-sm whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              Register
            </Link>
          </nav>

          {/* Mobile: Register + Hamburger */}
          <div className="flex items-center space-x-3 lg:hidden">
            <Link
              href="/register"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Register
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg hover:bg-secondary-700 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden bg-secondary-900 border-t border-secondary-700">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-primary-100 hover:text-white font-medium transition-colors py-2 border-b border-secondary-800 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
