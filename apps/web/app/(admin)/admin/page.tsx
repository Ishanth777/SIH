'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { StatCard } from '../../../components/common/StatCard';
import { DataTable, Column } from '../../../components/common/DataTable';
import { BuildingIcon, UsersIcon, ShieldCheckIcon, ActivityIcon, RupeeIcon } from '../../../components/icons';
import { FEDERATION_DATA, SOCIETIES_DATA, CooperativeSociety } from '../../../data/mock-data';

export default function SuperAdminPage() {
  const societyColumns: Column<CooperativeSociety>[] = [
    {
      header: 'Society Name',
      accessor: (row) => <span className="font-bold text-slate-900">{row.name}</span>,
    },
    {
      header: 'District / State',
      accessor: (row) => <span className="text-slate-700">{row.district}, {row.state}</span>,
    },
    {
      header: 'Federation Parent',
      accessor: (row) => <span className="text-xs text-slate-600">{row.federationName}</span>,
    },
    {
      header: 'Workers',
      accessor: (row) => <span className="font-bold text-slate-900">{row.totalWorkers}</span>,
    },
    {
      header: 'RLS Policy Status',
      accessor: () => (
        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
          RLS ENFORCED
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout
      role="SUPER_ADMIN"
      userName="Platform Super Admin"
      userSubtitle="BharatGig Global Infrastructure"
      title="Platform Operations Matrix"
      subtitle="Global multi-tenant governance, federations, database isolation, and ecosystem health."
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <StatCard
          label="Active Federations"
          value="1 State Apex"
          subtext="Karnataka Apex Federation"
          icon={<BuildingIcon className="w-5 h-5 text-[#0E2150]" />}
        />
        <StatCard
          label="Member Societies"
          value="18 Registered"
          subtext="Bangalore, Mysore, Dharwad"
          icon={<BuildingIcon className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="Total Ecosystem Artisans"
          value="3,420"
          subtext="100% Aadhaar KYC mapped"
          icon={<UsersIcon className="w-5 h-5 text-[#059669]" />}
        />
        <StatCard
          label="PostGIS Geo-Engine"
          value="ST_DWithin Active"
          subtext="Deterministic matcher online"
          icon={<ShieldCheckIcon className="w-5 h-5 text-navy-600" />}
        />
      </div>

      <DataTable
        title="Federation & Society Tenant Directory"
        columns={societyColumns}
        data={SOCIETIES_DATA}
        searchPlaceholder="Search tenants..."
      />
    </DashboardLayout>
  );
}
