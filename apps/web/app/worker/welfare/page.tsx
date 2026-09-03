'use client';

import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { ShieldCheckIcon, HeartPulseIcon, CheckCircleIcon } from '../../../components/icons';
import { WELFARE_SCHEMES } from '../../../data/mock-data';

export default function WorkerWelfarePage() {
  return (
    <DashboardLayout
      role="WORKER"
      userName="Karthik Raghavan"
      userSubtitle="Electrician • Bangalore South Labour Cooperative"
      title="Cooperative Welfare & Insurance Schemes"
      subtitle="Social security benefits provided by your cooperative society and state federation."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {WELFARE_SCHEMES.map((scheme, idx) => (
          <div key={scheme.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 uppercase tracking-wider">
                  {scheme.category}
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Enrolled</span>
                </span>
              </div>

              <h3 className="font-heading font-bold text-base text-[#0E2150]">{scheme.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{scheme.coverage}</p>

              <div className="pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-600">
                <p><strong className="text-slate-900">Premium Cost:</strong> {scheme.premium}</p>
                <p><strong className="text-slate-900">Govt Support:</strong> {scheme.govtContribution}</p>
                <p><strong className="text-slate-900">Eligibility:</strong> {scheme.eligibility}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button className="w-full py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-[#0E2150] hover:bg-slate-100 transition">
                Download Certificate / ID Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
