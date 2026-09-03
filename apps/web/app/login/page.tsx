'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheckIcon, PhoneIcon, KeyRoundIcon, ArrowRightIcon, LoaderIcon } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setStep('OTP');
      setInfoMessage(`Verification code sent to ${phone}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid or expired OTP');
      }

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      // Route based on role or default to booking/admin
      router.push('/booking');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl text-slate-100">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
            <ShieldCheckIcon className="w-7 h-7" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Cooperative Labour Marketplace</h1>
        <p className="text-slate-400 text-sm text-center mb-6">
          {step === 'PHONE'
            ? 'Sign in with your phone number to access your portal'
            : 'Enter the 6-digit OTP sent to your phone'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {infoMessage && !error && (
          <div className="mb-4 p-3 bg-blue-900/40 border border-blue-500/50 rounded-lg text-blue-200 text-sm">
            {infoMessage}
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <PhoneIcon className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !phone}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition"
            >
              {loading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRightIcon className="w-4 h-4" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Verification Code
              </label>
              <div className="relative">
                <KeyRoundIcon className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white text-center tracking-widest text-lg font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition"
            >
              {loading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={() => setStep('PHONE')}
              className="w-full py-2 text-xs text-slate-400 hover:text-white transition"
            >
              Change phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
