'use client';

import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { ShieldCheckIcon, UserCheckIcon, BriefcaseIcon, MapPinIcon } from '../../../components/icons';
import { WORKERS_DATA } from '../../../data/mock-data';

export default function WorkerProfilePage() {
  const worker = WORKERS_DATA[0];

  return (
    <DashboardLayout
      role="WORKER"
      userName={worker.fullName}
      userSubtitle="Electrician • Bangalore South Labour Cooperative"
      title="Artisan Guild Profile & Credentials"
      subtitle="Your verified cooperative licensing, skills certifications, and KYC record."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0E2150] text-white flex items-center justify-center font-bold text-lg">
                KR
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#0E2150]">{worker.fullName}</h3>
                <p className="text-xs text-slate-500">{worker.phone} • Member since {worker.joinedDate}</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
              <span>Aadhaar Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Cooperative Guild</span>
              <p className="font-bold text-slate-900 text-sm">{worker.cooperativeName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Apex Federation</span>
              <p className="font-bold text-slate-900 text-sm">Karnataka Apex Cooperative Federation</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Primary Trade</span>
              <p className="font-bold text-slate-900 text-sm">{worker.category}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Guild License ID</span>
              <p className="font-mono font-bold text-slate-900 text-sm">BG-KA-BLR-0982</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500">
              Uploaded KYC Documents (MinIO / S3 Storage)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <span>Aadhaar Card (Masked)</span>
                <span className="text-emerald-700 font-bold text-[11px]">Verified</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <span>ITI / Trade Skill Certificate</span>
                <span className="text-emerald-700 font-bold text-[11px]">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h4 className="font-heading font-bold text-sm text-[#0E2150]">Guild Quality Metrics</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Rating</span>
                <strong className="text-slate-900">{worker.rating} / 5.0</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verified Completions</span>
                <strong className="text-slate-900">{worker.completedJobs} Jobs</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">On-Time Arrival Rate</span>
                <strong className="text-emerald-700 font-bold">99.1%</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Grievance Rate</span>
                <strong className="text-slate-900">0.0%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
