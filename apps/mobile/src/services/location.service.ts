import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MobileApiService } from './api.service';

export const BACKGROUND_LOCATION_TASK = 'WORKER_BACKGROUND_LOCATION_TASK';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }: { data: any; error: any }) => {
  if (error) {
    console.error('[BackgroundLocationTask] Task error:', error.message);
    return;
  }

  if (data) {
    const { locations } = data;
    if (locations && locations.length > 0) {
      const latestLocation = locations[locations.length - 1];
      const { latitude, longitude } = latestLocation.coords;

      const workerId = await AsyncStorage.getItem('workerId');
      if (workerId) {
        await MobileApiService.updateLocation(workerId, latitude, longitude);
      }
    }
  }
});

export class WorkerLocationService {
  static async startTracking(): Promise<boolean> {
    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== 'granted') {
      console.warn('[LocationService] Foreground location permission denied.');
      return false;
    }

    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== 'granted') {
      console.warn('[LocationService] Background location permission denied.');
      return false;
    }

    const isAlreadyStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    if (isAlreadyStarted) {
      return true;
    }

    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 30000,
      distanceInterval: 25,
      deferredUpdatesInterval: 30000,
      foregroundService: {
        notificationTitle: 'Co-op Worker Duty Active',
        notificationBody: 'Sharing location for nearby job matches.',
        notificationColor: '#2563eb',
      },
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
    });

    const initialLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const workerId = await AsyncStorage.getItem('workerId');
    if (workerId) {
      await MobileApiService.updateLocation(
        workerId,
        initialLocation.coords.latitude,
        initialLocation.coords.longitude
      );
    }

    return true;
  }

  static async stopTracking(): Promise<void> {
    const isStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    if (isStarted) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    }
  }

  static async isTrackingActive(): Promise<boolean> {
    return await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }
}
