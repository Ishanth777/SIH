import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, BuildingIcon, UsersIcon, RupeeIcon, HeartPulseIcon } from '../../components/icons';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">About BharatGig</span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#0E2150] tracking-tight">
          Cooperative Public Digital Infrastructure for Livelihoods
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          BharatGig was established to solve the systemic vulnerabilities in commercial gig work: excessive commission deductions, lack of social security, unfair algorithmic deactivation, and opaque pricing.
        </p>
      </div>

      {/* Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheckIcon className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Cooperative Ownership</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike corporate gig platforms, BharatGig is non-extractive. Surplus margins are not siphoned as investor dividends; they are reinvested into worker healthcare, retirement funds, and apprenticeship training programs.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-navy-50 text-[#0E2150] flex items-center justify-center font-bold">
            <RupeeIcon className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Standardized Fair Wage Bands</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rates are established through collective bargaining and guild consensus, protecting workers from hyper-deflation while assuring consumers of reasonable, predictable rates.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <BuildingIcon className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Multi-Tier Governance</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The platform reflects the federal cooperative structure: State Apex Federations oversee policy and audit compliance, while registered Cooperative Societies administer local district operations.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <HeartPulseIcon className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Institutional Social Security</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every transaction automatically routes statutory welfare contributions into registered government schemes, including PMSBY, PMJJBY, and the State Unorganized Workers Welfare Board.
          </p>
        </div>
      </div>
    </div>
  );
}
