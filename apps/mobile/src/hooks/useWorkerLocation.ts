import { useState, useEffect } from 'react';
import { WorkerLocationService } from '../services/location.service';

export function useWorkerLocation() {
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkTracking = async () => {
    try {
      const active = await WorkerLocationService.isTrackingActive();
      setIsTracking(active);
    } catch {
      setIsTracking(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkTracking();
  }, []);

  const toggleTracking = async (enabled: boolean) => {
    setLoading(true);
    try {
      if (enabled) {
        const success = await WorkerLocationService.startTracking();
        setIsTracking(success);
        return success;
      } else {
        await WorkerLocationService.stopTracking();
        setIsTracking(false);
        return true;
      }
    } finally {
      setLoading(false);
    }
  };

  return { isTracking, loading, toggleTracking, refetch: checkTracking };
}
