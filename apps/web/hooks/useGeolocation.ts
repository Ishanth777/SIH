'use client';

import { useState, useEffect } from 'react';

export interface GeoLocationState {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(defaultLat: number = 12.9716, defaultLng: number = 77.5946) {
  const [state, setState] = useState<GeoLocationState>({
    latitude: defaultLat,
    longitude: defaultLng,
    accuracy: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, [defaultLat, defaultLng]);

  return state;
}
