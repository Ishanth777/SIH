'use client';

import React, { useState } from 'react';
import {
  UserCheckIcon,
  CheckIcon,
  XIcon,
  FileTextIcon,
  ArrowLeftIcon,
} from '@/components/icons';

interface PendingWorker {
  id: string;
  name: string;
  phone: string;
  society: string;
  category: string;
  appliedDate: string;
  kycDocumentCount: number;
}

export default function WorkerVerificationQueuePage() {
  const [queue, setQueue] = useState<PendingWorker[]>([
    {
      id: 'w-101',
      name: 'Ramesh Kumar',
      phone: '+91 98451 12345',
      society: 'Bangalore South Labour Cooperative',
      category: 'ELECTRICIAN',
      appliedDate: '2026-09-02',
      kycDocumentCount: 2,
    },
    {
      id: 'w-102',
      name: 'Sunita Devi',
      phone: '+91 97412 67890',
      society: 'Mysore Rural Electrical & Plumbing Society',
      category: 'CAREGIVER',
      appliedDate: '2026-09-03',
      kycDocumentCount: 3,
    },
    {
      id: 'w-103',
      name: 'Anand Gowda',
      phone: '+91 96118 43210',
      society: 'Hubli-Dharwad Skilled Guild',
      category: 'PLUMBER',
      appliedDate: '2026-09-03',
      kycDocumentCount: 2,
    },
  ]);

  const [message, setMessage] = useState<string | null>(null);

  const handleAction = (id: string, action: 'VERIFIED' | 'REJECTED') => {
    setQueue((prev) => prev.filter((w) => w.id !== id));
    setMessage(`Worker ${id} has been ${action === 'VERIFIED' ? 'approved' : 'rejected'}.`);
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/federation"
            className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Back to Federation Dashboard
          </a>
          <span className="text-xs px-3 py-1 bg-blue-900/60 text-blue-300 border border-blue-700/50 rounded-full font-semibold">
            {queue.length} Pending Verifications
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">Worker Verification Queue</h1>
          <p className="text-slate-400 text-sm mt-1">
            Review KYC credentials, Aadhaar consent, and certifications before activating worker accounts.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-emerald-900/40 border border-emerald-500/50 rounded-xl text-emerald-200 text-sm">
            {message}
          </div>
        )}

        {queue.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <UserCheckIcon className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold">Verification queue is clear!</h3>
            <p className="text-slate-400 text-sm mt-1">All registered workers have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((worker) => (
              <div
                key={worker.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{worker.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {worker.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Phone: {worker.phone}</span>
                    <span>Society: {worker.society}</span>
                    <span>Applied: {worker.appliedDate}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-400">
                    <FileTextIcon className="w-3.5 h-3.5" />
                    <span>{worker.kycDocumentCount} KYC document(s) in object storage (Rule A6)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(worker.id, 'VERIFIED')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold text-white flex items-center gap-1.5 transition shadow"
                  >
                    <CheckIcon className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(worker.id, 'REJECTED')}
                    className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-sm font-semibold text-white flex items-center gap-1.5 transition"
                  >
                    <XIcon className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
