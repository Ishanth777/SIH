'use client';

import React from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { DataTable, Column } from '../../../../components/common/DataTable';
import { SOCIETIES_DATA, CooperativeSociety } from '../../../../data/mock-data';

export default function FederationSocietiesPage() {
  const columns: Column<CooperativeSociety>[] = [
    {
      header: 'Society Name & Registration',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.name}</p>
          <p className="text-[10px] text-slate-500 font-mono">{row.registrationNumber}</p>
        </div>
      ),
    },
    {
      header: 'District',
      accessor: (row) => <span className="font-medium text-slate-800">{row.district}</span>,
    },
    {
      header: 'Total Artisans',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900">{row.totalWorkers}</span>
          <span className="text-[10px] text-slate-500 block">{row.activeWorkers} on duty</span>
        </div>
      ),
    },
    {
      header: 'Monthly Turnover',
      accessor: (row) => <span className="font-bold text-slate-900">₹{(row.monthlyRevenue / 100000).toFixed(1)} Lakhs</span>,
    },
    {
      header: 'KYC Verified Rate',
      accessor: (row) => (
        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-bold">
          {row.verifiedRate}%
        </span>
      ),
    },
    {
      header: 'Grievances',
      accessor: (row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
            row.openDisputes > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {row.openDisputes} Open
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout
      role="FEDERATION_ADMIN"
      userName="Karnataka Apex Federation"
      title="Member Cooperative Societies Registry"
      subtitle="Audit and supervision of registered district cooperative societies across Karnataka."
    >
      <DataTable
        title="District Cooperative Society Audit Ledger"
        columns={columns}
        data={SOCIETIES_DATA}
        searchPlaceholder="Search society name, district, reg #..."
      />
    </DashboardLayout>
  );
}
