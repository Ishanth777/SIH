'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

const DEMO_JOBS: Record<string, any> = {
  'demo-job-101': {
    jobId: 'demo-job-101',
    orderId: 'order_demo-job',
    amount: 750,
    cooperative: 'Greater Mumbai Labour Cooperative Society',
    regNo: 'MAH-BOM-COOP-2026-089',
    worker: {
      name: 'Rajesh V. Sharma',
      initials: 'R',
      role: 'Professional Home Electrical Maintenance (ELECTRICIAN)',
      rating: 4.9,
      phone: '+91 98765 43210',
      verified: true,
    },
    service: 'Electrical Wiring & Diagnostic Service',
  },
};

function getDefaultJob(jobId: string) {
  return {
    jobId,
    orderId: 'order_' + jobId.slice(0, 12),
    amount: 750,
    cooperative: 'Greater Mumbai Labour Cooperative Society',
    regNo: 'MAH-BOM-COOP-2026-089',
    worker: {
      name: 'Rajesh V. Sharma',
      initials: 'R',
      role: 'Professional Home Electrical Maintenance (ELECTRICIAN)',
      rating: 4.9,
      phone: '+91 98765 43210',
      verified: true,
    },
    service: 'Electrical Wiring & Diagnostic Service',
  };
}

function calcBd(g: number) {
  const s = Math.round(g * 0.10 * 100) / 100;
  const w = Math.round(g * 0.05 * 100) / 100;
  const wk = Math.round((g - s - w) * 100) / 100;
  return { gross: g, worker: wk, society: s, welfare: w };
}

