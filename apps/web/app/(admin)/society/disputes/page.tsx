'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { DataTable, Column } from '../../../../components/common/DataTable';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { DISPUTES_DATA, DisputeRecord } from '../../../../data/mock-data';
import { ShieldAlertIcon, CheckCircleIcon, XIcon } from '../../../../components/icons';

export default function SocietyDisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord | null>(null);
  const [resolutionAction, setResolutionAction] = useState('REFUND_CUSTOMER');
  const [notes, setNotes] = useState('');
  const [isResolved, setIsResolved] = useState(false);

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResolved(true);
    setTimeout(() => {
      setSelectedDispute(null);
      setIsResolved(false);
    }, 1200);
  };

  const columns: Column<DisputeRecord>[] = [
    {
      header: 'Dispute ID',
      accessor: (row) => <span className="font-mono font-bold text-xs text-[#0E2150]">{row.id}</span>,
    },
    {
      header: 'Job & Service',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.serviceName}</p>
          <p className="text-[10px] text-slate-500">Ref: {row.jobId}</p>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: (row) => <span className="font-medium text-slate-900">{row.customerName}</span>,
    },
    {
      header: 'Artisan',
      accessor: (row) => <span className="font-medium text-slate-900">{row.workerName}</span>,
    },
    {
      header: 'Amount in Dispute',
      accessor: (row) => <span className="font-bold text-slate-900">₹{row.amountInDispute}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Mediation',
      accessor: (row) => (
        <button
          onClick={() => setSelectedDispute(row)}
          className="px-3 py-1 rounded bg-[#0E2150] text-white text-[11px] font-bold hover:bg-[#1A3470]"
        >
          Arbitrate Claim
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout
      role="SOCIETY_ADMIN"
      userName="Bangalore South Operations"
      title="Dispute Resolution & Ombudsman Desk"
      subtitle="Arbitrate consumer-artisan claims in accordance with cooperative bylaws."
    >
      <DataTable
        title="Active Grievances & Arbitration Queue"
        columns={columns}
        data={DISPUTES_DATA}
        searchPlaceholder="Search dispute ID, customer, artisan..."
      />

      {/* Arbitration Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400">{selectedDispute.id}</span>
                <h3 className="font-heading font-bold text-lg text-[#0E2150]">
                  Arbitrate Service Claim
                </h3>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><strong>Customer:</strong> {selectedDispute.customerName}</p>
              <p><strong>Artisan:</strong> {selectedDispute.workerName}</p>
              <p><strong>Service Item:</strong> {selectedDispute.serviceName}</p>
              <p><strong>Claim Reason:</strong> {selectedDispute.reason}</p>
              <p><strong>Amount Contested:</strong> ₹{selectedDispute.amountInDispute}</p>
            </div>

            {isResolved ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-center text-xs flex items-center justify-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                <span>Mediation Decision Recorded in Society Ledger</span>
              </div>
            ) : (
              <form onSubmit={handleResolve} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-heading">
                    Ombudsman Arbitration Decision
                  </label>
                  <select
                    value={resolutionAction}
                    onChange={(e) => setResolutionAction(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="REFUND_CUSTOMER">Full Refund to Customer from Society Reserve</option>
                    <option value="RE_SERVICE">Issue Free Guild Re-Service Order</option>
                    <option value="DISMISS">Dismiss Claim (Verified by GPS & Task Checklist)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-heading">
                    Arbitration Findings & Rationale
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter official arbitration findings..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDispute(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#0E2150] hover:bg-[#1A3470] text-white font-bold"
                  >
                    Record Decision
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
