'use client';

import React from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { StatCard } from '../../../../components/common/StatCard';
import { ShieldCheckIcon, ActivityIcon, CheckCircleIcon, BuildingIcon } from '../../../../components/icons';

export default function SuperAdminSystemPage() {
  return (
    <DashboardLayout
      role="SUPER_ADMIN"
      userName="Platform Super Admin"
      title="System Architecture & Database Security"
      subtitle="Verification of core architectural constraints (PostGIS, RLS, Redis BullMQ, MinIO S3)."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Database Isolation (Rule A1)"
          value="RLS Enforced"
          subtext="PostgreSQL Row-Level Security active"
          icon={<ShieldCheckIcon className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="Geospatial Matching (Rule A2)"
          value="PostGIS 16"
          subtext="ST_DWithin geo-spatial indexing"
          icon={<ActivityIcon className="w-5 h-5 text-[#059669]" />}
        />
        <StatCard
          label="Async Task Queue (Rule B3)"
          value="BullMQ + Redis"
          subtext="Non-blocking SMS & matching fan-out"
          icon={<CheckCircleIcon className="w-5 h-5 text-[#0E2150]" />}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">
            Architectural Guardrails Audit Status
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable architectural rules enforced by continuous integration and automated test suites.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {[
            { rule: 'Rule A1: Multi-tenancy at DB level (RLS)', detail: 'app.current_cooperative_id session binding verified in CI gate.', status: 'PASSED' },
            { rule: 'Rule A2: PostGIS from Day One', detail: 'ST_DWithin spatial queries without application-layer distance math.', status: 'PASSED' },
            { rule: 'Rule A3: Deterministic matcher independence', detail: 'Matcher operates with zero dependency on AI forecasting service.', status: 'PASSED' },
            { rule: 'Rule A4 & A5: Swappable payment gateway & idempotent webhooks', detail: 'RazorpayAdapter behind PaymentGateway interface, keyed on jobId.', status: 'PASSED' },
            { rule: 'Rule A6: KYC documents in MinIO/S3 object storage', detail: 'No database blob storage; secure presigned URLs only.', status: 'PASSED' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <p className="font-heading font-bold text-sm text-[#0E2150]">{item.rule}</p>
                <p className="text-slate-500 mt-0.5">{item.detail}</p>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
