'use client';

import React, { useState } from 'react';
import {
  BuildingIcon,
  UsersIcon,
  BriefcaseIcon,
  RupeeIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from '@/components/icons';

interface FederationMetrics {
  totalSocieties: number;
  totalWorkers: number;
  verifiedWorkers: number;
  totalJobsCompleted: number;
  totalVolumeInr: number;
  activeJobs: number;
}

export default function FederationAdminDashboard() {
  const [metrics] = useState<FederationMetrics>({
    totalSocieties: 4,
    totalWorkers: 128,
    verifiedWorkers: 114,
    totalJobsCompleted: 540,
    totalVolumeInr: 342500,
    activeJobs: 18,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Federation Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">
              Cross-society governance, state-level metrics, and worker verification audit
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/federation/worker-verification"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition flex items-center gap-2"
            >
              <CheckCircleIcon className="w-4 h-4" /> Worker Verification Queue
            </a>
          </div>
        </div>

        {/* Top KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Societies</span>
              <BuildingIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{metrics.totalSocieties}</div>
            <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
              <TrendingUpIcon className="w-3 h-3" /> Active federated
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Total Workers</span>
              <UsersIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold">{metrics.totalWorkers}</div>
            <div className="text-xs text-slate-400 mt-1">
              {metrics.verifiedWorkers} verified (89%)
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Jobs Completed</span>
              <BriefcaseIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold">{metrics.totalJobsCompleted}</div>
            <div className="text-xs text-emerald-400 mt-1">Across all districts</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Gross Value</span>
              <RupeeIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold">₹{(metrics.totalVolumeInr / 1000).toFixed(1)}k</div>
            <div className="text-xs text-slate-400 mt-1">Fair-wage payouts</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Live Jobs</span>
              <TrendingUpIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold">{metrics.activeJobs}</div>
            <div className="text-xs text-purple-400 mt-1">Real-time matching</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Compliance</span>
              <ShieldCheckIcon className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold">100%</div>
            <div className="text-xs text-green-400 mt-1">RLS & DPDPA active</div>
          </div>
        </div>

        {/* Member Societies Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold">Federated Cooperative Societies</h2>
            <span className="text-xs text-slate-400">Multi-tenant isolated per Rule A1</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Society Name</th>
                  <th className="py-3.5 px-4 font-semibold">District</th>
                  <th className="py-3.5 px-4 font-semibold">Active Workers</th>
                  <th className="py-3.5 px-4 font-semibold">Completion Rate</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium">Bangalore South Labour Cooperative</td>
                  <td className="py-3 px-4 text-slate-400">Bangalore Urban</td>
                  <td className="py-3 px-4">42 workers</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">97.4%</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/60 text-green-300 border border-green-700/50">
                      Healthy
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium">Mysore Rural Electrical & Plumbing Society</td>
                  <td className="py-3 px-4 text-slate-400">Mysore</td>
                  <td className="py-3 px-4">31 workers</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">94.8%</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/60 text-green-300 border border-green-700/50">
                      Healthy
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium">Hubli-Dharwad Skilled Guild</td>
                  <td className="py-3 px-4 text-slate-400">Dharwad</td>
                  <td className="py-3 px-4">27 workers</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">96.1%</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/60 text-green-300 border border-green-700/50">
                      Healthy
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
