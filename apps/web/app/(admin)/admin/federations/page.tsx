'use client';

import React from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { DataTable, Column } from '../../../../components/common/DataTable';
import { FEDERATION_DATA, Federation } from '../../../../data/mock-data';

export default function SuperAdminFederationsPage() {
  const columns: Column<Federation>[] = [
    {
      header: 'Federation Name',
      accessor: (row) => <span className="font-bold text-slate-900">{row.name}</span>,
    },
    {
      header: 'State',
      accessor: (row) => <span className="font-medium text-slate-800">{row.state}</span>,
    },
    {
      header: 'Member Societies',
      accessor: (row) => <span className="font-bold text-slate-900">{row.totalSocieties}</span>,
    },
    {
      header: 'Affiliated Artisans',
      accessor: (row) => <span className="font-bold text-slate-900">{row.totalWorkers}</span>,
    },
    {
      header: 'Compliance Score',
      accessor: (row) => (
        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-bold">
          {row.complianceScore}%
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout
      role="SUPER_ADMIN"
      userName="Platform Super Admin"
      title="State Apex Federations Registry"
      subtitle="Top of tenancy hierarchy: Federation → Cooperative Society → Worker."
    >
      <DataTable
        title="State Apex Federations"
        columns={columns}
        data={[FEDERATION_DATA]}
        searchPlaceholder="Search federations..."
      />
    </DashboardLayout>
  );
}
