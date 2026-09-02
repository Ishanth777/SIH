import React from 'react';
import { View, Text, Switch, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useWorkerLocation } from '../hooks/useWorkerLocation';
import { MobileApiService } from '../services/api.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WorkerAvailabilityToggle = () => {
  const { isTracking, loading, toggleTracking } = useWorkerLocation();

  const handleToggle = async (value: boolean) => {
    const workerId = await AsyncStorage.getItem('workerId');
    if (!workerId) {
      Alert.alert('Authentication Error', 'No active worker session found.');
      return;
    }

    const success = await toggleTracking(value);
    if (success || !value) {
      await MobileApiService.updateAvailability(workerId, value);
    } else {
      Alert.alert('Permission Error', 'Background location permission is required.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.title}>Duty Availability</Text>
            <Text style={styles.subtitle}>
              {isTracking ? '🟢 Online — Live GPS Sync Active' : '⚪ Offline — Not receiving job matches'}
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator color="#2563eb" />
          ) : (
            <Switch
              value={isTracking}
              onValueChange={handleToggle}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={isTracking ? '#2563eb' : '#f8fafc'}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
});
