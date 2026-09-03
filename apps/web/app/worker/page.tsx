'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  BriefcaseIcon,
  RupeeIcon,
  StarIcon,
  ShieldCheckIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PhoneIcon,
  ClockIcon,
} from '../../components/icons';
import { BOOKINGS_DATA, WORKERS_DATA } from '../../data/mock-data';

export default function WorkerDashboardPage() {
  const worker = WORKERS_DATA[0]; // Karthik Raghavan
  const [isOnline, setIsOnline] = useState(true);
  const [jobStage, setJobStage] = useState<'DISPATCHED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED'>('IN_PROGRESS');

  const activeJob = BOOKINGS_DATA[0]; // JOB-9841

  return (
    <DashboardLayout
      role="WORKER"
      userName={worker.fullName}
      userSubtitle={`${worker.category} • ${worker.cooperativeName}`}
      title="Guild Artisan Desk"
      subtitle="Manage your daily availability, active on-site service dispatches, and cooperative welfare."
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
            <span>{isOnline ? 'On Duty (Available for Dispatch)' : 'Offline (Not Receiving Jobs)'}</span>
          </button>
        </div>
      }
    >
      {/* 1. Worker Key KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <StatCard
          label="This Month Earnings"
          value={`₹${worker.monthlyEarnings}`}
          subtext="100% direct labour payout"
          icon={<RupeeIcon className="w-5 h-5 text-[#059669]" />}
        />
        <StatCard
          label="Completed Jobs"
          value={worker.completedJobs}
          subtext="Certified guild standard"
          icon={<CheckCircleIcon className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="Customer Rating"
          value={`${worker.rating} / 5.0`}
          subtext={`Based on ${worker.reviewCount} reviews`}
          icon={<StarIcon className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          label="Welfare Status"
          value="PMSBY Enrolled"
          subtext="₹2,00,000 active cover"
          icon={<ShieldCheckIcon className="w-5 h-5 text-navy-600" />}
        />
      </div>

      {/* 2. Active Assigned Job Workflow Card */}
      {activeJob && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#0E2150]">{activeJob.id}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 uppercase">
                  {activeJob.urgency}
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#0E2150] mt-1">
                {activeJob.serviceName}
              </h3>
            </div>
            <StatusBadge status={jobStage === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Customer Details</span>
              <p className="font-bold text-slate-900 text-sm">{activeJob.customerName}</p>
              <p className="text-slate-600">{activeJob.customerPhone}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Service Location</span>
              <p className="text-slate-800 leading-relaxed font-medium">{activeJob.address}</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-block text-[11px] font-semibold text-[#059669] hover:underline"
              >
                Open in Google Maps GPS →
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Fair Wage Settlement</span>
              <p className="font-bold text-slate-900 text-base">₹{activeJob.amount}</p>
              <p className="text-[11px] text-emerald-700 font-semibold">100% direct UPI disbursement</p>
            </div>
          </div>

          {/* On-Site Progression Controls */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Workflow Stage:</span>
              <span className="text-xs font-bold text-[#0E2150] uppercase">{jobStage}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {jobStage === 'DISPATCHED' && (
                <button
                  onClick={() => setJobStage('ARRIVED')}
                  className="px-4 py-2 rounded-lg bg-[#0E2150] text-white text-xs font-bold hover:bg-[#1A3470]"
                >
                  Mark Arrived on Site
                </button>
              )}
              {jobStage === 'ARRIVED' && (
                <button
                  onClick={() => setJobStage('IN_PROGRESS')}
                  className="px-4 py-2 rounded-lg bg-[#059669] text-white text-xs font-bold hover:bg-[#047857]"
                >
                  Start Service Diagnostics
                </button>
              )}
              {jobStage === 'IN_PROGRESS' && (
                <button
                  onClick={() => setJobStage('COMPLETED')}
                  className="px-4 py-2 rounded-lg bg-[#059669] text-white text-xs font-bold hover:bg-[#047857]"
                >
                  Sign Off & Complete Service
                </button>
              )}
              {jobStage === 'COMPLETED' && (
                <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Service Completed & Payment Disbursed</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/worker/jobs"
          className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#0E2150] transition space-y-2 group shadow-xs"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0E2150] group-hover:text-white flex items-center justify-center text-[#0E2150] transition">
            <BriefcaseIcon className="w-4 h-4" />
          </div>
          <h4 className="font-heading font-bold text-sm text-[#0E2150]">Available Jobs Radar</h4>
          <p className="text-xs text-slate-500">
            View nearby dispatch requests in Bellandur & Whitefield radius.
          </p>
        </Link>

        <Link
          href="/worker/earnings"
          className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#0E2150] transition space-y-2 group shadow-xs"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0E2150] group-hover:text-white flex items-center justify-center text-[#0E2150] transition">
            <RupeeIcon className="w-4 h-4" />
          </div>
          <h4 className="font-heading font-bold text-sm text-[#0E2150]">Earnings & Bank Payouts</h4>
          <p className="text-xs text-slate-500">
            Weekly settlements, zero deductions, and bank transaction statements.
          </p>
        </Link>

        <Link
          href="/worker/welfare"
          className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#0E2150] transition space-y-2 group shadow-xs"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0E2150] group-hover:text-white flex items-center justify-center text-[#0E2150] transition">
            <ShieldCheckIcon className="w-4 h-4" />
          </div>
          <h4 className="font-heading font-bold text-sm text-[#0E2150]">Cooperative Welfare Programs</h4>
          <p className="text-xs text-slate-500">
            PMSBY insurance coverage, emergency family health fund, and training grants.
          </p>
        </Link>
      </div>
    </DashboardLayout>
  );
}
