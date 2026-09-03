'use client';

import React from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { StatCard } from '../../../../components/common/StatCard';
import { DataTable, Column } from '../../../../components/common/DataTable';
import { HeartPulseIcon, ShieldCheckIcon, RupeeIcon, UsersIcon } from '../../../../components/icons';
import { WELFARE_SCHEMES, WelfareScheme } from '../../../../data/mock-data';

export default function SocietyWelfarePage() {
  const columns: Column<WelfareScheme>[] = [
    {
      header: 'Scheme Name',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.name}</p>
          <span className="text-[10px] text-[#059669] font-bold uppercase">{row.category}</span>
        </div>
      ),
    },
    {
      header: 'Benefit & Coverage',
      accessor: (row) => <span className="text-slate-700 text-xs">{row.coverage}</span>,
    },
    {
      header: 'Society Contribution',
      accessor: (row) => <span className="text-slate-600 text-xs">{row.premium}</span>,
    },
    {
      header: 'Enrolled Guild Members',
      accessor: (row) => <span className="font-bold text-slate-900">{row.enrolledWorkers} Artisans</span>,
    },
  ];

  return (
    <DashboardLayout
      role="SOCIETY_ADMIN"
      userName="Bangalore South Operations"
      title="Society Welfare Reserve Fund"
      subtitle="Social security disbursement, insurance premiums, and emergency health aid administration."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Society Reserve Fund Balance"
          value="₹4,82,400"
          subtext="Audited statutory cooperative reserve"
          icon={<RupeeIcon className="w-5 h-5 text-[#059669]" />}
        />
        <StatCard
          label="Insured Guild Artisans"
          value="388 / 420"
          subtext="92.3% PMSBY enrollment coverage"
          icon={<ShieldCheckIcon className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="Emergency Grants Disbursed"
          value="14 Claims"
          subtext="Zero unresolved medical claims"
          icon={<HeartPulseIcon className="w-5 h-5 text-rose-600" />}
        />
      </div>

      <DataTable
        title="Active Welfare Programs"
        columns={columns}
        data={WELFARE_SCHEMES}
        searchPlaceholder="Search schemes..."
      />
    </DashboardLayout>
  );
}
