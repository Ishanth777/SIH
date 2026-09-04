'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatchingStatus } from '@/hooks/useMatchingStatus';
import { MatchingStatusIndicator } from '@/components/booking/MatchingStatusIndicator';
import { WorkerRecommendationChatbot, CandidateWorker } from '@/components/matching/WorkerRecommendationChatbot';
import { ArrowLeftIcon, SparklesIcon, ShieldCheckIcon } from '@/components/icons';
import { addBooking } from '@/data/bookings-store';

export default function RequestMatchingPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const { request, loading, error } = useMatchingStatus(requestId);
  const [assignedWorker, setAssignedWorker] = useState<CandidateWorker | null>(null);
  const [dispatchedJobId, setDispatchedJobId] = useState<string | null>(null);

  const handleSelectWorker = (worker: CandidateWorker) => {
    setAssignedWorker(worker);
    const newBooking = addBooking({
      serviceName: worker.trade,
      category: (worker.trade.toLowerCase().includes('plumb') ? 'PLUMBER' :
                 worker.trade.toLowerCase().includes('electr') ? 'ELECTRICIAN' :
                 worker.trade.toLowerCase().includes('clean') ? 'CLEANER' : 'CAREGIVER') as any,
      urgency: 'EMERGENCY',
      customerName: 'Anup Sharma',
      customerPhone: '+91 98451 98210',
      workerName: `${worker.name} (${worker.nsqfLevel.split('(')[0].trim()})`,
      cooperativeName: worker.society,
      scheduledDate: new Date().toLocaleDateString('en-GB'),
      scheduledTime: `Immediate (${worker.etaMinutes}m ETA)`,
      address: 'Jayanagar 4th Block, Bengaluru, Karnataka',
      amount: worker.hourlyRate * 2,
      status: 'IN_PROGRESS',
    });
    setDispatchedJobId(newBooking.id);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-64px)] py-10 md:py-14 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/booking')}
            className="text-xs font-heading font-bold text-[#475569] hover:text-[#0D1829] flex items-center gap-1.5 transition"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Booking Form
          </button>
          <div className="flex items-center gap-2">
            <span className="badge-pill bg-[#D1FAE5] text-[#047857] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              Live AI Dispatch Room
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-medium flex items-center justify-between">
            <span>Demo Dispatch Room: Running local PostGIS deterministic matcher mode for request <strong>{requestId}</strong>.</span>
          </div>
        )}

        {/* Assigned Worker Banner if Dispatched */}
        {assignedWorker && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-xs flex items-center justify-between flex-wrap gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0E2150] text-white flex items-center justify-center font-bold text-sm">
                {assignedWorker.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-sm text-[#0E2150]">
                    {assignedWorker.name} Dispatched!
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800">
                    Match: {assignedWorker.totalScore.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-emerald-700">
                  {assignedWorker.trade} • ETA: {assignedWorker.etaMinutes} mins ({assignedWorker.distanceKm} km away)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push(`/job-tracking/${dispatchedJobId || requestId}`)}
                className="px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <span>Track Live GPS Radar →</span>
              </button>
              <button
                type="button"
                onClick={() => router.push(`/customer/bookings`)}
                className="px-3.5 py-2 rounded-lg bg-[#0E2150] hover:bg-[#1A3470] text-white text-xs font-bold shadow-xs transition"
              >
                View in My Bookings
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Dispatch Status Indicator & Booking Summary */}
          <div className="lg:col-span-1 space-y-6">
            <MatchingStatusIndicator
              status={assignedWorker ? 'MATCHED' : (request?.job?.status || 'PENDING')}
              requestId={requestId}
              jobId={request?.job?.id || 'job-sim-8842'}
            />

            <div className="card-base space-y-3 bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h4 className="font-heading font-extrabold text-xs text-[#0D1829] uppercase tracking-wider">
                  Booking Summary
                </h4>
                <span className="label-style">Verified Rate</span>
              </div>

              <div className="text-xs font-sans text-[#475569] flex justify-between">
                <span>Trade Service:</span>
                <span className="font-heading font-bold text-[#0D1829]">
                  {request?.serviceCatalog?.name || 'Master Plumbing Repair'}
                </span>
              </div>

              <div className="text-xs font-sans text-[#475569] flex justify-between">
                <span>Dispatch Type:</span>
                <span className="badge-pill bg-[#F1F5F9] text-[#0D1829]">
                  {request?.type || 'EMERGENCY'}
                </span>
              </div>

              <div className="text-xs font-sans text-[#475569] flex justify-between">
                <span>Destination:</span>
                <span className="font-medium text-[#0D1829] text-right truncate max-w-[160px]">
                  {request?.address || 'Koramangala 4th Block, Bengaluru'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Sahayak AI Recommendation Chatbot */}
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-emerald-600" />
                <h3 className="font-heading font-bold text-sm text-[#0E2150]">
                  Sahayak AI Recommendation Chatbot
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500 font-mono">
                Deterministic Scoring Active
              </span>
            </div>

            <WorkerRecommendationChatbot
              embedded={true}
              isOpen={true}
              onSelectWorker={handleSelectWorker}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
