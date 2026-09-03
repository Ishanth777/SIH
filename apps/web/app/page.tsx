import React from 'react';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BuildingIcon,
  UsersIcon,
  BriefcaseIcon,
  RupeeIcon,
  SparklesIcon,
  HeartPulseIcon,
  ActivityIcon,
} from '../components/icons';
import { SERVICE_CATEGORIES } from '../data/mock-data';

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#081435] via-[#0E2150] to-[#081435] text-white pt-20 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>Cooperative-Owned Digital Public Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-tight">
              Fair Wages for Artisans. <br />
              <span className="text-emerald-400">Trusted Services for Homes.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              BharatGig eliminates middleman commissions by connecting households directly with certified cooperative guild workers. Governed by registered cooperative societies and state federations.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/booking"
                className="px-6 py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-md transition flex items-center gap-2"
              >
                <span>Book a Verified Service</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>

              <Link
                href="/for-workers"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition"
              >
                Join as a Guild Worker
              </Link>
            </div>

            {/* Micro Trust Stats */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-700/60 max-w-xl">
              <div>
                <p className="text-2xl font-black font-heading text-white">100%</p>
                <p className="text-xs text-slate-400">Direct Worker Payout</p>
              </div>
              <div>
                <p className="text-2xl font-black font-heading text-emerald-400">3,400+</p>
                <p className="text-xs text-slate-400">Verified Artisans</p>
              </div>
              <div>
                <p className="text-2xl font-black font-heading text-white">18</p>
                <p className="text-xs text-slate-400">Audited Societies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Service Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">Essential Home Trades</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#0E2150] mt-1">
              Popular Service Guilds
            </h2>
          </div>
          <Link
            href="/services"
            className="text-xs font-bold text-[#0E2150] hover:text-[#059669] flex items-center gap-1.5 transition"
          >
            <span>View all 4 service bands</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#0E2150]">
                  <BriefcaseIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#0E2150]">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Fair Wage Band</span>
                  <p className="text-xs font-bold text-slate-900">
                    ₹{cat.baseRateMin} – ₹{cat.baseRateMax} <span className="text-[10px] text-slate-400 font-normal">/ {cat.unit}</span>
                  </p>
                </div>
                <Link
                  href={`/booking?category=${cat.code}`}
                  className="px-3 py-1.5 rounded-lg bg-[#0E2150] text-white text-xs font-semibold hover:bg-[#1A3470] transition"
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How BharatGig Works (3 Step Flow) */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">Transparent & Simple</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#0E2150]">
              How BharatGig Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              A community-driven lifecycle that protects both the household and the working artisan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm font-heading">
                1
              </div>
              <h3 className="font-heading font-bold text-base text-[#0E2150]">Choose Service & Location</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your required household service and schedule. Our PostGIS engine matches you with verified guild artisans nearest to your GPS coordinates.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <div className="w-9 h-9 rounded-full bg-navy-100 text-[#0E2150] font-bold flex items-center justify-center text-sm font-heading">
                2
              </div>
              <h3 className="font-heading font-bold text-base text-[#0E2150]">Direct Dispatch & Work Completion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The artisan arrives on site, performs the diagnosis, and completes the work under standard cooperative quality and transparent pricing guidelines.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm font-heading">
                3
              </div>
              <h3 className="font-heading font-bold text-base text-[#0E2150]">100% Direct Payout & Welfare</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pay digitally via UPI. The artisan receives 100% of their standard labour wage with automatic contribution to accident and health welfare funds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose BharatGig (4 Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">Cooperative Advantage</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#0E2150]">
            Why Choose BharatGig?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-2.5">
            <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
            <h3 className="font-heading font-bold text-sm text-[#0E2150]">Aadhaar Verified KYC</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every artisan is verified by their local registered cooperative society before dispatch.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-2.5">
            <RupeeIcon className="w-6 h-6 text-[#0E2150]" />
            <h3 className="font-heading font-bold text-sm text-[#0E2150]">Fixed Fair Wage Bands</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No hidden surge pricing or platform gouging. Standardized rates decided by guild bylaws.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-2.5">
            <BuildingIcon className="w-6 h-6 text-navy-600" />
            <h3 className="font-heading font-bold text-sm text-[#0E2150]">Democratic Governance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Workers co-own the cooperative society and elect their leadership. Zero venture extraction.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-2.5">
            <HeartPulseIcon className="w-6 h-6 text-rose-600" />
            <h3 className="font-heading font-bold text-sm text-[#0E2150]">Worker Welfare Built-in</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every job funds PMSBY accident insurance, family medical cover, and NSDC skill upgrades.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Role Portals Quick Access */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Access Dedicated Portals</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              Platform Hierarchy & Role Desks
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/customer"
              className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500/50 transition space-y-3 group"
            >
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Household Portal</div>
              <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition">
                Customer Hub
              </h3>
              <p className="text-xs text-slate-300">
                Book household services, track live artisan GPS arrivals, and view transparent invoices.
              </p>
              <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span>Enter Portal</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/worker"
              className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500/50 transition space-y-3 group"
            >
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Artisan Portal</div>
              <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition">
                Worker Desk
              </h3>
              <p className="text-xs text-slate-300">
                Toggle availability, receive nearby dispatch alerts, manage on-site jobs, and track welfare.
              </p>
              <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span>Enter Portal</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/society/dashboard"
              className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500/50 transition space-y-3 group"
            >
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Cooperative Branch</div>
              <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition">
                Society Operations
              </h3>
              <p className="text-xs text-slate-300">
                Manage branch artisan roster, AI demand forecasting, disputes mediation, and funds.
              </p>
              <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span>Enter Portal</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/federation"
              className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500/50 transition space-y-3 group"
            >
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">State Apex</div>
              <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition">
                Federation Apex
              </h3>
              <p className="text-xs text-slate-300">
                Statewide multi-tenant governance, KYC verification queue, compliance audits, and analytics.
              </p>
              <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span>Enter Portal</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0E2150] rounded-2xl p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight">
              Ready to experience cooperative-first home services?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Book a verified electrician, plumber, cleaner, or caregiver today and support local cooperative livelihoods.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/booking"
                className="px-6 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-md transition"
              >
                Book a Service Now
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition"
              >
                Sign In / Role Switcher
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
