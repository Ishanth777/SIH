'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatchingStatus } from '@/hooks/useMatchingStatus';
import { MatchingStatusIndicator } from '@/components/booking/MatchingStatusIndicator';
import { ArrowLeftIcon } from '@/components/icons';

export default function RequestMatchingPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const { request, loading, error } = useMatchingStatus(requestId);

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-64px)] py-12 md:py-16 px-6">
      <div className="max-w-[720px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/booking')}
            className="text-xs font-heading font-bold text-[#475569] hover:text-[#0D1829] flex items-center gap-1.5 transition"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Booking Form
          </button>
          <span className="badge-pill bg-[#D1FAE5] text-[#047857]">
            Live Dispatch Room
          </span>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-[12px] text-sm font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="h-72 card-base animate-pulse bg-white flex items-center justify-center text-sm text-[#94A3B8]">
            Loading dispatch status...
          </div>
        ) : (
          <div className="space-y-6">
            <MatchingStatusIndicator
              status={request?.job?.status || 'PENDING'}
              requestId={requestId}
              jobId={request?.job?.id}
            />

            {request && (
              <div className="card-base space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <h4 className="font-heading font-extrabold text-sm text-[#0D1829] uppercase tracking-wider">
                    Booking Summary
                  </h4>
                  <span className="label-style">Verified Rate</span>
                </div>

                <div className="text-sm font-sans text-[#475569] flex justify-between">
                  <span>Trade Service:</span>
                  <span className="font-heading font-bold text-[#0D1829]">
                    {request.serviceCatalog?.name || 'Trade Service'}
                  </span>
                </div>

                <div className="text-sm font-sans text-[#475569] flex justify-between">
                  <span>Dispatch Type:</span>
                  <span className="badge-pill bg-[#F1F5F9] text-[#0D1829]">
                    {request.type}
                  </span>
                </div>

                <div className="text-sm font-sans text-[#475569] flex justify-between">
                  <span>Destination:</span>
                  <span className="font-medium text-[#0D1829] text-right truncate max-w-xs">
                    {request.address}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
