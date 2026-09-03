'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { DataTable, Column } from '../../../../components/common/DataTable';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { WORKERS_DATA, WorkerProfile } from '../../../../data/mock-data';
import { ShieldCheckIcon, StarIcon } from '../../../../components/icons';

export default function SocietyWorkersPage() {
  const [tab, setTab] = useState('ALL');

  const filteredWorkers = WORKERS_DATA.filter((w) => {
    if (tab === 'VERIFIED') return w.verificationStatus === 'VERIFIED';
    if (tab === 'PENDING') return w.verificationStatus === 'PENDING' || w.verificationStatus === 'UNDER_REVIEW';
    return true;
  });

  const columns: Column<WorkerProfile>[] = [
    {
      header: 'Artisan Name',
      accessor: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#0E2150] text-white flex items-center justify-center text-[10px] font-bold">
            {row.fullName.substring(0, 2)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{row.fullName}</p>
            <p className="text-[10px] text-slate-500">{row.phone}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Trade Guild',
      accessor: (row) => <span className="font-medium text-slate-800">{row.category}</span>,
    },
    {
      header: 'Availability',
      accessor: (row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
            row.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {row.isAvailable ? 'ON DUTY' : 'OFFLINE'}
        </span>
      ),
    },
    {
      header: 'Rating',
      accessor: (row) => (
        <div className="flex items-center gap-1 font-bold text-slate-800">
          <StarIcon className="w-3.5 h-3.5 text-amber-500" />
          <span>{row.rating > 0 ? row.rating : 'New'}</span>
        </div>
      ),
    },
    {
      header: 'Completed Jobs',
      accessor: (row) => <span className="font-semibold text-slate-900">{row.completedJobs}</span>,
    },
    {
      header: 'KYC Status',
      accessor: (row) => <StatusBadge status={row.verificationStatus} />,
    },
  ];

  return (
    <DashboardLayout
      role="SOCIETY_ADMIN"
      userName="Bangalore South Operations"
      title="Registered Artisans Roster"
      subtitle="Cooperative guild membership, KYC verification audits, and real-time dispatch availability."
    >
      <DataTable
        columns={columns}
        data={filteredWorkers}
        filterTabs={[
          { label: 'All Artisans', value: 'ALL', count: WORKERS_DATA.length },
          { label: 'Verified & Active', value: 'VERIFIED', count: WORKERS_DATA.filter(w => w.verificationStatus === 'VERIFIED').length },
          { label: 'Pending KYC Review', value: 'PENDING', count: WORKERS_DATA.filter(w => w.verificationStatus !== 'VERIFIED').length },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        searchPlaceholder="Search artisan name, trade, phone..."
      />
    </DashboardLayout>
  );
}
