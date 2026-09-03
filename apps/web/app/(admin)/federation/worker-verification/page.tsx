'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { DataTable, Column } from '../../../../components/common/DataTable';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { WORKERS_DATA, WorkerProfile } from '../../../../data/mock-data';
import { ShieldCheckIcon, CheckCircleIcon, XIcon, FileTextIcon } from '../../../../components/icons';

export default function FederationWorkerVerificationPage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>(WORKERS_DATA);
  const [activeWorker, setActiveWorker] = useState<WorkerProfile | null>(null);

  const handleApprove = (id: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, verificationStatus: 'VERIFIED' } : w))
    );
    setActiveWorker(null);
  };

  const handleReject = (id: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, verificationStatus: 'REJECTED' } : w))
    );
    setActiveWorker(null);
  };

  const columns: Column<WorkerProfile>[] = [
    {
      header: 'Artisan Candidate',
      accessor: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#0E2150] text-white flex items-center justify-center text-[10px] font-bold">
            {row.fullName.substring(0, 2)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{row.fullName}</p>
            <p className="text-[10px] text-slate-500">{row.phone}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Society & District',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.cooperativeName}</p>
          <span className="text-[10px] text-slate-500">Karnataka Apex Federation</span>
        </div>
      ),
    },
    {
      header: 'Trade Skill',
      accessor: (row) => <span className="font-semibold text-slate-900">{row.category}</span>,
    },
    {
      header: 'KYC Documents (S3/MinIO)',
      accessor: () => (
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
          <FileTextIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>Aadhaar + Skill Certificate</span>
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.verificationStatus} />,
    },
    {
      header: 'Action',
      accessor: (row) => (
        <button
          onClick={() => setActiveWorker(row)}
          className="px-3 py-1 rounded bg-[#0E2150] text-white text-[11px] font-bold hover:bg-[#1A3470]"
        >
          Inspect Credentials
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout
      role="FEDERATION_ADMIN"
      userName="Karnataka Apex Federation"
      title="Worker KYC Verification & Licensing Queue"
      subtitle="Audit Aadhaar consent records and issue official cooperative guild trade licenses."
    >
      <DataTable
        title="Pending Candidate Credentials"
        subtitle="Rule A6: KYC documents stored in MinIO/S3 object storage only."
        columns={columns}
        data={workers}
        searchPlaceholder="Search candidate name, trade, society..."
      />

      {/* Verification Modal */}
      {activeWorker && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">KYC Audit</span>
                <h3 className="font-heading font-bold text-lg text-[#0E2150]">{activeWorker.fullName}</h3>
              </div>
              <button
                onClick={() => setActiveWorker(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><strong>Affiliated Society:</strong> {activeWorker.cooperativeName}</p>
              <p><strong>Trade Category:</strong> {activeWorker.category}</p>
              <p><strong>Phone:</strong> {activeWorker.phone}</p>
              <p><strong>Aadhaar Consent ID:</strong> DPDPA-CONSENT-{activeWorker.id.toUpperCase()}-2026</p>
              <p><strong>Object Storage Path:</strong> minio://coop-documents/kyc/{activeWorker.id}/aadhaar_masked.pdf</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleReject(activeWorker.id)}
                className="px-4 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100"
              >
                Reject Application
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveWorker(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleApprove(activeWorker.id)}
                  className="px-5 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs"
                >
                  Approve & Issue Guild License
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
