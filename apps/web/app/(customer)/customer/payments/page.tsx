'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { DataTable, Column } from '../../../../components/common/DataTable';
import { BOOKINGS_DATA, Booking } from '../../../../data/mock-data';
import { RupeeIcon, ShieldCheckIcon, CreditCardIcon } from '../../../../components/icons';

export default function CustomerPaymentsPage() {
  const paymentColumns: Column<Booking>[] = [
    {
      header: 'Invoice #',
      accessor: (row) => <span className="font-mono font-bold text-xs text-[#0E2150]">INV-{row.id}</span>,
    },
    {
      header: 'Service Item',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.serviceName}</p>
          <p className="text-[11px] text-slate-500">{row.cooperativeName}</p>
        </div>
      ),
    },
    {
      header: 'Worker Payout (100%)',
      accessor: (row) => (
        <span className="font-medium text-slate-800">{row.workerName || 'Assigned Artisan'}</span>
      ),
    },
    {
      header: 'Method',
      accessor: (row) => (
        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
          {row.paymentMethod}
        </span>
      ),
    },
    {
      header: 'Total Amount',
      accessor: (row) => <span className="font-bold text-slate-900">₹{row.amount}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
            row.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {row.isPaid ? 'SETTLED' : 'DUE ON COMPLETION'}
        </span>
      ),
    },
    {
      header: 'Receipt',
      accessor: (row) => (
        <Link
          href={`/payment/${row.id}`}
          className="text-xs font-semibold text-[#0E2150] hover:underline"
        >
          View Itemized Receipt
        </Link>
      ),
    },
  ];

  const totalSpent = BOOKINGS_DATA.filter((b) => b.isPaid).reduce((acc, b) => acc + b.amount, 0);

  return (
    <DashboardLayout
      role="CUSTOMER"
      title="Invoices & Cooperative Receipts"
      subtitle="Transparent accounting with 100% direct labour wage disbursement."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Settled Payments</span>
          <p className="text-2xl font-black font-heading text-[#0E2150]">₹{totalSpent}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% paid directly to artisans</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Platform / Middleman Cut</span>
          <p className="text-2xl font-black font-heading text-emerald-600">₹0.00</p>
          <span className="text-[10px] text-slate-500">Cooperative non-extractive model</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Welfare Reserve Included</span>
          <p className="text-2xl font-black font-heading text-[#0E2150]">₹{(totalSpent * 0.02).toFixed(0)}</p>
          <span className="text-[10px] text-slate-500">PMSBY + Society health fund</span>
        </div>
      </div>

      <DataTable
        title="Payment Ledger"
        columns={paymentColumns}
        data={BOOKINGS_DATA}
        searchPlaceholder="Search invoice # or service..."
      />
    </DashboardLayout>
  );
}
