'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatchingStatus } from '@/hooks/useMatchingStatus';
import { MatchingStatusIndicator } from '@/components/booking/MatchingStatusIndicator';

export default function RequestMatchingPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const { request, loading, error } = useMatchingStatus(requestId);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => router.push('/booking')}
          className="text-sm font-medium text-blue-600 hover:underline mb-2 inline-block"
        >
          ← Back to Booking
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Live Matching Status</h1>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      ) : (
        <div className="space-y-6">
          <MatchingStatusIndicator
            status={request?.job?.status || 'PENDING'}
            requestId={requestId}
          />

          {request && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <h4 className="font-semibold text-slate-800">Booking Summary</h4>
              <div className="text-sm text-slate-600 flex justify-between">
                <span>Service:</span>
                <span className="font-medium text-slate-800">{request.serviceCatalog?.name || 'Service'}</span>
              </div>
              <div className="text-sm text-slate-600 flex justify-between">
                <span>Type:</span>
                <span className="font-medium text-slate-800">{request.type}</span>
              </div>
              <div className="text-sm text-slate-600 flex justify-between">
                <span>Address:</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-xs">{request.address}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
