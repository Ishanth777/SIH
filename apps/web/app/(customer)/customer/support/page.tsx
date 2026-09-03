'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { ShieldCheckIcon, PhoneIcon, CheckCircleIcon } from '../../../../components/icons';

export default function CustomerSupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('JOB-9841');
  const [reason, setReason] = useState('Service Quality / Billing Query');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <DashboardLayout
      role="CUSTOMER"
      title="Help Desk & Cooperative Ombudsman"
      subtitle="Transparent grievance resolution backed by registered cooperative bylaws."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#0E2150]">File an Inquiry or Grievance</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your claim will be reviewed directly by the designated Ombudsman at the local Cooperative Society.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircleIcon className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-heading font-bold text-base text-emerald-900">Grievance Ticket Created</h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Ticket <strong>#TKT-8902</strong> has been logged with Bangalore South Labour Cooperative Society. You will receive an SMS update within 2 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-900 underline"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">
                  Related Booking ID
                </label>
                <select
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#0E2150] text-slate-800"
                >
                  <option value="JOB-9841">JOB-9841 - Electrician (In Progress)</option>
                  <option value="JOB-9830">JOB-9830 - Plumber (Completed)</option>
                  <option value="GENERAL">General Platform Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">
                  Issue Category
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#0E2150] text-slate-800"
                >
                  <option>Service Quality / Billing Query</option>
                  <option>Artisan Arrival Delay</option>
                  <option>Scope of Work Discrepancy</option>
                  <option>UPI Payment Settlement Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">
                  Description of Issue
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please describe the issue in detail..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#0E2150] text-slate-800"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#0E2150] hover:bg-[#1A3470] text-white text-xs font-bold shadow-xs transition"
                >
                  Submit Grievance to Ombudsman
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h4 className="font-heading font-bold text-sm text-[#0E2150]">Cooperative Helpline</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <p><strong>Bangalore District Toll-Free:</strong> 1800-425-9876</p>
              <p><strong>Operating Hours:</strong> 8:00 AM – 8:00 PM (Daily)</p>
              <p><strong>Ombudsman Office:</strong> 3rd Floor, Cooperative Bhawan, Bangalore</p>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 space-y-2 text-xs text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-700" />
              <span>Cooperative Guarantee</span>
            </div>
            <p className="leading-relaxed">
              Every verified booking is covered by the Cooperative Dispute Resolution Charter. In case of unsatisfactory work, re-service or full reimbursement is guaranteed by the Society reserve fund.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
