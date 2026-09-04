'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSocket } from '../../../../hooks/useSocket';
import { getBookingById, updateBookingStatus } from '@/data/bookings-store';
import { Booking, JobStatus } from '@/data/mock-data';
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  StarIcon,
  ArrowLeftIcon,
  AlertCircleIcon,
  PhoneIcon,
  MapPinIcon,
  SparklesIcon,
} from '@/components/icons';

export default function JobTrackingPage({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const { socket, isConnected } = useSocket('customer-token');

  // Load from store or initialize mock
  const [booking, setBooking] = useState<Booking | null>(null);
  const [stage, setStage] = useState<'DISPATCHED' | 'ON_THE_WAY' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED'>('ON_THE_WAY');
  const [distanceKm, setDistanceKm] = useState(2.3);
  const [etaSeconds, setEtaSeconds] = useState(480); // 8 minutes
  const [bikePositionPercent, setBikePositionPercent] = useState(35); // 0-100% on route
  const [telemetry, setTelemetry] = useState({ lat: 12.9344, lng: 77.6101, speed: 28 });

  useEffect(() => {
    const existing = getBookingById(params.jobId);
    if (existing) {
      setBooking(existing);
      if (existing.status === 'COMPLETED') {
        setStage('COMPLETED');
        setDistanceKm(0);
        setEtaSeconds(0);
        setBikePositionPercent(100);
      } else if (existing.status === 'IN_PROGRESS') {
        setStage('ON_THE_WAY');
      }
    } else {
      setBooking({
        id: params.jobId,
        customerId: 'cust-user-1',
        customerName: 'Anup Sharma',
        customerPhone: '+91 98451 98210',
        workerId: 'w-001',
        workerName: 'Ramesh Kumar (Guild Master NSQF-4)',
        serviceId: 'srv-001',
        serviceName: 'Certified Guild Plumbing Dispatch',
        category: 'PLUMBER',
        cooperativeId: 'soc-blr-01',
        cooperativeName: 'Bangalore South Labour Guild #04',
        scheduledDate: new Date().toLocaleDateString('en-GB'),
        scheduledTime: 'Immediate (15m)',
        address: 'Jayanagar 4th Block, Bengaluru, Karnataka',
        amount: 500,
        status: 'IN_PROGRESS',
        urgency: 'EMERGENCY',
        isPaid: false,
        paymentMethod: 'UPI',
        createdAt: new Date().toISOString(),
      });
    }
  }, [params.jobId]);

  // Real-time animation simulation
  useEffect(() => {
    if (stage === 'COMPLETED') return;

    const interval = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev <= 10) {
          if (stage === 'ON_THE_WAY') setStage('ARRIVED');
          return 0;
        }
        return prev - 1;
      });

      setDistanceKm((prev) => {
        if (prev <= 0.2) return 0.1;
        return Number((prev - 0.02).toFixed(2));
      });

      setBikePositionPercent((prev) => {
        if (prev >= 96) return 96;
        return Math.min(prev + 0.6, 96);
      });

      setTelemetry((prev) => ({
        lat: Number((prev.lat + (Math.random() - 0.5) * 0.0003).toFixed(4)),
        lng: Number((prev.lng + (Math.random() - 0.5) * 0.0003).toFixed(4)),
        speed: Math.floor(22 + Math.random() * 12),
      }));
    }, 1200);

    return () => clearInterval(interval);
  }, [stage]);

  const handleSimulateArrival = () => {
    setStage('IN_PROGRESS');
    setDistanceKm(0);
    setEtaSeconds(0);
    setBikePositionPercent(100);
    updateBookingStatus(params.jobId, 'IN_PROGRESS');
  };

  const handleMarkCompleted = () => {
    setStage('COMPLETED');
    setDistanceKm(0);
    setEtaSeconds(0);
    setBikePositionPercent(100);
    updateBookingStatus(params.jobId, 'COMPLETED');
    router.push(`/payment/${params.jobId}`);
  };

  const formatEta = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/customer/bookings"
            className="text-xs font-heading font-bold text-[#475569] hover:text-[#0D1829] flex items-center gap-1.5 transition"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to My Bookings
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? 'bg-[#059669] animate-pulse' : 'bg-[#059669]'
              }`}
            />
            <span className="text-xs font-bold text-[#0E2150] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Live GPS Radar Active
            </span>
          </div>
        </div>

        {/* 1. Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 font-mono">
              Live PostGIS Artisan Dispatch
            </span>
            <h1 className="text-2xl font-black font-heading text-[#0E2150] mt-0.5">
              {booking?.serviceName || 'Household Service Dispatch'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Booking Ref: <strong className="font-mono text-slate-800">{params.jobId}</strong> • Society:{' '}
              <span className="text-slate-700">{booking?.cooperativeName || 'Bangalore South Guild #04'}</span>
            </p>
          </div>

          <div className="text-right sm:border-l sm:pl-6 border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Arrival</span>
            <p className="text-2xl font-black font-heading text-[#059669]">
              {stage === 'COMPLETED'
                ? 'Arrived & Done'
                : stage === 'IN_PROGRESS' || stage === 'ARRIVED'
                ? 'Arrived on Site'
                : formatEta(etaSeconds)}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {stage === 'ON_THE_WAY' ? `${distanceKm} km away • Speed: ${telemetry.speed} km/h` : 'At service location'}
            </p>
          </div>
        </div>

        {/* 2. Interactive Animated GPS Map Canvas */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                Telemetry: {telemetry.lat}° N, {telemetry.lng}° E
              </span>
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Cooperative Fleet Radar
            </span>
          </div>

          {/* SVG Map Track Visual */}
          <div className="relative h-48 sm:h-56 w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center px-8">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Route Polyline Track */}
            <div className="w-full h-2 bg-slate-800 rounded-full relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out"
                style={{ width: `${bikePositionPercent}%` }}
              />
            </div>

            {/* Dispatch Hub Pin (Left) */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-slate-900">
                Hub
              </div>
              <span className="text-[10px] text-slate-300 font-bold mt-1">Guild #04</span>
            </div>

            {/* Moving Artisan Bike Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20 flex flex-col items-center"
              style={{ left: `calc(${bikePositionPercent}% + 12px)` }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-base shadow-lg ring-4 ring-emerald-500/30">
                  🛵
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white border-2 border-emerald-600 animate-ping" />
              </div>
              <span className="text-[10px] font-bold text-emerald-300 mt-1 whitespace-nowrap bg-slate-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                {stage === 'ARRIVED' || stage === 'IN_PROGRESS' || stage === 'COMPLETED' ? 'Arrived!' : `${distanceKm} km`}
              </span>
            </div>

            {/* Customer Destination Pin (Right) */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-slate-900">
                <MapPinIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-slate-300 font-bold mt-1 truncate max-w-[90px]">Home Pin</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div>
              <span className="text-slate-500">Service Location: </span>
              <strong className="text-white">{booking?.address || 'Jayanagar 4th Block, Bengaluru'}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Vehicle:</span>
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">
                KA-05-EJ-4421 (EV Scooter)
              </span>
            </div>
          </div>
        </div>

        {/* 3. Lifecycle Status Stepper */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#0E2150]">Service Lifecycle Status</h3>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className="space-y-1">
              <div className="w-8 h-8 mx-auto rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                ✓
              </div>
              <p className="font-bold text-slate-800 text-[11px]">Requested</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 mx-auto rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                ✓
              </div>
              <p className="font-bold text-slate-800 text-[11px]">Assigned</p>
            </div>
            <div className="space-y-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full font-bold flex items-center justify-center transition ${
                  stage === 'ON_THE_WAY'
                    ? 'bg-[#0E2150] text-white ring-4 ring-blue-100 animate-pulse'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                3
              </div>
              <p className="font-bold text-slate-800 text-[11px]">On The Way</p>
            </div>
            <div className="space-y-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full font-bold flex items-center justify-center transition ${
                  stage === 'IN_PROGRESS' || stage === 'ARRIVED'
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                    : stage === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                4
              </div>
              <p className="font-bold text-slate-800 text-[11px]">In Progress</p>
            </div>
            <div className="space-y-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full font-bold flex items-center justify-center transition ${
                  stage === 'COMPLETED' ? 'bg-[#059669] text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                }`}
              >
                5
              </div>
              <p className="font-bold text-slate-800 text-[11px]">Completed</p>
            </div>
          </div>
        </div>

        {/* 4. Assigned Artisan Profile Card & Action Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Artisan Profile */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0E2150] text-white flex items-center justify-center text-xl font-bold font-heading shadow-md">
                RK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-black text-base text-[#0E2150]">
                    {booking?.workerName || 'Ramesh Kumar'}
                  </h4>
                  <span className="badge-pill bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    NSQF Level 4
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ⭐ 4.92 / 5.0 (148 verified jobs) • Skill India Certified
                </p>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  {booking?.cooperativeName || 'Bangalore South Labour Guild #04'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:+919845123456"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <PhoneIcon className="w-3.5 h-3.5" /> Call Artisan
              </a>
              <button
                type="button"
                onClick={() => alert('Cooperative Dispatch Chat is connected to live artisan channel.')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
              >
                Message
              </button>
            </div>
          </div>

          {/* Interactive Live Demo Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Simulation Controls</span>
              <h4 className="font-heading font-bold text-xs text-[#0E2150] mt-0.5">
                Fast-Forward Status
              </h4>
            </div>

            {stage !== 'COMPLETED' ? (
              <div className="space-y-2">
                {stage === 'ON_THE_WAY' && (
                  <button
                    type="button"
                    onClick={handleSimulateArrival}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-50 text-[#0E2150] hover:bg-blue-100 border border-blue-200 text-xs font-bold transition"
                  >
                    Mark Artisan Arrived
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleMarkCompleted}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <CreditCardIcon className="w-3.5 h-3.5" /> Finish & Settle Payment
                </button>
              </div>
            ) : (
              <Link
                href={`/payment/${params.jobId}`}
                className="w-full py-3 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-md transition text-center flex items-center justify-center gap-1.5"
              >
                <CreditCardIcon className="w-4 h-4" /> Pay ₹{booking?.amount || 500} with Razorpay
              </Link>
            )}
          </div>
        </div>

        {/* 5. Trust & Legal Guarantees */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            100% Wage Protection Guarantee • Insured under Pradhan Mantri Suraksha Bima Yojana
          </span>
          <span className="font-mono text-[11px] text-slate-400">Rule A5 Idempotent Dispatch</span>
        </div>
      </div>
    </div>
  );
}
