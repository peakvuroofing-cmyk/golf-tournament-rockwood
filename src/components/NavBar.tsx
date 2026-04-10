'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home',             href: '/' },
  { label: 'About',            href: '/about' },
  { label: 'BBQ Menu',         href: '/bbq-menu' },
  { label: 'Become a Sponsor', href: '/sponsors' },
  { label: 'Donate',           href: '/donate' },
  { label: 'Contact',          href: '/contact' },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="bg-secondary-900 border-b border-secondary-700 text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <Image
              src="/logo-nortex-crest.png"
              alt="NorTex Society"
              width={48}
              height={48}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-white tracking-wide">NORTEX SOCIETY</h1>
              <p className="text-xs text-primary-400">1st Annual Charity Golf Tournament</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
                  isActive(link.href)
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                    : 'text-secondary-300 hover:text-primary-400 hover:bg-secondary-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              className={`ml-3 px-5 py-2 font-bold rounded-lg transition-colors text-sm whitespace-nowrap ${
                isActive('/register')
                  ? 'bg-primary-400 text-secondary-900'
                  : 'bg-primary-500 hover:bg-primary-400 text-secondary-900'
              }`}
            >
              Register
            </Link>
          </nav>

          {/* Mobile: Register + Hamburger */}
          <div className="flex items-center space-x-3 lg:hidden">
            <Link
              href="/register"
              className="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold rounded-lg transition-colors text-sm"
            >
              Register
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg hover:bg-secondary-800 transition-colors text-secondary-300 hover:text-primary-400"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden bg-secondary-900 border-t border-secondary-700/50">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                    : 'text-secondary-300 hover:text-primary-400 hover:bg-secondary-800'
                }`}
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
