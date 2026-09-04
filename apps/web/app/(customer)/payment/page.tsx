'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCardIcon,
  ShieldCheckIcon,
  RupeeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@/components/icons';
import { BOOKINGS_DATA } from '@/data/mock-data';

export default function GeneralPaymentPortalPage() {
  const router = useRouter();
  const [customJobId, setCustomJobId] = useState('demo-job-1234');

  const pendingJobs = BOOKINGS_DATA.filter((b) => !b.isPaid);
  const settledJobs = BOOKINGS_DATA.filter((b) => b.isPaid);

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono mb-2">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>UPI-First Razorpay Payment Gateway (Squad 4)</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#0E2150] tracking-tight">
              Cooperative Payment & Settlement Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Zero aggregator fee. 100% of the customer's trade payment is disbursed directly to the guild artisan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/customer/payments"
              className="text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
            >
              Invoices & History →
            </Link>
          </div>
        </div>

        {/* Quick Checkout by Job ID Box */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#0E2150] flex items-center gap-2">
              <CreditCardIcon className="w-4 h-4 text-[#059669]" />
              <span>Direct Job Checkout / Invoice Settlement</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Rule A5 Idempotent</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customJobId.trim()) {
                router.push(`/payment/${customJobId.trim()}`);
              }
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={customJobId}
              onChange={(e) => setCustomJobId(e.target.value)}
              placeholder="Enter Job ID (e.g. demo-job-1234)"
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E2150] font-mono font-bold text-slate-900"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0E2150] hover:bg-[#1A3470] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Razorpay Checkout</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Pending Invoices Awaiting Settlement */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm text-[#0E2150] flex items-center justify-between">
            <span>Pending Services Awaiting Settlement</span>
            <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-bold">
              {pendingJobs.length} Pending
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Job #{job.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      PAYMENT DUE
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    {job.serviceName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Artisan: <strong className="text-slate-800">{job.workerName}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {job.cooperativeName}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Total Due
                    </span>
                    <span className="font-heading font-black text-base text-slate-900">
                      ₹{job.amount}
                    </span>
                  </div>

                  <Link
                    href={`/payment/${job.id}`}
                    className="px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                  >
                    <span>Pay via UPI / Card</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Settled Payments */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm text-[#0E2150] flex items-center justify-between">
            <span>Recently Settled Cooperative Receipts</span>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              {settledJobs.length} Settled
            </span>
          </h3>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs divide-y divide-slate-100">
            {settledJobs.map((job) => (
              <div key={job.id} className="py-3 flex items-center justify-between gap-4 text-xs first:pt-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0E2150]">INV-{job.id}</span>
                    <span className="text-slate-700 font-semibold">{job.serviceName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Artisan: {job.workerName}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-heading font-bold text-slate-900">₹{job.amount}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    SETTLED
                  </span>
                  <Link
                    href={`/payment/${job.id}`}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Receipt →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
