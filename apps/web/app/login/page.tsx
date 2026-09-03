'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtp, verifyOtp, storeAuth, decodeJwt } from '@/lib/api';
import { ShieldCheck, Phone, ArrowRight, RefreshCw, KeyRound, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Form states
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // References for OTP input auto-advance
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 300s countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle phone submission (Step 1)
  const handleSendOtp = async (e?: React.FormEvent, customPhone?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const targetPhone = (customPhone || phone).trim();
    if (!/^\+91[6-9]\d{9}$/.test(targetPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number with +91 (e.g., +919876543210)');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendOtp(targetPhone);
      setSuccessMsg(res.message || 'OTP sent successfully!');
      setStep('OTP');
      setTimer(res.expiresInSeconds || 300);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.message || 'Unable to send OTP. Please verify API is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  // Handle OTP submission (Step 2)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      const tokens = await verifyOtp(phone, code);
      storeAuth(tokens);
      setSuccessMsg('Authentication successful! Establishing tenant context...');

      const session = decodeJwt(tokens.accessToken);
      setTimeout(() => {
        if (session?.role === 'FEDERATION_ADMIN') {
          router.push('/admin/federation');
        } else if (session?.role === 'SOCIETY_ADMIN') {
          router.push('/admin/society');
        } else {
          router.push('/admin/federation');
        }
      }, 1000);
    } catch (err: any) {
      if (err.errorCode === 'OTP_EXPIRED') {
        setError('Your OTP code has expired. Please click "Resend OTP".');
      } else {
        setError(err.message || 'Invalid OTP code. Please check and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick-fill test demo accounts
  const handleSelectDemoUser = (demoPhone: string) => {
    setPhone(demoPhone);
    handleSendOtp(undefined, demoPhone);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '36px 32px',
        position: 'relative',
      }}>
        {/* Header Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="badge badge-emerald">
            <Building2 size={13} />
            SIH26089
          </div>
          <div className="badge badge-indigo">
            <ShieldCheck size={13} />
            Postgres RLS Active
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            {step === 'PHONE' ? 'Cooperative Platform Login' : 'Enter 6-Digit Code'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {step === 'PHONE'
              ? 'Multi-tenant identity gateway with Postgres Row-Level Security isolation.'
              : `We sent a 6-digit verification code to ${phone}`}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#fca5a5',
            fontSize: '13px',
            marginBottom: '20px',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && !error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#6ee7b7',
            fontSize: '13px',
            marginBottom: '20px',
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Phone Form */}
        {step === 'PHONE' && (
          <form onSubmit={(e) => handleSendOtp(e)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="phone-input"
                  type="tel"
                  className="input-field"
                  style={{ paddingLeft: '44px', fontFamily: 'var(--font-mono)' }}
                  placeholder="+919876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Format: +91 followed by 10 digits
              </span>
            </div>

            <button
              id="submit-phone-btn"
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !phone}
              style={{ marginBottom: '24px' }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Generating OTP...
                </>
              ) : (
                <>
                  Continue with OTP
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Quick Demo Credentials */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Test Personas (Seed Accounts)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('+919000000001')}
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '8px 10px' }}
                >
                  🏢 Federation Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('+919000000002')}
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '8px 10px' }}
                >
                  🤝 Society Admin
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Verification Form */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textAlign: 'center' }}>
                Enter Verification Code
              </label>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-box-${index}`}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="otp-box"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Dev mode helper hint */}
              <div style={{
                margin: '16px 0',
                padding: '8px 12px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px dashed rgba(99, 102, 241, 0.25)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: '#a5b4fc',
                textAlign: 'center',
              }}>
                ⚡ Dev Hint: In development, OTP is printed to the API console logs.
              </div>

              {/* Timer and Resend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '13px' }}>
                <span style={{ color: timer > 0 ? 'var(--text-secondary)' : 'var(--text-danger)' }}>
                  Expires in: <strong>{formatTimer(timer)}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => handleSendOtp(undefined, phone)}
                  disabled={timer > 240 || isSubmitting}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: timer <= 240 ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    cursor: timer <= 240 ? 'pointer' : 'not-allowed',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  Resend OTP
                </button>
              </div>
            </div>

            <button
              id="verify-otp-btn"
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || otp.some((d) => !d)}
              style={{ marginBottom: '16px' }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Verifying Token...
                </>
              ) : (
                <>
                  <KeyRound size={18} />
                  Verify & Sign In
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('PHONE'); setError(null); }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
                padding: '8px',
              }}
            >
              ← Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
