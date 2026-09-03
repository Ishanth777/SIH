import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, BuildingIcon, UsersIcon, ArrowRightIcon, RupeeIcon, CheckCircleIcon } from '../../components/icons';

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">Ecosystem Blueprint</span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-[#0E2150] tracking-tight">
          How the BharatGig Cooperative Marketplace Works
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          BharatGig unites state federations, cooperative societies, skilled artisans, and households under a transparent digital governance framework.
        </p>
      </div>

      {/* 4-Tier Hierarchy Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 relative">
          <div className="w-8 h-8 rounded-lg bg-[#0E2150] text-white flex items-center justify-center font-bold text-xs">
            1
          </div>
          <span className="text-[10px] uppercase font-bold text-[#059669]">Apex Governance</span>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">State Federation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Maintains multi-tenant compliance, audits cooperative societies, oversees statewide welfare funds, and sets minimum wage policies.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 relative">
          <div className="w-8 h-8 rounded-lg bg-[#0E2150] text-white flex items-center justify-center font-bold text-xs">
            2
          </div>
          <span className="text-[10px] uppercase font-bold text-[#059669]">Local Branch</span>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Cooperative Society</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Verifies artisan KYC, arbitrates local disputes, monitors dispatch utilization, and manages branch welfare reserve funds.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 relative">
          <div className="w-8 h-8 rounded-lg bg-[#0E2150] text-white flex items-center justify-center font-bold text-xs">
            3
          </div>
          <span className="text-[10px] uppercase font-bold text-[#059669]">Guild Members</span>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Skilled Artisans</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aadhaar-verified electricians, plumbers, cleaners, and caregivers who receive 100% fair wages and co-own their cooperative.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 relative">
          <div className="w-8 h-8 rounded-lg bg-[#0E2150] text-white flex items-center justify-center font-bold text-xs">
            4
          </div>
          <span className="text-[10px] uppercase font-bold text-[#059669]">Service Consumers</span>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Households</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Book verified artisans at regulated fair rates, track real-time arrivals, and pay securely with zero middleman surcharge.
          </p>
        </div>
      </div>

      {/* Customer Step-by-Step */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">Household Journey</span>
          <h2 className="text-2xl font-bold font-heading text-[#0E2150] mt-1">
            Booking & Service Completion Flow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-heading font-bold text-sm text-[#0E2150]">1. Select Trade & Location</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose your service category and address. PostGIS queries match nearest available artisans using ST_DWithin geospatial analysis.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-heading font-bold text-sm text-[#0E2150]">2. Track Live Arrival</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The assigned artisan confirms the dispatch and travels to your location. Receive status updates (Arrived, In Progress, Completed).
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-heading font-bold text-sm text-[#0E2150]">3. Settle Transparent Invoice</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review the transparent itemized ledger and settle via UPI or card. Leave verified feedback to uphold guild quality standards.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <Link
            href="/booking"
            className="px-6 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
          >
            <span>Start a Booking</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
