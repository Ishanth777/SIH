'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon, XIcon, ShieldCheckIcon } from '../icons';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { key: 'nav.home', label: t('nav.home'), href: '/' },
    { key: 'nav.services', label: t('nav.services'), href: '/services' },
    { key: 'nav.howItWorks', label: t('nav.howItWorks'), href: '/how-it-works' },
    { key: 'nav.forWorkers', label: t('nav.forWorkers'), href: '/for-workers' },
    { key: 'nav.forCooperatives', label: t('nav.forCooperatives'), href: '/for-cooperatives' },
    { key: 'nav.about', label: t('nav.about'), href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0E2150] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            BG
          </div>
          <div>
            <span className="font-heading font-black text-lg tracking-tight text-[#0E2150]">{t('brand.name')}</span>
            <span className="block text-[9px] font-bold text-[#059669] tracking-wider uppercase -mt-0.5">
              {t('brand.subtitle')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  isActive ? 'text-[#0E2150] font-bold' : 'text-slate-600 hover:text-[#0E2150]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector />
          <Link
            href="/login"
            className="text-xs font-bold text-[#0E2150] hover:text-[#1A3470] px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            {t('nav.signIn')}
          </Link>
          <Link
            href="/booking"
            className="text-xs font-bold text-white px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] shadow-sm transition"
          >
            {t('nav.bookService')}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSelector variant="compact" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-semibold ${
                  pathname === link.href ? 'bg-[#0E2150] text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs font-bold py-2.5 rounded-lg border border-slate-200 text-[#0E2150]"
            >
              {t('nav.signIn')} / {t('nav.roleSwitcher')}
            </Link>
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs font-bold py-2.5 rounded-lg bg-[#059669] text-white"
            >
              {t('nav.bookService')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
