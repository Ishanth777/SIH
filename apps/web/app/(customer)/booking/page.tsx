'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PinDropMap } from '@/components/booking/PinDropMap';
import { ServiceCatalogGrid } from '@/components/booking/ServiceCatalogGrid';
import { ServiceCatalogItem, RequestType } from '@/types/matching.types';
import {
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  MapPinIcon,
  LoaderIcon,
  ZapIcon,
} from '@/components/icons';

export default function CustomerBookingPage() {
  const router = useRouter();

  const [catalog, setCatalog] = useState<ServiceCatalogItem[]>([
    {
      id: 'cat-1',
      category: 'ELECTRICIAN',
      name: 'Certified Electrician',
      description: 'Wiring, circuit breakers, emergency short-circuits',
      baseRateMin: 250,
      baseRateMax: 400,
      unit: 'per_hour',
    },
    {
      id: 'cat-2',
      category: 'PLUMBER',
      name: 'Master Plumber',
      description: 'Pipe leaks, drainage, fixture repairs, water tanks',
      baseRateMin: 200,
      baseRateMax: 350,
      unit: 'per_hour',
    },
    {
      id: 'cat-3',
      category: 'CLEANER',
      name: 'Sanitation & Deep Cleaning',
      description: 'Full-house sanitization, kitchen/bath deep scrub',
      baseRateMin: 180,
      baseRateMax: 300,
      unit: 'per_hour',
    },
    {
      id: 'cat-4',
      category: 'CAREGIVER',
      name: 'Elderly & Nursing Caregiver',
      description: 'Compassionate assistance, mobility support, bedside care',
      baseRateMin: 220,
      baseRateMax: 380,
      unit: 'per_hour',
    },
  ]);

  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('cat-1');
  const [requestType, setRequestType] = useState<RequestType>('EMERGENCY');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [estimatedHours, setEstimatedHours] = useState<number>(2);
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('Jayanagar 4th Block, Bengaluru, Karnataka');
  const [latitude, setLatitude] = useState<number>(12.9716);
  const [longitude, setLongitude] = useState<number>(77.5946);

  const [loading, setLoading] = useState(false);
  const [fetchingCatalog, setFetchingCatalog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/services-catalog`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCatalog(data);
            setSelectedCatalogId(data[0].id);
          }
        }
      } catch {
        // Fallback to default catalog
      }
    }
    loadCatalog();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        cooperativeId:
          localStorage.getItem('cooperativeId') || 'f3d0e377-6262-4357-9d7e-07a5180632b4',
        serviceCatalogId: selectedCatalogId,
        type: requestType,
        description,
        address,
        latitude,
        longitude,
        scheduledAt: requestType === 'SCHEDULED' && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        estimatedHours: Number(estimatedHours),
      };

      const token = localStorage.getItem('accessToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/requests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit service request');
      }

      const createdRequest = await res.json();
      router.push(`/request/${createdRequest.id}/matching`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while booking.');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = catalog.find((c) => c.id === selectedCatalogId) || catalog[0];

  return (
    <div className="bg-[#F8FAFC]">
      {/* ── Hero Pattern ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#081435] via-[#0E2150] to-[#0E2150] text-white py-16 md:py-20 px-6 border-b border-[#1A3470] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1A3470_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="eyebrow inline-block mb-3 px-3 py-1 rounded-full bg-[#D1FAE5]/10 border border-[#059669]/30 text-[#34D399]">
              Verified Cooperative Guild Network
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.1] mb-4">
              Book Verified Artisans at Transparent Fair-Wage Rates.
            </h1>
            <p className="text-white/75 text-base sm:text-lg font-sans leading-relaxed mb-8 max-w-2xl">
              Deterministic PostGIS geo-matching pairs you directly with licensed cooperative workers nearby. Zero hidden commissions. 100% direct livelihood support.
            </p>

            {/* Trust Micro-Badges Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/80 font-heading font-bold pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <span className="text-[#34D399]">⚡</span> 10s PostGIS Dispatch
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#34D399]">🛡️</span> 100% KYC Verified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#34D399]">🤝</span> Zero-Middleman Wage
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#34D399]">🔒</span> RLS Tenant Isolated
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Booking Form ───────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-[12px] text-sm font-medium flex items-center gap-3">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Service & Time selection (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Select Service */}
            <div className="card-base">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
                <div>
                  <span className="eyebrow">Step 01</span>
                  <h2 className="font-heading font-extrabold text-lg text-[#0D1829]">
                    Select Trade Category
                  </h2>
                </div>
                <span className="label-style">Fair Wage Guaranteed</span>
              </div>

              <ServiceCatalogGrid
                catalog={catalog}
                selectedId={selectedCatalogId}
                onSelect={setSelectedCatalogId}
                loading={fetchingCatalog}
              />
            </div>

            {/* Step 2: Schedule & Urgency */}
            <div className="card-base">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
                <div>
                  <span className="eyebrow">Step 02</span>
                  <h2 className="font-heading font-extrabold text-lg text-[#0D1829]">
                    Urgency & Timing
                  </h2>
                </div>
                <span className="label-style">Instant / Scheduled</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <button
                  type="button"
                  onClick={() => setRequestType('EMERGENCY')}
                  className={`py-3 px-4 rounded-[10px] font-heading font-bold text-sm transition-all duration-180 flex items-center justify-center gap-2 border ${
                    requestType === 'EMERGENCY'
                      ? 'btn-action border-transparent'
                      : 'btn-outline'
                  }`}
                >
                  <ZapIcon className="w-4 h-4" /> Immediate Dispatch
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('SCHEDULED')}
                  className={`py-3 px-4 rounded-[10px] font-heading font-bold text-sm transition-all duration-180 flex items-center justify-center gap-2 border ${
                    requestType === 'SCHEDULED'
                      ? 'btn-primary border-transparent'
                      : 'btn-outline'
                  }`}
                >
                  <ClockIcon className="w-4 h-4" /> Schedule for Later
                </button>
              </div>

              {requestType === 'SCHEDULED' && (
                <div className="mb-5">
                  <label className="label-style block mb-1.5">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="input-base w-full text-sm font-medium"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="label-style block mb-1.5">Estimated Duration</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(Number(e.target.value))}
                      className="input-base w-full text-sm font-medium pl-10"
                    />
                    <ClockIcon className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3.5" />
                    <span className="absolute right-3 top-3 text-xs text-[#94A3B8] font-bold">
                      hours
                    </span>
                  </div>
                </div>

                <div>
                  <label className="label-style block mb-1.5">Rate Band</label>
                  <div className="input-base w-full text-sm text-[#475569] bg-[#F1F5F9] font-bold flex items-center justify-between">
                    <span>Base Band:</span>
                    <span className="text-[#059669]">
                      ₹{selectedService ? selectedService.baseRateMin : 200}/hr
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="label-style block mb-1.5">Job Instructions / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue, required tools, or building gate instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-base w-full text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Location Map & Confirmation (5 cols) */}
          <div className="lg:col-span-5 space-y-8 sticky top-24">
            <div className="card-base">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
                <div>
                  <span className="eyebrow">Step 03</span>
                  <h2 className="font-heading font-extrabold text-lg text-[#0D1829]">
                    Job Location
                  </h2>
                </div>
                <span className="label-style">PostGIS Point</span>
              </div>

              {/* Map Widget */}
              <div className="mb-4 rounded-[12px] overflow-hidden border border-[#E2E8F0]">
                <PinDropMap
                  initialLat={latitude}
                  initialLng={longitude}
                  onLocationSelect={(lat, lng, addr) => {
                    setLatitude(lat);
                    setLongitude(lng);
                    if (addr) setAddress(addr);
                  }}
                />
              </div>

              <div className="mb-5">
                <label className="label-style block mb-1.5">Service Street Address</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="House/Apt #, Street, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-base w-full text-sm font-medium pl-9"
                  />
                  <MapPinIcon className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Fair Wage Estimate Card */}
              {selectedService && (
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] mb-6 space-y-2">
                  <div className="flex justify-between items-center text-sm font-heading font-bold text-[#0D1829]">
                    <span>Estimated Fair-Wage Payout:</span>
                    <span className="text-[#059669] font-black text-base">
                      ₹{selectedService.baseRateMin * estimatedHours} – ₹
                      {selectedService.baseRateMax * estimatedHours}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] font-sans">
                    100% of this estimate is disbursed directly to the assigned worker upon completion. No brokerage deduction.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-action w-full py-3.5 px-6 font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin" /> Dispatching PostGIS Geo-Engine...
                  </>
                ) : (
                  'Confirm Booking & Match Workers'
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#94A3B8] font-bold">
                <ShieldCheckIcon className="w-4 h-4 text-[#059669]" />
                <span>Protected by Cooperative Livelihood Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
