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
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [regRole, setRegRole] = useState<'WORKER' | 'CUSTOMER' | 'SOCIETY'>('WORKER');
  
  // Login States
  const [selectedRole, setSelectedRole] = useState<Role>('CUSTOMER');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Registration States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTrade, setRegTrade] = useState('Electrician');
  const [regSociety, setRegSociety] = useState('Bangalore South Labour Cooperative #402');
  const [regNsqf, setRegNsqf] = useState('NSQF Level 5 (Master Certified)');
  const [regAddress, setRegAddress] = useState('');
  const [regDpdpaConsent, setRegDpdpaConsent] = useState(true);
  const [regSuccess, setRegSuccess] = useState(false);

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

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || regPhone.length < 10) {
      setError('Please enter full name and valid 10-digit phone number');
      return;
    }
    if (!regDpdpaConsent) {
      setError('DPDPA 2023 statutory consent is required for cooperative registration');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setRegSuccess(true);
      setTimeout(() => {
        if (regRole === 'WORKER') router.push('/worker');
        else if (regRole === 'CUSTOMER') router.push('/customer');
        else router.push('/society/dashboard');
      }, 1200);
    }, 800);
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
          Sign in via DLT SMS OTP or register a new verified cooperative member.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 space-y-6">
          {/* Main Mode Toggle: Sign In vs Register */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('LOGIN');
                setError('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'LOGIN'
                  ? 'bg-white text-[#0E2150] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In & Demo Access
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('REGISTER');
                setError('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'REGISTER'
                  ? 'bg-white text-[#0E2150] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Registration
            </button>
          </div>

          {activeTab === 'LOGIN' ? (
            <>
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
            </>
          ) : (
            /* New Registration Form with DPDPA 2023 Compliance */
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setRegRole('WORKER')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    regRole === 'WORKER' ? 'bg-white text-[#0E2150] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Artisan / Worker
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('CUSTOMER')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    regRole === 'CUSTOMER' ? 'bg-white text-[#0E2150] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Household
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('SOCIETY')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    regRole === 'SOCIETY' ? 'bg-white text-[#0E2150] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Society
                </button>
              </div>

              {regSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-2 text-emerald-900 animate-in fade-in duration-200">
                  <CheckCircleIcon className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-heading font-bold text-sm">Registration Successful!</h4>
                  <p className="text-xs text-emerald-700">
                    Your cooperative record has been provisioned. Redirecting to your dashboard...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 font-heading">
                      {regRole === 'SOCIETY' ? 'Society Name' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={regRole === 'SOCIETY' ? 'Koramangala Labour Cooperative Society' : 'e.g. Anand Kumar'}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E2150] font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 font-heading">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="98765 00000"
                        className="w-full pl-12 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E2150] font-semibold text-slate-900"
                      />
                    </div>
                  </div>

                  {regRole === 'WORKER' && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 font-heading">
                            Trade Skill
                          </label>
                          <select
                            value={regTrade}
                            onChange={(e) => setRegTrade(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900"
                          >
                            <option>Electrician</option>
                            <option>Plumber</option>
                            <option>Cleaner</option>
                            <option>Caregiver</option>
                            <option>Carpenter</option>
                            <option>Painter</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 font-heading">
                            NSQF Skill Level
                          </label>
                          <select
                            value={regNsqf}
                            onChange={(e) => setRegNsqf(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900"
                          >
                            <option>NSQF Level 5 (Master Certified)</option>
                            <option>NSQF Level 4 (Guild Verified)</option>
                            <option>Apprentice (Guild Training)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 font-heading">
                          Affiliated Cooperative Society
                        </label>
                        <select
                          value={regSociety}
                          onChange={(e) => setRegSociety(e.target.value)}
                          className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900"
                        >
                          <option>Bangalore South Labour Cooperative #402</option>
                          <option>Indiranagar Ward Labour Cooperative #209</option>
                          <option>Karnataka State Labour Cooperative Guild #118</option>
                          <option>Shramik Mahila Labour Cooperative #501</option>
                        </select>
                      </div>
                    </>
                  )}

                  {regRole === 'CUSTOMER' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 font-heading">
                        Household Address / Ward
                      </label>
                      <input
                        type="text"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder="House / Flat No, Sector, Bengaluru"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900"
                      />
                    </div>
                  )}

                  {regRole === 'SOCIETY' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 font-heading">
                        State Registration Certificate Number
                      </label>
                      <input
                        type="text"
                        placeholder="COOP/BLR/2024/774"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900"
                      />
                    </div>
                  )}

                  {/* DPDPA 2023 Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2 text-[11px] text-slate-600 leading-snug cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regDpdpaConsent}
                        onChange={(e) => setRegDpdpaConsent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#0E2150] focus:ring-[#0E2150]"
                      />
                      <span>
                        I consent to cooperative trade verification & statutory record keeping under the{' '}
                        <strong className="text-slate-900">Digital Personal Data Protection Act (DPDPA) 2023</strong>.
                      </span>
                    </label>
                  </div>

                  {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
                  >
                    {loading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <span>Complete Registration & Enter</span>}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo Shortcuts - Retained with 100% fidelity */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center">
              Direct Role Entry (Quick Demo Access)
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
            <button
              type="button"
              onClick={() => handleQuickDemo('SUPER_ADMIN')}
              className="w-full py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center text-xs font-semibold text-slate-600 transition"
            >
              Super Admin Matrix →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
