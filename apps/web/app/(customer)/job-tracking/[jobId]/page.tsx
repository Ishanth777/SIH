'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  StarIcon,
  ArrowLeftIcon,
  AlertCircleIcon,
} from '@/components/icons';

export default function JobTrackingPage({ params }: { params: { jobId: string } }) {
  const { socket, isConnected } = useSocket('customer-token');
  const [jobStatus, setJobStatus] = useState<string>('PENDING');
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    async function loadJob() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_URL}/jobs/${params.jobId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setJobDetails(data);
          if (data.status) setJobStatus(data.status);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [API_URL, params.jobId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('job:join_room', { jobId: params.jobId });

    socket.on('job:status', (data) => {
      if (data.jobId === params.jobId) {
        setJobStatus(data.status);
      }
    });

    return () => {
      socket.emit('job:leave_room', { jobId: params.jobId });
      socket.off('job:status');
    };
  }, [socket, params.jobId]);

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="card-base w-full max-w-xl p-8 sm:p-10 shadow-lg">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-5 border-b border-[#E2E8F0] mb-6">
          <a
            href="/booking"
            className="text-xs font-heading font-bold text-[#475569] hover:text-[#0D1829] flex items-center gap-1.5 transition"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Services
          </a>

          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-[#059669] animate-pulse' : 'bg-[#F59E0B]'
              }`}
            />
            <span className="text-xs font-heading font-bold text-[#475569]">
              {isConnected ? 'Live Socket Feed' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="eyebrow block mb-1">Real-Time Artisan Tracking</span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#0D1829] tracking-tight">
            Job #{params.jobId.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1 font-semibold">{params.jobId}</p>
        </div>

        {/* Current Status Box */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-[14px] text-center mb-8">
          <span className="label-style block mb-2">Service Lifecycle Status</span>
          <div
            className={`font-heading font-black text-3xl tracking-tight ${
              jobStatus === 'COMPLETED'
                ? 'text-[#059669]'
                : jobStatus === 'IN_PROGRESS'
                ? 'text-[#F59E0B]'
                : jobStatus === 'ACCEPTED'
                ? 'text-[#0E2150]'
                : 'text-[#475569]'
            }`}
          >
            {jobStatus.replace('_', ' ')}
          </div>
          <p className="font-sans text-xs text-[#475569] mt-2 max-w-sm mx-auto">
            {jobStatus === 'PENDING' && 'Evaluating closest verified cooperative workers in your radius tier.'}
            {jobStatus === 'ACCEPTED' && 'Licensed worker confirmed dispatch and is arriving on site.'}
            {jobStatus === 'IN_PROGRESS' && 'Service actively underway at your specified location.'}
            {jobStatus === 'COMPLETED' && 'Job successfully signed off by worker!'}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {jobStatus === 'COMPLETED' ? (
            <>
              <a
                href={`/payment/${params.jobId}`}
                className="btn-action w-full py-3.5 px-6 font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <CreditCardIcon className="w-4 h-4" /> View Invoice & Pay with Razorpay
              </a>
              <div className="flex gap-3">
                <a
                  href={`/feedback/${params.jobId}`}
                  className="btn-outline flex-1 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <StarIcon className="w-3.5 h-3.5 text-[#F59E0B]" /> Rate Service
                </a>
                <a
                  href="/society/disputes"
                  className="btn-outline flex-1 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <AlertCircleIcon className="w-3.5 h-3.5" /> Raise Dispute
                </a>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-[#475569] font-medium py-1">
                <ClockIcon className="w-4 h-4 animate-spin text-[#059669]" />
                <span>Socket.IO is relaying live dispatch coordinates...</span>
              </div>
              <a
                href={`/payment/${params.jobId}`}
                className="btn-outline w-full py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-1 text-[#475569]"
              >
                Inspect Pre-generated Invoice Summary →
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1.5 font-bold">
            <ShieldCheckIcon className="w-4 h-4 text-[#059669]" /> Multi-Tenant RLS Safe
          </span>
          <span className="font-heading font-extrabold text-[10px] uppercase text-[#059669]">
            Cooperative Backed
          </span>
        </div>
      </div>
    </div>
  );
}
