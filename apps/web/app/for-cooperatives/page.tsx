import React from 'react';
import Link from 'next/link';
import { BuildingIcon, ShieldCheckIcon, ActivityIcon, SparklesIcon, ArrowRightIcon } from '../../components/icons';

export default function ForCooperativesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">For Registered Cooperative Societies</span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#0E2150] tracking-tight">
          Digital Public Infrastructure for Cooperative Societies
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Transform your local labour or artisan cooperative into a high-technology digital enterprise. BharatGig gives societies complete administrative autonomy with PostGIS geospatial dispatch, automated AI demand forecasting, and real-time ledger auditing.
        </p>
      </div>

      {/* Society Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <BuildingIcon className="w-8 h-8 text-[#0E2150]" />
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Multi-Tenant RLS Autonomy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Database-level Row-Level Security (RLS) ensures that your cooperative society's data, member records, and financial ledgers remain completely isolated and strictly confidential.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <SparklesIcon className="w-8 h-8 text-[#059669]" />
          <h3 className="font-heading font-bold text-base text-[#0E2150]">AI Demand Forecasting</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Anticipate household service surges up to 5 days in advance across your district. Staff shifts optimally to maximize worker earnings and meet community demand.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <ShieldCheckIcon className="w-8 h-8 text-[#0E2150]" />
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Digital Ombudsman Desk</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Resolve billing or service disputes transparently with immutable dispatch GPS logs, customer feedback history, and cooperative arbitration tools.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-xl text-white">Access Cooperative Administration</h3>
          <p className="text-xs text-slate-300">
            Log in to your society operations dashboard or request federation onboarding.
          </p>
        </div>
        <Link
          href="/society/dashboard"
          className="px-6 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold whitespace-nowrap shadow-sm transition"
        >
          Open Society Operations
        </Link>
      </div>
    </div>
  );
}
