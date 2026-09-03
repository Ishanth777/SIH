'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { StatCard } from '../../../components/common/StatCard';
import { DataTable, Column } from '../../../components/common/DataTable';
import {
  BuildingIcon,
  UsersIcon,
  RupeeIcon,
  ShieldCheckIcon,
  UserCheckIcon,
} from '../../../components/icons';
import { FEDERATION_DATA, SOCIETIES_DATA, CooperativeSociety } from '../../../data/mock-data';

export default function FederationOverviewPage() {
  const fed = FEDERATION_DATA;

  const societyColumns: Column<CooperativeSociety>[] = [
    {
      header: 'Society Name & Reg',
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
      header: 'Registered Artisans',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900">{row.totalWorkers}</span>
          <span className="text-[10px] text-slate-500 block">{row.activeWorkers} on duty</span>
        </div>
      ),
    },
    {
      header: 'Monthly Volume',
      accessor: (row) => <span className="font-bold text-slate-900">₹{(row.monthlyRevenue / 100000).toFixed(1)}L</span>,
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
      header: 'Open Disputes',
      accessor: (row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
            row.openDisputes > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {row.openDisputes}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout
      role="FEDERATION_ADMIN"
      userName="Karnataka Apex Federation"
      userSubtitle="State Multi-Tenant Administration"
      title="Apex Cooperative Federation Governance"
      subtitle="Multi-tenant supervision across 18 member societies and 3,420 guild artisans."
      actions={
        <Link
          href="/federation/worker-verification"
          className="px-4 py-2 rounded-lg bg-[#0E2150] text-white text-xs font-bold hover:bg-[#1A3470] transition flex items-center gap-1.5 shadow-xs"
        >
          <UserCheckIcon className="w-4 h-4" />
          <span>KYC Verification Queue (2 Pending)</span>
        </Link>
      }
    >
      {/* 1. Statewide Apex KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <StatCard
          label="Affiliated Societies"
          value={fed.totalSocieties}
          subtext="Audited under state bylaws"
          icon={<BuildingIcon className="w-5 h-5 text-[#0E2150]" />}
        />
        <StatCard
          label="Total State Guild Artisans"
          value={fed.totalWorkers.toLocaleString()}
          subtext="100% Aadhaar KYC mapped"
          icon={<UsersIcon className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="Statewide Wage Disbursements"
          value={`₹${(fed.totalDisbursement / 10000000).toFixed(2)} Cr`}
          subtext="0% middleman commission"
          icon={<RupeeIcon className="w-5 h-5 text-[#059669]" />}
        />
        <StatCard
          label="Audit Compliance Score"
          value={`${fed.complianceScore}%`}
          subtext="DPDPA & statutory reserve verified"
          icon={<ShieldCheckIcon className="w-5 h-5 text-navy-600" />}
        />
      </div>

      {/* 2. Member Societies DataTable */}
      <DataTable
        title="Audited Member Cooperative Societies"
        subtitle="Hierarchy: Federation → Cooperative Society → Worker"
        columns={societyColumns}
        data={SOCIETIES_DATA}
        searchPlaceholder="Search society name, district, registration #..."
      />
    </DashboardLayout>
  );
}
