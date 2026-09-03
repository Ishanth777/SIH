import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mt-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Cooperative Gig Services Marketplace
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Worker-first digital marketplace with guaranteed fair wage floors, transparent cooperative settlement, and automated tax invoices.
        </p>
      </div>

      {/* Customer Service Experience Card */}
      <div className="my-10 bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 block">
              Customer Service Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Service Checkout &amp; Tax Invoice
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Experience the complete customer flow: Select payment rail (UPI, Card, NetBanking), execute instant Razorpay checkout, and automatically receive an official cooperative invoice.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/payment/demo-job-101"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 text-sm transition-all hover:scale-[1.02]"
            >
              <span>Proceed to Checkout</span>
              <span className="text-lg">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* 3 Split Breakdown Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <div className="bg-[#090f1f]/80 border border-slate-800/90 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors">
            <span className="text-slate-400 text-xs font-semibold block mb-1">
              Worker Direct Share
            </span>
            <span className="text-emerald-400 font-extrabold text-lg sm:text-xl block">
              85% Net Take-Home
            </span>
            <span className="text-slate-500 text-xs mt-1 block">
              Credited to registered UPI/Bank
            </span>
          </div>

          <div className="bg-[#090f1f]/80 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition-colors">
            <span className="text-slate-400 text-xs font-semibold block mb-1">
              Society Operational Fee
            </span>
            <span className="text-white font-extrabold text-lg sm:text-xl block">
              10% Admin Charge
            </span>
            <span className="text-slate-500 text-xs mt-1 block">
              Local society verification &amp; tools
            </span>
          </div>

          <div className="bg-[#090f1f]/80 border border-slate-800/90 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors">
            <span className="text-slate-400 text-xs font-semibold block mb-1">
              Worker Welfare Fund
            </span>
            <span className="text-emerald-400 font-extrabold text-lg sm:text-xl block">
              5% Insurance Reserve
            </span>
            <span className="text-slate-500 text-xs mt-1 block">
              Health, accident &amp; pension cover
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-slate-500 text-xs py-4 border-t border-slate-800/50">
        Cooperative-Owned Digital Services Marketplace &bull; Smart India Hackathon 2026
      </footer>
    </div>
  );
}
