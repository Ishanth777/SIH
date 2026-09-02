'use client';

import React from 'react';
import { JobStatus } from '../../types/matching.types';

interface MatchingStatusIndicatorProps {
  status?: JobStatus;
  requestId: string;
}

export const MatchingStatusIndicator: React.FC<MatchingStatusIndicatorProps> = ({
  status = 'PENDING',
  requestId,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-blue-500/30 animate-pulse" />
        <div className="relative flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full text-white shadow-lg text-2xl">
          📡
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1">
        {status === 'PENDING' && 'Searching for Nearest Verified Workers...'}
        {status === 'MATCHED' && 'Worker Found! Waiting for Acceptance...'}
        {status === 'ACCEPTED' && 'Worker Accepted and On the Way!'}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm">
        PostGIS engine is querying verified active cooperative workers in your area.
      </p>

      <div className="mt-6 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600">
        Request ID: {requestId}
      </div>
    </div>
  );
};
