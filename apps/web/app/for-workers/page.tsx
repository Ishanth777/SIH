import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, RupeeIcon, HeartPulseIcon, UserCheckIcon, ArrowRightIcon, CheckCircleIcon } from '../../components/icons';
import { WELFARE_SCHEMES } from '../../data/mock-data';

export default function ForWorkersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">For Skilled Artisans & Workers</span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#0E2150] tracking-tight">
          Keep 100% of Your Hard-Earned Wages.
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Commercial gig platforms deduct 20% to 35% of every job you complete. BharatGig is owned by your local cooperative society—meaning zero middleman cuts, guaranteed social security, and democratic governance.
        </p>
      </div>

      {/* 3 Core Worker Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <RupeeIcon className="w-8 h-8 text-[#059669]" />
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Zero Commission Cut</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            100% of the customer's labour payment is disbursed directly to your bank account via UPI. No algorithmic pay deductions or arbitrary penalties.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <HeartPulseIcon className="w-8 h-8 text-rose-600" />
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Cooperative Social Security</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automatic enrollment into Pradhan Mantri Suraksha Bima Yojana (PMSBY), family medical emergency aid, and state labour welfare funds.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <UserCheckIcon className="w-8 h-8 text-[#0E2150]" />
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Cooperative Guild Membership</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            You are a voting shareholder in your Cooperative Society. Decisions regarding minimum fair wage bands and welfare allocations are made democratically.
          </p>
        </div>
      </div>

      {/* Welfare Schemes Showcase */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">Government & Guild Backed</span>
          <h2 className="text-2xl font-bold font-heading text-[#0E2150] mt-1">
            Active Worker Welfare Schemes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WELFARE_SCHEMES.map((scheme) => (
            <div key={scheme.id} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 uppercase tracking-wider">
                {scheme.category}
              </span>
              <h4 className="font-heading font-bold text-sm text-[#0E2150]">{scheme.name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{scheme.coverage}</p>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p><span className="font-semibold text-slate-700">Cost:</span> {scheme.premium}</p>
                <p><span className="font-semibold text-slate-700">Enrolled:</span> {scheme.enrolledWorkers} Artisans</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0E2150] rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-xl text-white">Join your local Cooperative Society</h3>
          <p className="text-xs text-slate-300">
            Submit your Aadhaar KYC and trade skills to get verified and start receiving service dispatches.
          </p>
        </div>
        <Link
          href="/worker"
          className="px-6 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold whitespace-nowrap shadow-sm transition"
        >
          Open Worker Portal
        </Link>
      </div>
    </div>
  );
}
