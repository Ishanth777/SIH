'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  cooperativeName: string;
  cooperativeRegistrationNumber: string;
  federationName: string;
  customerName: string;
  customerPhone: string;
  serviceAddress: string;
  workerName: string;
  workerSkills: string[];
  serviceCategory: string;
  serviceName: string;
  jobId: string;
  gatewayPaymentId: string;
  breakdown: {
    grossAmount: number;
    workerNetPayout: number;
    cooperativeCommission: number;
    welfareContribution: number;
  };
}

const DEMO_INVOICES: Record<string, InvoiceData> = {
  'demo-job-101': {
    invoiceNumber: 'INV-2026-DEMO-JOB',
    invoiceDate: '2026-09-02T00:00:00.000Z',
    cooperativeName: 'Greater Mumbai Labour Cooperative Society',
    cooperativeRegistrationNumber: 'MAH-BOM-COOP-2026-089',
    federationName: 'Maharashtra State Labour Cooperative Federation Ltd.',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    serviceAddress: 'Flat 402, Sea Breeze Apts, Bandra West, Mumbai 400050',
    workerName: 'Rajesh V. Sharma',
    workerSkills: ['ELECTRICIAN'],
    serviceCategory: 'ELECTRICIAN',
    serviceName: 'Electrical Wiring & Diagnostic Service',
    jobId: 'demo-job-101',
    gatewayPaymentId: 'pay_mock_' + Date.now().toString(36),
    breakdown: {
      grossAmount: 750,
      workerNetPayout: 637.5,
      cooperativeCommission: 75,
      welfareContribution: 37.5,
    },
  },
};

function getDefaultInvoice(jobId: string): InvoiceData {
  const gross = 750;
  return {
    invoiceNumber: 'INV-2026-' + jobId.slice(0, 8).toUpperCase(),
    invoiceDate: new Date().toISOString(),
    cooperativeName: 'Greater Mumbai Labour Cooperative Society',
    cooperativeRegistrationNumber: 'MAH-BOM-COOP-2026-089',
    federationName: 'Maharashtra State Labour Cooperative Federation Ltd.',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    serviceAddress: 'Flat 402, Sea Breeze Apts, Bandra West, Mumbai 400050',
    workerName: 'Rajesh V. Sharma',
    workerSkills: ['ELECTRICIAN'],
    serviceCategory: 'ELECTRICIAN',
    serviceName: 'Electrical Wiring & Diagnostic Service',
    jobId,
    gatewayPaymentId: 'pay_mock_' + Date.now().toString(36),
    breakdown: {
      grossAmount: gross,
      workerNetPayout: Math.round(gross * 0.85 * 100) / 100,
      cooperativeCommission: Math.round(gross * 0.10 * 100) / 100,
      welfareContribution: Math.round(gross * 0.05 * 100) / 100,
    },
  };
}

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = Array.isArray(params?.jobId) ? params.jobId[0] : ((params?.jobId as string) || 'demo-job-101');
  const invoice = DEMO_INVOICES[jobId] ?? getDefaultInvoice(jobId);

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '2 September 2026';
    }
  };

  return (
    <div className="min-h-screen bg-[#060b19] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Toolbar */}
        <div className="flex justify-between items-center print:hidden">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-white text-sm font-semibold flex items-center gap-2 transition"
          >
            <span>&larr;</span> Return to Home
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
            </svg>
            <span>Print / Save PDF</span>
          </button>
        </div>

        {/* Paper Invoice Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:rounded-none">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-8 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
                MINISTRY OF COOPERATION ECOSYSTEM
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {invoice.cooperativeName}
              </h1>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Affiliated with {invoice.federationName}
              </p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Reg No: {invoice.cooperativeRegistrationNumber}
              </p>
            </div>
            <div className="sm:text-right flex-shrink-0">
              <div className="inline-block border border-emerald-600 bg-emerald-50 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                ✓ PAYMENT RECEIVED &amp; SETTLED
              </div>
              <div className="text-xs text-slate-600 font-mono">
                Invoice No: <span className="font-bold text-slate-900">{invoice.invoiceNumber}</span>
              </div>
              <div className="text-xs text-slate-600 font-mono mt-0.5">
                Date: {fmtDate(invoice.invoiceDate)}
              </div>
            </div>
          </div>

          {/* Customer & Worker Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-slate-200">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                BILLED TO (CUSTOMER)
              </h3>
              <p className="font-extrabold text-slate-900 text-base">{invoice.customerName}</p>
              <p className="text-sm text-slate-600 mt-0.5">{invoice.customerPhone}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{invoice.serviceAddress}</p>
            </div>
            <div className="sm:text-right">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                SERVICE PROVIDER (WORKER)
              </h3>
              <p className="font-extrabold text-slate-900 text-base">{invoice.workerName}</p>
              <p className="text-sm text-emerald-700 font-bold">
                {invoice.serviceCategory} &bull; Verified Member
              </p>
              <p className="text-xs text-slate-500 mt-1 font-mono">Job Ref: {invoice.jobId}</p>
            </div>
          </div>

          {/* Service Line Items */}
          <div className="py-8 border-b border-slate-200">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">SERVICE DESCRIPTION</th>
                  <th className="pb-3 text-center">CATEGORY</th>
                  <th className="pb-3 text-right">AMOUNT (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td className="py-4 font-bold text-slate-900">
                    {invoice.serviceName}
                    <div className="text-xs font-normal text-slate-500 mt-0.5">
                      Includes skilled labour, safety equipment, and standard diagnostics
                    </div>
                  </td>
                  <td className="py-4 text-center font-mono text-xs font-semibold text-slate-600">
                    {invoice.serviceCategory}
                  </td>
                  <td className="py-4 text-right font-black text-slate-900 font-mono text-base">
                    ₹{invoice.breakdown.grossAmount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Settlement Breakdown & Notice */}
          <div className="pt-6 pb-4 flex flex-col sm:flex-row justify-between items-start gap-8">
            <div className="space-y-2 text-xs text-slate-500 max-w-sm">
              <p className="font-bold text-slate-700 uppercase tracking-wider">
                COOPERATIVE TRANSPARENCY NOTICE:
              </p>
              <p className="leading-relaxed">
                Under the National Cooperative Framework, ₹{invoice.breakdown.workerNetPayout.toFixed(2)} is credited
                directly to the worker. ₹{invoice.breakdown.welfareContribution.toFixed(2)} is transferred to the
                Labour Welfare &amp; Accident Insurance Fund.
              </p>
            </div>
            <div className="w-full sm:w-72 space-y-2.5 text-sm pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Worker Direct Share (85%)</span>
                <span className="font-bold font-mono">₹{invoice.breakdown.workerNetPayout.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Society Operational Fee (10%)</span>
                <span className="font-bold font-mono">₹{invoice.breakdown.cooperativeCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Labour Welfare Reserve (5%)</span>
                <span className="font-bold font-mono">₹{invoice.breakdown.welfareContribution.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-900 pt-2 flex justify-between font-black text-base text-slate-900">
                <span>Total Paid</span>
                <span className="font-mono">₹{invoice.breakdown.grossAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
