'use client';

import React from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { StatCard } from '../../../../components/common/StatCard';
import { ShieldCheckIcon, RupeeIcon, UsersIcon, CheckCircleIcon } from '../../../../components/icons';

export default function FederationCompliancePage() {
  return (
    <DashboardLayout
      role="FEDERATION_ADMIN"
      userName="Karnataka Apex Federation"
      title="Statewide Compliance & Fair Wage Auditing"
      subtitle="Statutory oversight of wage distributions, social security coverage, and data isolation."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Statewide Wage Compliance"
          value="100.0%"
          subtext="Zero below-minimum-wage jobs recorded"
          icon={<RupeeIcon className="w-5 h-5 text-[#059669]" />}
        />
        <StatCard
          label="Multi-Tenant RLS Status"
          value="100% Isolated"
          subtext="Rule T1: DB-level Row-Level Security active"
          icon={<ShieldCheckIcon className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="PMSBY Insurance Coverage"
          value="94.8%"
          subtext="3,240 of 3,420 artisans covered"
          icon={<CheckCircleIcon className="w-5 h-5 text-[#0E2150]" />}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">
            State Cooperative Regulatory Audits
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verification criteria mandated under Karnataka Cooperative Societies Act, 1959.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { item: 'Statutory 2% Welfare Reserve Allocation', status: 'AUDIT PASSED', desc: 'All 18 societies maintain ring-fenced bank accounts for worker welfare reserve.' },
            { item: 'DPDPA 2023 Aadhaar Masking & Data Consent', status: 'AUDIT PASSED', desc: 'MinIO object storage stores only masked PDF assets with signed consent timestamps.' },
            { item: 'Razorpay Payment Gateway Interface Isolation', status: 'AUDIT PASSED', desc: 'Rule A4: Gateway adapter swappable without touching core settlement logic.' },
            { item: 'PostGIS Deterministic Matching Independence', status: 'AUDIT PASSED', desc: 'Rule A3: Platform functions 100% normally if AI forecasting service is offline.' },
          ].map((audit, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-heading font-bold text-sm text-[#0E2150]">{audit.item}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{audit.desc}</p>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0">
                {audit.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
