'use client';

import { useState, useEffect, useCallback } from 'react';
import { ServiceRequestResponse } from '../types/matching.types';

export function useMatchingStatus(serviceRequestId: string | null) {
  const [request, setRequest] = useState<ServiceRequestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!serviceRequestId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/requests/${serviceRequestId}`);
      if (!res.ok) throw new Error('Failed to fetch request status');
      const data = await res.json();
      setRequest(data);
    } catch (err: any) {
      setError(err.message || 'Error loading request');
    } finally {
      setLoading(false);
    }
  }, [serviceRequestId]);

  useEffect(() => {
    if (!serviceRequestId) return;
    fetchStatus();

    // Poll status every 3 seconds until matched or accepted
    const interval = setInterval(() => {
      fetchStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [serviceRequestId, fetchStatus]);

  return { request, loading, error, refetch: fetchStatus };
}