function fmtTime(s: number) {
  const mins = String(Math.floor(s / 60)).padStart(2, '0');
  const secs = String(s % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function RailTab({
  label,
  sub,
  icon,
  active,
  onClick,
}: {
  label: string;
  sub: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl border text-sm font-semibold transition-all ${
        active
          ? 'bg-[#0e2124] border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
          : 'bg-[#090f1f]/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-bold text-xs sm:text-sm">{label}</span>
      <span className="text-[10px] font-normal text-slate-400">{sub}</span>
    </button>
  );
}

export default function PaymentCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = Array.isArray(params?.jobId) ? params.jobId[0] : ((params?.jobId as string) || 'demo-job-101');
  const job = DEMO_JOBS[jobId] ?? getDefaultJob(jobId);
  const bd = calcBd(job.amount);

  const [rail, setRail] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiMode, setUpiMode] = useState<'qr' | 'id'>('qr');
  const [upiId, setUpiId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('sbi');
  const [qrTimer, setQrTimer] = useState(4 * 60 + 40);
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (rail !== 'upi' || upiMode !== 'qr') return;
    const t = setInterval(() => setQrTimer(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [rail, upiMode]);

  const handlePay = useCallback(async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setPaid(true);
    await new Promise(r => setTimeout(r, 600));
    router.push(`/payment/invoice/${jobId}`);
  }, [jobId, router]);

  if (paid) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 bg-[#060b19]">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
          <span className="text-4xl text-emerald-400">✓</span>
        </div>
        <div className="text-center space-y-1">
          <p className="text-emerald-400 font-bold text-2xl">Payment Confirmed &amp; Escrow Locked!</p>
          <p className="text-slate-400 text-sm">Generating your official tax invoice &amp; settlement receipt&hellip;</p>
        </div>
      </div>
    );
  }

  const upiQrData = `upi://pay?pa=coop.society@okaxis&pn=BharatGig&am=${job.amount}&cu=INR`;
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiQrData
  )}&bgcolor=ffffff&color=0f172a&margin=8`;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block mb-3">
              SELECT PAYMENT RAIL
            </span>

            {/* Payment Rail Tabs */}
            <div className="flex gap-3 mb-5">
              <RailTab
                label="UPI / QR Code"
                sub="GPay, PhonePe, Paytm"
                icon="📱"
                active={rail === 'upi'}
                onClick={() => setRail('upi')}
              />
              <RailTab
                label="Cards"
                sub="RuPay, Visa, Master"
                icon="💳"
                active={rail === 'card'}
                onClick={() => setRail('card')}
              />
              <RailTab
                label="NetBanking"
                sub="All Indian Banks"
                icon="🏛️"
                active={rail === 'netbanking'}
                onClick={() => setRail('netbanking')}
              />
            </div>

            {/* UPI Container */}
            {rail === 'upi' && (
              <div className="bg-[#090f1f]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex rounded-xl overflow-hidden border border-slate-800 bg-[#060b19] p-1">
                  <button
                    type="button"
                    onClick={() => setUpiMode('qr')}
                    className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
                      upiMode === 'qr'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>📷</span> Scan UPI QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiMode('id')}
                    className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
                      upiMode === 'id'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>👉</span> Enter UPI ID / VPA
                  </button>
                </div>

                {upiMode === 'qr' ? (
                  <div className="space-y-4 text-center">
                    <div className="flex justify-center pt-2">
                      <div className="bg-white rounded-2xl p-4 shadow-2xl border-2 border-slate-200 inline-block">
                        <img
                          src={upiQrUrl}
                          alt="UPI QR Code"
                          width={190}
                          height={190}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold text-white">
                        Scan with GPay, PhonePe, Paytm, or BHIM
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        VPA: <span className="text-slate-200 font-bold">coop.society@okaxis</span> &bull; Amount: <span className="text-slate-200 font-bold">₹{job.amount.toFixed(2)}</span>
                      </p>
                      <div className="inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-800 rounded-full px-3 py-1 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        <span className="text-emerald-400 text-xs font-mono font-bold">
                          QR Valid for: {fmtTime(qrTimer)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-2 flex-wrap pt-1">
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map(app => (
                        <span
                          key={app}
                          className="px-3 py-1 rounded-lg bg-[#11192e] border border-slate-700/70 text-xs text-slate-300 font-medium"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-3">
                    <label className="block text-xs font-semibold text-slate-300">
                      Virtual Payment Address (VPA) / UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. mobile@upi or username@okicici"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-xs text-slate-500">
                      A payment request notification will be sent to your UPI app.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cards Container */}
            {rail === 'card' && (
              <div className="bg-[#090f1f]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name on Card"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8901"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="08/28"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      CVV Code
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NetBanking Container */}
            {rail === 'netbanking' && (
              <div className="bg-[#090f1f]/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Your Bank
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'sbi', name: 'State Bank of India' },
                    { id: 'hdfc', name: 'HDFC Bank' },
                    { id: 'icici', name: 'ICICI Bank' },
                    { id: 'axis', name: 'Axis Bank' },
                    { id: 'kotak', name: 'Kotak Mahindra Bank' },
                    { id: 'pnb', name: 'Punjab National Bank' },
                  ].map(bank => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                        selectedBank === bank.id
                          ? 'bg-emerald-950 border-emerald-500 text-white'
                          : 'bg-[#060b19] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {bank.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN — Transparent Fee Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-slate-800 pb-4">
              Transparent Fee Breakdown
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <div className="flex items-center gap-2">
                  <span>🧑‍🔧</span>
                  <span>Worker Direct Payout (85%)</span>
                </div>
                <span className="font-bold font-mono text-white">₹{bd.worker.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <div className="flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Society Operational Fee (10%)</span>
                </div>
                <span className="font-bold font-mono text-white">₹{bd.society.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-400 font-semibold">
                <div className="flex items-center gap-2">
                  <span>🏥</span>
                  <span>Worker Insurance &amp; Welfare (5%)</span>
                </div>
                <span className="font-bold font-mono text-emerald-400">+ ₹{bd.welfare.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400 text-xs pt-1">
                <span>GST / Taxes (Co-op Rate)</span>
                <span className="font-mono">₹0.00</span>
              </div>
            </div>

            <div className="border-t border-emerald-500/30 pt-4 flex justify-between items-center">
              <span className="text-base font-extrabold text-white">Total Amount</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                ₹{bd.gross.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              disabled={processing}
              onClick={handlePay}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {processing ? (
                <span>Processing Settlement&hellip;</span>
              ) : (
                <>
                  <span>
                    {rail === 'upi' && upiMode === 'qr'
                      ? 'I Have Scanned & Paid'
                      : `Pay ₹${bd.gross.toFixed(2)} via ${
                          rail === 'card'
                            ? 'Card'
                            : rail === 'netbanking'
                            ? 'NetBanking'
                            : 'UPI'
                        }`}
                  </span>
                  <span className="text-xl">&rarr;</span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400 font-medium">
              Secured by 256-bit SSL &amp; NPCI UPI Standards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
