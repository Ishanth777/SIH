'use client';

import React, { useState } from 'react';
import {
  UsersIcon,
  BriefcaseIcon,
  ClockIcon,
  MapPinIcon,
  ActivityIcon,
} from '@/components/icons';

export default function SocietyAdminDashboard() {
  const [societyName] = useState('Bangalore South Labour Cooperative');
  const [stats] = useState({
    activeWorkers: 38,
    busyWorkers: 14,
    availableWorkers: 24,
    todayBookings: 22,
    completionRate: '98.2%',
    utilizationRate: '58.3%',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="pb-6 border-b border-slate-800 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
              Cooperative Society Portal
            </div>
            <h1 className="text-3xl font-extrabold">{societyName}</h1>
            <p className="text-slate-400 text-sm mt-1">
              Local branch operations, real-time worker dispatch, and utilization tracking
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Dispatch Engine Live
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Total Workers</span>
              <UsersIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{stats.activeWorkers}</div>
            <div className="text-xs text-slate-400 mt-1">
              {stats.availableWorkers} ready for dispatch
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Active on Jobs</span>
              <BriefcaseIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold">{stats.busyWorkers}</div>
            <div className="text-xs text-amber-400 mt-1">In-progress at customer sites</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Today's Bookings</span>
              <ClockIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold">{stats.todayBookings}</div>
            <div className="text-xs text-green-400 mt-1">100% matched within 10s</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Worker Utilization</span>
              <ActivityIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold">{stats.utilizationRate}</div>
            <div className="text-xs text-emerald-400 mt-1">Optimal staffing balance</div>
          </div>
        </div>

        {/* Live Bookings Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Society Bookings</h2>
            <span className="text-xs text-slate-400">PostGIS Geo-matched</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Service</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Worker</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/50">
                  <td className="py-3.5 px-4 font-medium">Electrician (Emergency)</td>
                  <td className="py-3.5 px-4">Karthik R.</td>
                  <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5 text-blue-400" /> Jayanagar 4th Block
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/60 text-blue-300 border border-blue-700/50">
                      IN_PROGRESS
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="py-3.5 px-4 font-medium">Plumbing Leakage Repair</td>
                  <td className="py-3.5 px-4">Suresh Nair</td>
                  <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5 text-blue-400" /> BTM Layout Stage 2
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                      COMPLETED
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/50">
                  <td className="py-3.5 px-4 font-medium">Home Deep Cleaning</td>
                  <td className="py-3.5 px-4">Meena G.</td>
                  <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5 text-blue-400" /> Koramangala 5th Block
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900/60 text-purple-300 border border-purple-700/50">
                      ACCEPTED
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
