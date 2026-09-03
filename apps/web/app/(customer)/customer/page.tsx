'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { StatCard } from '../../../components/common/StatCard';
import { DataTable, Column } from '../../../components/common/DataTable';
import {
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  RupeeIcon,
  PlusIcon,
} from '../../../components/icons';
import { BOOKINGS_DATA, SERVICE_CATEGORIES, Booking } from '../../../data/mock-data';

export default function CustomerDashboardPage() {
  const activeBooking = BOOKINGS_DATA.find((b) => b.status === 'IN_PROGRESS' || b.status === 'MATCHED');
  const pastBookings = BOOKINGS_DATA.filter((b) => b.status === 'COMPLETED');

  const bookingColumns: Column<Booking>[] = [
    {
      header: 'Booking ID',
      accessor: (row) => (
        <span className="font-mono font-bold text-xs text-[#0E2150]">{row.id}</span>
      ),
    },
    {
      header: 'Service & Category',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.serviceName}</p>
          <p className="text-[11px] text-slate-500">{row.category} • {row.cooperativeName}</p>
        </div>
      ),
    },
    {
      header: 'Artisan',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
            {row.workerName?.substring(0, 2) || 'NA'}
          </div>
          <span className="font-medium text-slate-800">{row.workerName || 'Awaiting Match'}</span>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      accessor: (row) => (
        <span className="text-slate-600">{row.scheduledDate}, {row.scheduledTime}</span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row) => (
        <span className="font-bold text-slate-900">₹{row.amount}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/payment/${row.id}`}
            className="text-[11px] font-semibold text-[#0E2150] hover:underline"
          >
            Invoice
          </Link>
          {row.status === 'COMPLETED' && (
            <Link
              href={`/feedback/${row.id}`}
              className="text-[11px] font-semibold text-[#059669] hover:underline"
            >
              Rate
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      role="CUSTOMER"
      userName="Anup Sharma"
      userSubtitle="Bellandur, Bangalore"
      title="Household Service Hub"
      subtitle="Manage your home service requests, live artisan tracking, and cooperative receipts."
      actions={
        <Link
          href="/booking"
          className="px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Book New Service</span>
        </Link>
      }
    >
      {/* 1. Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Active Dispatches"
          value={activeBooking ? '1 In Progress' : '0 Active'}
          subtext="PostGIS real-time tracking"
          icon={<ClockIcon className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          label="Completed Services"
          value={pastBookings.length}
          subtext="100% verified guild completions"
          icon={<CheckCircleIcon className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="Direct Artisan Payouts"
          value={`₹${pastBookings.reduce((acc, b) => acc + b.amount, 0)}`}
          subtext="0% middleman platform fee"
          icon={<RupeeIcon className="w-5 h-5 text-[#0E2150]" />}
        />
      </div>

      {/* 2. Active Ongoing Service Card */}
      {activeBooking && (
        <div className="bg-gradient-to-r from-emerald-950 via-[#0E2150] to-[#081435] rounded-xl p-6 text-white shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Active Dispatch • {activeBooking.id}
                </span>
                <h3 className="font-heading font-bold text-lg text-white mt-0.5">
                  {activeBooking.serviceName}
                </h3>
              </div>
            </div>
            <StatusBadge status={activeBooking.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Assigned Artisan: <strong className="text-white">{activeBooking.workerName}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{activeBooking.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <RupeeIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Standard Cost: <strong className="text-white">₹{activeBooking.amount}</strong></span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-emerald-300">
              Cooperative Society: {activeBooking.cooperativeName}
            </span>
            <div className="flex items-center gap-3">
              <Link
                href={`/job-tracking/${activeBooking.id}`}
                className="px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <span>Live GPS Tracking</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Quick Re-Book Trade Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-[#0E2150]">Quick Trade Dispatch</h3>
          <Link href="/services" className="text-xs font-semibold text-[#059669] hover:underline">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/booking?category=${cat.code}`}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0E2150] transition group space-y-2 shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0E2150] group-hover:text-white flex items-center justify-center text-[#0E2150] transition">
                <BriefcaseIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-heading font-bold text-xs text-slate-900 group-hover:text-[#0E2150]">
                  {cat.name}
                </p>
                <p className="text-[10px] text-slate-500">₹{cat.baseRateMin} - ₹{cat.baseRateMax}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Booking History DataTable */}
      <DataTable
        title="Service Booking History"
        subtitle="Transparent ledger of all past cooperative services."
        columns={bookingColumns}
        data={BOOKINGS_DATA}
        searchPlaceholder="Search by booking ID, trade, or artisan..."
      />
    </DashboardLayout>
  );
}
