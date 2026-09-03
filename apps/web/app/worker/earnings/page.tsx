'use client';

import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { StatCard } from '../../../components/common/StatCard';
import { DataTable, Column } from '../../../components/common/DataTable';
import { RupeeIcon, CheckCircleIcon, ShieldCheckIcon } from '../../../components/icons';
import { BOOKINGS_DATA, Booking } from '../../../data/mock-data';

export default function WorkerEarningsPage() {
  const workerBookings = BOOKINGS_DATA.filter((b) => b.workerName === 'Karthik Raghavan');

  const columns: Column<Booking>[] = [
    {
      header: 'Disbursement Ref',
      accessor: (row) => <span className="font-mono font-bold text-xs text-[#0E2150]">TXN-PAY-{row.id}</span>,
    },
    {
      header: 'Service Rendered',
      accessor: (row) => <span className="font-bold text-slate-900">{row.serviceName}</span>,
    },
    {
      header: 'Gross Wage',
      accessor: (row) => <span className="font-semibold text-slate-800">₹{row.amount}</span>,
    },
    {
      header: 'Platform Fee (0%)',
      accessor: () => <span className="text-emerald-700 font-bold">₹0.00</span>,
    },
    {
      header: 'Net Payout (100%)',
      accessor: (row) => <span className="font-bold text-[#059669]">₹{row.amount}</span>,
    },
    {
      header: 'Payout Status',
      accessor: (row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
            row.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {row.isPaid ? 'DISBURSED VIA UPI' : 'PENDING SIGN-OFF'}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout
      role="WORKER"
      userName="Karthik Raghavan"
      userSubtitle="Electrician • Bangalore South Labour Cooperative"
      title="Earnings & Bank Dispatches"
      subtitle="Direct bank settlements with zero platform commission deductions."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Total Monthly Labour Wage"
          value="₹38,400"
          subtext="100% credited to your bank account"
          icon={<RupeeIcon className="w-5 h-5 text-[#059669]" />}
        />
        <StatCard
          label="Platform Commissions Deducted"
          value="₹0.00"
          subtext="Cooperative 0% commission guarantee"
          icon={<ShieldCheckIcon className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="Society Welfare Fund Allocated"
          value="₹768"
          subtext="2% society reserve contribution"
          icon={<CheckCircleIcon className="w-5 h-5 text-[#0E2150]" />}
        />
      </div>

      <DataTable
        title="Direct Payout Transaction Statements"
        columns={columns}
        data={workerBookings}
        searchPlaceholder="Search transactions..."
      />
    </DashboardLayout>
  );
}
