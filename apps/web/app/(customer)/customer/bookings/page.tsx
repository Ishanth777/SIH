'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { DataTable, Column } from '../../../../components/common/DataTable';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { BOOKINGS_DATA, Booking } from '../../../../data/mock-data';
import { PlusIcon } from '../../../../components/icons';

export default function CustomerBookingsPage() {
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredBookings = BOOKINGS_DATA.filter((b) => {
    if (activeTab === 'ACTIVE') return b.status === 'IN_PROGRESS' || b.status === 'MATCHED';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  const bookingColumns: Column<Booking>[] = [
    {
      header: 'Booking ID',
      accessor: (row) => <span className="font-mono font-bold text-xs text-[#0E2150]">{row.id}</span>,
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
      header: 'Assigned Artisan',
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
      header: 'Schedule & Location',
      accessor: (row) => (
        <div>
          <p className="text-slate-800 font-medium">{row.scheduledDate}, {row.scheduledTime}</p>
          <p className="text-[10px] text-slate-500 truncate max-w-xs">{row.address}</p>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: (row) => <span className="font-bold text-slate-900">₹{row.amount}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'IN_PROGRESS' && (
            <Link
              href={`/job-tracking/${row.id}`}
              className="px-2.5 py-1 rounded bg-[#059669] text-white text-[11px] font-bold hover:bg-[#047857]"
            >
              Track GPS
            </Link>
          )}
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
      title="My Service Bookings"
      subtitle="View ongoing dispatches, past receipts, and artisan track records."
      actions={
        <Link
          href="/booking"
          className="px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Service Request</span>
        </Link>
      }
    >
      <DataTable
        columns={bookingColumns}
        data={filteredBookings}
        filterTabs={[
          { label: 'All Bookings', value: 'ALL', count: BOOKINGS_DATA.length },
          { label: 'Active Dispatches', value: 'ACTIVE', count: BOOKINGS_DATA.filter(b => b.status === 'IN_PROGRESS').length },
          { label: 'Completed', value: 'COMPLETED', count: BOOKINGS_DATA.filter(b => b.status === 'COMPLETED').length },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchPlaceholder="Search by ID, trade, artisan..."
      />
    </DashboardLayout>
  );
}
