'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PinDropMap } from '@/components/booking/PinDropMap';
import { ServiceCatalogGrid } from '@/components/booking/ServiceCatalogGrid';
import { ServiceCatalogItem, RequestType } from '@/types/matching.types';

export default function CustomerBookingPage() {
  const router = useRouter();

  const [catalog, setCatalog] = useState<ServiceCatalogItem[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');
  const [requestType, setRequestType] = useState<RequestType>('EMERGENCY');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [estimatedHours, setEstimatedHours] = useState<number>(2);
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(12.9716);
  const [longitude, setLongitude] = useState<number>(77.5946);
  
  const [loading, setLoading] = useState(false);
  const [fetchingCatalog, setFetchingCatalog] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/services-catalog`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to load services catalog');
        const data = await res.json();
        setCatalog(data);
        if (data.length > 0) setSelectedCatalogId(data[0].id);
      } catch (err: any) {
        setError(err.message || 'Error connecting to service catalog');
      } finally {
        setFetchingCatalog(false);
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
        cooperativeId: localStorage.getItem('cooperativeId') || 'f3d0e377-6262-4357-9d7e-07a5180632b4',
        serviceCatalogId: selectedCatalogId,
        type: requestType,
        description,
        address,
        latitude,
        longitude,
        scheduledAt: requestType === 'SCHEDULED' ? new Date(scheduledAt).toISOString() : undefined,
        estimatedHours: Number(estimatedHours),
      };

      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
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

  const selectedService = catalog.find((c) => c.id === selectedCatalogId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Book a Verified Co-op Worker</h1>
        <p className="text-slate-600 mt-2">
          Fair wage rates guaranteed. High-precision PostGIS geo-matching ensures fast nearby response.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">1. Select Service</label>
            <ServiceCatalogGrid
              catalog={catalog}
              selectedId={selectedCatalogId}
              onSelect={setSelectedCatalogId}
              loading={fetchingCatalog}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">2. Urgency & Schedule</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRequestType('EMERGENCY')}
                className={`py-2.5 px-4 rounded-lg font-medium text-sm border transition ${
                  requestType === 'EMERGENCY'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                ⚡ Immediate / Emergency
              </button>
              <button
                type="button"
                onClick={() => setRequestType('SCHEDULED')}
                className={`py-2.5 px-4 rounded-lg font-medium text-sm border transition ${
                  requestType === 'SCHEDULED'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                📅 Schedule for Later
              </button>
            </div>

            {requestType === 'SCHEDULED' && (
              <div className="mt-3">
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Duration (Hours)</label>
            <input
              type="number"
              min="1"
              max="24"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Issue Description / Instructions</label>
            <textarea
              rows={3}
              placeholder="Describe the task or any specific tools required..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              3. Service Location (Drop Pin for PostGIS Match)
            </label>
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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Detailed Street Address / Landmark</label>
            <input
              type="text"
              required
              placeholder="Apartment #, Street, Landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          {selectedService && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex justify-between items-center text-sm font-semibold text-emerald-900">
                <span>Estimated Cooperative Fair-Wage:</span>
                <span>₹{selectedService.baseRateMin * estimatedHours} - ₹{selectedService.baseRateMax * estimatedHours}</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                Calculated transparently based on cooperative standard rates with zero middleman commission.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || fetchingCatalog}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Submitting & Dispatching Engine...' : 'Confirm Booking & Find Workers'}
          </button>
        </div>
      </form>
    </div>
  );
}
