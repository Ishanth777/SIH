'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { StatCard } from '../../../../components/common/StatCard';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { DataTable, Column } from '../../../../components/common/DataTable';
import {
  UsersIcon,
  BriefcaseIcon,
  RupeeIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ShieldAlertIcon,
} from '../../../../components/icons';
import { SOCIETIES_DATA, BOOKINGS_DATA, Booking } from '../../../../data/mock-data';

export default function SocietyDashboardPage() {
  const society = SOCIETIES_DATA[0]; // Bangalore South Labour Cooperative Society

  const columns: Column<Booking>[] = [
    {
      header: 'Booking Ref',
      accessor: (row) => <span className="font-mono font-bold text-xs text-[#0E2150]">{row.id}</span>,
    },
    {
      header: 'Service Item',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.serviceName}</p>
          <p className="text-[11px] text-slate-500">{row.category} • {row.urgency}</p>
        </div>
      ),
    },
    {
      header: 'Artisan',
      accessor: (row) => <span className="font-medium text-slate-800">{row.workerName || 'Awaiting Match'}</span>,
    },
    {
      header: 'Customer',
      accessor: (row) => <span className="text-slate-700">{row.customerName}</span>,
    },
    {
      header: 'Amount',
      accessor: (row) => <span className="font-bold text-slate-900">₹{row.amount}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout
      role="SOCIETY_ADMIN"
      userName="Bangalore South Operations"
      userSubtitle={society.name}
      title="Branch Operations Desk"
      subtitle={`Administering ${society.totalWorkers} registered guild artisans in ${society.district}.`}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/society/disputes"
            className="px-3 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition flex items-center gap-1.5"
          >
            <ShieldAlertIcon className="w-4 h-4" />
            <span>1 Open Dispute</span>
          </Link>
          <Link
            href="/society/forecasting"
            className="px-3 py-2 rounded-lg bg-[#0E2150] text-white text-xs font-bold hover:bg-[#1A3470] transition flex items-center gap-1.5"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>AI Demand Forecast</span>
          </Link>
        </div>
      }
    >
      {/* 1. Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <StatCard
          label="Total Registered Artisans"
          value={society.totalWorkers}
          subtext={`${society.activeWorkers} currently available on duty`}
          icon={<UsersIcon className="w-5 h-5 text-[#0E2150]" />}
        />
        <StatCard
          label="Active Dispatches"
          value={society.activeBookings}
          subtext="PostGIS real-time routing"
          icon={<BriefcaseIcon className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          label="Monthly Branch Volume"
          value={`₹${(society.monthlyRevenue / 100000).toFixed(2)}L`}
          subtext="100% disbursed to workers"
          icon={<RupeeIcon className="w-5 h-5 text-[#059669]" />}
        />
        <StatCard
          label="Aadhaar KYC Verified"
          value={`${society.verifiedRate}%`}
          subtext="Compliant with federation bylaws"
          icon={<ShieldCheckIcon className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* 2. AI Demand Forecasting Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-[#059669]" />
            <h3 className="font-heading font-bold text-base text-[#0E2150]">
              5-Day AI Demand & Staffing Forecast (Bellandur / Koramangala)
            </h3>
          </div>
          <Link href="/society/forecasting" className="text-xs font-bold text-[#059669] hover:underline">
            View District Heatmap →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { day: 'Thursday (Today)', pred: '48 jobs', surge: '+12%', rec: 'Electricians on standby' },
            { day: 'Friday', pred: '56 jobs', surge: '+24%', rec: 'Plumbers + Cleaners' },
            { day: 'Saturday (Peak)', pred: '82 jobs', surge: '+65%', rec: 'Full guild on duty' },
            { day: 'Sunday (Peak)', pred: '79 jobs', surge: '+60%', rec: 'Deep cleaners priority' },
            { day: 'Monday', pred: '38 jobs', surge: '-8%', rec: 'Routine maintenance' },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">{item.day}</span>
              <p className="text-sm font-bold text-slate-900">{item.pred}</p>
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                {item.surge}
              </span>
              <p className="text-[10px] text-slate-500 pt-1">{item.rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Bookings DataTable */}
      <DataTable
        title="Live Service Requests & Dispatches"
        columns={columns}
        data={BOOKINGS_DATA}
        searchPlaceholder="Search by booking ref, trade, artisan..."
      />
    </DashboardLayout>
  );
}
