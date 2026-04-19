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
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity min-h-[44px]">
            <Image
              src="/logo-nortex-crest.png"
              alt="NorTex Society"
              width={40}
              height={40}
              className="object-contain w-9 h-9 sm:w-12 sm:h-12"
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

          {/* Mobile: Register + Hamburger — lift above z-40 overlay so taps land on the button */}
          <div className="flex items-center space-x-2 lg:hidden relative z-50">
            <Link
              href="/register"
              className="px-4 py-2.5 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold rounded-lg transition-colors text-sm min-h-[44px] flex items-center"
            >
              Register
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="p-3 rounded-lg hover:bg-secondary-800 transition-colors text-secondary-300 hover:text-primary-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div id="mobile-nav" className="lg:hidden bg-secondary-900 border-t border-secondary-700/50 relative z-50">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3.5 rounded-lg font-medium transition-colors min-h-[44px] flex items-center ${
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
        </>
      )}
    </header>
  );
}
