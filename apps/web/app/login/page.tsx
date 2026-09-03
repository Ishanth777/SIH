'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PhoneIcon,
  KeyRoundIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  LoaderIcon,
  BuildingIcon,
  UsersIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  UserCheckIcon,
} from '../../components/icons';
import { Role } from '../../types/platform';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('CUSTOMER');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRoleDestination = (role: Role) => {
    switch (role) {
      case 'CUSTOMER':
        return '/customer';
      case 'WORKER':
        return '/worker';
      case 'SOCIETY_ADMIN':
        return '/society/dashboard';
      case 'FEDERATION_ADMIN':
        return '/federation';
      case 'SUPER_ADMIN':
        return '/admin';
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
      setOtp('123456'); // Pre-fill mock OTP for convenience
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(getRoleDestination(selectedRole));
    }, 600);
  };

  const handleQuickDemo = (role: Role) => {
    setSelectedRole(role);
    setLoading(true);
    setTimeout(() => {
      router.push(getRoleDestination(role));
    }, 300);
  };

  const roles: { role: Role; label: string; icon: React.ComponentType<any>; desc: string }[] = [
    { role: 'CUSTOMER', label: 'Household', icon: UsersIcon, desc: 'Book verified artisans & track dispatches' },
    { role: 'WORKER', label: 'Artisan', icon: BriefcaseIcon, desc: 'Receive nearby jobs & direct wages' },
    { role: 'SOCIETY_ADMIN', label: 'Society', icon: BuildingIcon, desc: 'Manage branch dispatch & AI forecasts' },
    { role: 'FEDERATION_ADMIN', label: 'Federation', icon: ShieldCheckIcon, desc: 'Apex governance & KYC queue' },
    { role: 'SUPER_ADMIN', label: 'Admin', icon: UserCheckIcon, desc: 'Global platform supervision' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0E2150] flex items-center justify-center text-white font-black text-base shadow-sm">
            BG
          </div>
          <span className="font-heading font-black text-2xl tracking-tight text-[#0E2150]">BharatGig</span>
        </Link>
        <h2 className="text-xl font-bold font-heading text-slate-900">
          Cooperative Role & Access Portal
        </h2>
        <p className="text-xs text-slate-500">
          Sign in via DLT SMS OTP or select a role below for direct exploration.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 space-y-6">
          {/* Role Selector Tabs */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
              Select Your Role
            </span>
            <div className="grid grid-cols-3 gap-2">
              {roles.slice(0, 3).map((item) => {
                const Icon = item.icon;
                const isSel = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      isSel
                        ? 'border-[#0E2150] bg-slate-50 text-[#0E2150] font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSel ? 'text-[#0E2150]' : 'text-slate-400'}`} />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {roles.slice(3).map((item) => {
                const Icon = item.icon;
                const isSel = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`p-2.5 rounded-xl border text-center transition flex items-center justify-center gap-2 ${
                      isSel
                        ? 'border-[#0E2150] bg-slate-50 text-[#0E2150] font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSel ? 'text-[#0E2150]' : 'text-slate-400'}`} />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* OTP Authentication Form */}
          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E2150] font-semibold text-slate-900"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-[#0E2150] hover:bg-[#1A3470] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
              >
                {loading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <span>Send Verification OTP</span>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="text-[11px] text-[#059669] font-bold hover:underline"
                  >
                    Change Phone
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2 text-center text-base tracking-widest font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E2150] text-slate-900"
                />
              </div>

              {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
              >
                {loading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <span>Verify OTP & Enter Portal</span>}
              </button>
            </form>
          )}

          {/* Quick Demo Shortcuts */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center">
              Direct Role Entry
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('CUSTOMER')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs font-semibold text-slate-700 transition"
              >
                Customer Hub →
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('WORKER')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs font-semibold text-slate-700 transition"
              >
                Worker Desk →
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('SOCIETY_ADMIN')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs font-semibold text-slate-700 transition"
              >
                Society Admin →
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('FEDERATION_ADMIN')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs font-semibold text-slate-700 transition"
              >
                Federation Apex →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
