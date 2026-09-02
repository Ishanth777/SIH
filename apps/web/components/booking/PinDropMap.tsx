'use client';

import React, { useEffect, useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface PinDropMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
}

export const PinDropMap: React.FC<PinDropMapProps> = ({
  initialLat = 12.9716,
  initialLng = 77.5946,
  onLocationSelect,
}) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [addressLoading, setAddressLoading] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string>('');

  const reverseGeocode = async (lat: number, lng: number) => {
    setAddressLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const displayName = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setResolvedAddress(displayName);
      onLocationSelect(lat, lng, displayName);
    } catch {
      const fallback = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setResolvedAddress(fallback);
      onLocationSelect(lat, lng, fallback);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          setCoords({ lat: userLat, lng: userLng });
          reverseGeocode(userLat, userLng);
        },
        () => reverseGeocode(initialLat, initialLng),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      reverseGeocode(initialLat, initialLng);
    }
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative w-full h-72 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
        <LeafletMapContainer
          coords={coords}
          onPinChange={(lat, lng) => {
            setCoords({ lat, lng });
            reverseGeocode(lat, lng);
          }}
        />
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Pinned Coordinates (PostGIS Point)</span>
          {addressLoading && <span className="text-blue-600 animate-pulse">Resolving address...</span>}
        </div>
        <p className="font-medium text-slate-800 truncate">
          {resolvedAddress || `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`}
        </p>
        <div className="mt-1 flex gap-3 text-xs text-slate-400">
          <span>Lat: <strong className="text-slate-600">{coords.lat.toFixed(6)}</strong></span>
          <span>Lng: <strong className="text-slate-600">{coords.lng.toFixed(6)}</strong></span>
        </div>
      </div>
    </div>
  );
};

const LeafletMapContainer = ({
  coords,
  onPinChange,
}: {
  coords: { lat: number; lng: number };
  onPinChange: (lat: number, lng: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !containerRef.current) return;

      const container = containerRef.current;

      // Avoid "Map container is already initialized" error during React 18 StrictMode / hot reload
      if ((container as any)._leaflet_id) {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        (container as any)._leaflet_id = undefined;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const mapInstance = L.map(container).setView([coords.lat, coords.lng], 15);
      mapRef.current = mapInstance;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance);

      const markerInstance = L.marker([coords.lat, coords.lng], {
        draggable: true,
      }).addTo(mapInstance);
      markerRef.current = markerInstance;

      markerInstance.on('dragend', (e: any) => {
        const position = e.target.getLatLng();
        onPinChange(position.lat, position.lng);
      });

      mapInstance.on('click', (e: any) => {
        markerInstance.setLatLng(e.latlng);
        onPinChange(e.latlng.lat, e.latlng.lng);
      });
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (containerRef.current) {
        (containerRef.current as any)._leaflet_id = undefined;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([coords.lat, coords.lng]);
      mapRef.current.panTo([coords.lat, coords.lng]);
    }
  }, [coords.lat, coords.lng]);

  return <div ref={containerRef} className="w-full h-full" />;
};
