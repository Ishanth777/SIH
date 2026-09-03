'use client';

import React from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { StatCard } from '../../../../components/common/StatCard';
import { SparklesIcon, TrendingUpIcon, UsersIcon, ShieldCheckIcon } from '../../../../components/icons';

export default function SocietyForecastingPage() {
  return (
    <DashboardLayout
      role="SOCIETY_ADMIN"
      userName="Bangalore South Operations"
      title="AI Demand & Staffing Forecasting"
      subtitle="District-level predictive model forecasting service volume up to 5 days ahead (FastAPI AI microservice)."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Weekend Forecast Surge"
          value="+65% Demand"
          subtext="Peak expected Saturday 10:00 AM - 4:00 PM"
          icon={<TrendingUpIcon className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="Recommended On-Duty Artisans"
          value="68 Workers"
          subtext="42 Electricians + 26 Plumbers"
          icon={<UsersIcon className="w-5 h-5 text-[#0E2150]" />}
        />
        <StatCard
          label="Deterministic Match Fallback"
          value="Rule A3 Active"
          subtext="Zero AI gatekeeping of jobs"
          icon={<ShieldCheckIcon className="w-5 h-5 text-navy-600" />}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-heading font-bold text-base text-[#0E2150]">
            5-Day Trade-Wise Demand Projections
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Model features: historical booking frequency, local festival calendars, weather telemetry, and seasonal plumbing demand.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { trade: 'Electricians', today: 18, peak: 34, confidence: '94%', note: 'High AC servicing demand expected in Bellandur tech corridor' },
            { trade: 'Plumbers', today: 14, peak: 28, confidence: '91%', note: 'Overhead tank cleanups and sanitary valve replacements' },
            { trade: 'Deep Cleaners', today: 10, peak: 26, confidence: '96%', note: 'Pre-festival weekend apartment restoration surge' },
            { trade: 'Caregivers', today: 6, peak: 8, confidence: '98%', note: 'Stable recurring elder-care shift assignments' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-heading font-bold text-sm text-[#0E2150]">{item.trade}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>
              </div>
              <div className="flex items-center gap-6 text-xs shrink-0">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Today</span>
                  <strong className="text-slate-900">{item.today} jobs</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Weekend Peak</span>
                  <strong className="text-emerald-700 font-bold">{item.peak} jobs</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Confidence</span>
                  <strong className="text-[#0E2150]">{item.confidence}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
