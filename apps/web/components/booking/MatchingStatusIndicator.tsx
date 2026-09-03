'use client';

import React from 'react';
import { JobStatus } from '../../types/matching.types';

interface MatchingStatusIndicatorProps {
  status?: JobStatus;
  requestId: string;
  jobId?: string;
}

export const MatchingStatusIndicator: React.FC<MatchingStatusIndicatorProps> = ({
  status = 'PENDING',
  requestId,
  jobId,
}) => {
  return (
    <div className="card-base text-center p-8 sm:p-10 flex flex-col items-center justify-center">
      {/* Radar Animation with Navy & Accent Green */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-[#D1FAE5] animate-ping opacity-60" />
        <div className="absolute inset-2 rounded-full bg-[#059669]/15 animate-pulse" />
        <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#0E2150] to-[#1A3470] rounded-full text-white shadow-navy-btn text-2xl">
          📡
        </div>
      </div>

      <span className="eyebrow mb-2">PostGIS Geo-Matching Engine</span>

      <h3 className="font-heading font-black text-2xl text-[#0D1829] mb-2 tracking-tight">
        {status === 'PENDING' && 'Locating Nearby Licensed Artisans...'}
        {status === 'MATCHED' && 'Artisan Found! Awaiting Confirmation...'}
        {status === 'ACCEPTED' && 'Artisan Accepted & En Route!'}
        {status === 'IN_PROGRESS' && 'Service Underway on Site'}
        {status === 'COMPLETED' && 'Job Completed Successfully!'}
      </h3>

      <p className="font-sans text-sm text-[#475569] max-w-md mx-auto mb-6 leading-relaxed">
        Our PostGIS <code className="text-xs bg-[#F1F5F9] text-[#0E2150] px-1.5 py-0.5 rounded font-mono font-bold">ST_DWithin</code> algorithm is querying active verified cooperative members within your zone.
      </p>

      {jobId ? (
        <div className="w-full max-w-sm space-y-3">
          <a
            href={`/job-tracking/${jobId}`}
            className="btn-action w-full py-3 px-6 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Track Live Artisan Progress →
          </a>
          <div className="text-[11px] font-mono text-[#94A3B8] font-bold">
            Dispatched Job ID: {jobId}
          </div>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-heading font-bold text-[#475569]">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
          Request ID: {requestId.slice(0, 12)}...
        </div>
      )}
    </div>
  );
};
