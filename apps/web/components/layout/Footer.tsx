import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, BuildingIcon, HeartPulseIcon } from '../icons';

export function Footer() {
  return (
    <footer className="bg-[#081435] text-white pt-14 pb-8 border-t border-[#1A3470]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-700/60">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                BG
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-white">BharatGig</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              BharatGig is a cooperative-owned digital marketplace for household and community services. Governed by registered cooperative societies and state federations, guaranteeing transparent wages to skilled artisans and verified services to households.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>Multi-Tenant Cooperative Federation Architecture</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/services" className="hover:text-emerald-400 transition">Electrician Services</Link></li>
              <li><Link href="/services" className="hover:text-emerald-400 transition">Plumbing & Sanitary</Link></li>
              <li><Link href="/services" className="hover:text-emerald-400 transition">Deep Cleaning</Link></li>
              <li><Link href="/services" className="hover:text-emerald-400 transition">Elder & Patient Care</Link></li>
              <li><Link href="/booking" className="hover:text-emerald-400 transition">Emergency Dispatch</Link></li>
            </ul>
          </div>

          {/* Col 3: Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/for-workers" className="hover:text-emerald-400 transition">For Skilled Workers</Link></li>
              <li><Link href="/for-cooperatives" className="hover:text-emerald-400 transition">For Cooperative Societies</Link></li>
              <li><Link href="/how-it-works" className="hover:text-emerald-400 transition">How It Works</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition">Cooperative Bylaws</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition">Role Switcher / Sign In</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
              Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/customer" className="hover:text-emerald-400 transition">Customer Hub</Link></li>
              <li><Link href="/worker" className="hover:text-emerald-400 transition">Artisan Desk</Link></li>
              <li><Link href="/society/dashboard" className="hover:text-emerald-400 transition">Society Operations</Link></li>
              <li><Link href="/federation" className="hover:text-emerald-400 transition">Apex Federation</Link></li>
              <li><Link href="/admin" className="hover:text-emerald-400 transition">Super Admin</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Compliance */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BharatGig. Cooperative-owned public digital infrastructure.</p>
          <div className="flex items-center gap-6">
            <span>DPDPA 2023 Compliant</span>
            <span>PostGIS Dispatch</span>
            <span>0% Middleman Cut</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
