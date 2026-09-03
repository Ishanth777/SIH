'use client';

import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { DataTable, Column } from '../../../components/common/DataTable';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { BOOKINGS_DATA, Booking } from '../../../data/mock-data';

export default function WorkerJobsPage() {
  const workerBookings = BOOKINGS_DATA.filter((b) => b.workerName === 'Karthik Raghavan');

  const columns: Column<Booking>[] = [
    {
      header: 'Job ID',
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
      header: 'Customer',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.customerName}</p>
          <p className="text-[10px] text-slate-500">{row.customerPhone}</p>
        </div>
      ),
    },
    {
      header: 'Address',
      accessor: (row) => <span className="text-slate-600 truncate max-w-xs block">{row.address}</span>,
    },
    {
      header: 'Earnings (100%)',
      accessor: (row) => <span className="font-bold text-slate-900">₹{row.amount}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout
      role="WORKER"
      userName="Karthik Raghavan"
      userSubtitle="Electrician • Bangalore South Labour Cooperative"
      title="Assigned Jobs & Dispatch Radar"
      subtitle="Overview of your current and past service dispatches."
    >
      <DataTable
        title="Jobs History"
        columns={columns}
        data={workerBookings}
        searchPlaceholder="Search job ID, customer, address..."
      />
    </DashboardLayout>
  );
}
