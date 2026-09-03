import React from 'react';
import Link from 'next/link';
import { BriefcaseIcon, RupeeIcon, ClockIcon, UsersIcon, ArrowRightIcon, ShieldCheckIcon } from '../../components/icons';
import { SERVICE_CATEGORIES } from '../../data/mock-data';

export default function ServicesDirectoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">Cooperative Trade Catalog</span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#0E2150] tracking-tight">
          Explore Certified Guild Services
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Standardized service categories decided by registered cooperative societies. All services adhere to transparent wage bands, eliminating middleman gouging and surge pricing.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SERVICE_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 hover:shadow-md transition space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#0E2150]">
                  <BriefcaseIcon className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{cat.activeWorkers} Active Artisans</span>
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-xl text-[#0E2150]">{cat.name}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{cat.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Fair Wage Band</span>
                  <p className="text-sm font-bold text-[#0E2150] mt-0.5">
                    ₹{cat.baseRateMin} – ₹{cat.baseRateMax}
                  </p>
                  <span className="text-[10px] text-slate-500">per {cat.unit}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Typical Duration</span>
                  <p className="text-sm font-bold text-[#0E2150] mt-0.5">{cat.typicalDuration}</p>
                  <span className="text-[10px] text-slate-500">certified completion</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span>0% Commission • 100% Direct Payout</span>
              </div>
              <Link
                href={`/booking?category=${cat.code}`}
                className="px-5 py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <span>Book This Trade</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Callout */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-xl text-white">Need emergency electrical or plumbing repair?</h3>
          <p className="text-xs text-slate-300">
            Our PostGIS dispatch engine routes urgent service requests to the closest available on-duty artisan.
          </p>
        </div>
        <Link
          href="/booking?urgency=EMERGENCY"
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold whitespace-nowrap shadow-sm transition"
        >
          Request Emergency Dispatch
        </Link>
      </div>
    </div>
  );
}
