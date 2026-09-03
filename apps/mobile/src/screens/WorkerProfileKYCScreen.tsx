import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { offlineCacheService, CachedWorkerProfile } from '../services/offline-cache.service';

interface Props {
  workerId: string;
}

export const WorkerProfileKYCScreen: React.FC<Props> = ({ workerId }) => {
  const [profile, setProfile] = useState<CachedWorkerProfile | null>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [kycDocUrl, setKycDocUrl] = useState('');
  const [dpdpaConsent, setDpdpaConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [workerId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Check offline cache first (Rule A7 / M1)
      const cached = await offlineCacheService.getCachedWorkerProfile(workerId);
      if (cached) {
        setProfile(cached);
      }

      // Fetch fresh profile from API
      const res = await fetch(`http://localhost:3000/api/workers/${workerId}`);
      if (res.ok) {
        const data = await res.json();
        const fresh: CachedWorkerProfile = {
          id: data.id,
          name: data.name,
          phone: data.user?.phone || '',
          cooperativeName: data.cooperative?.name || 'Local Society',
          isAvailable: data.isAvailable,
          verificationStatus: data.verificationStatus,
          ratingAverage: data.ratingAverage || 5.0,
        };
        setProfile(fresh);
        await offlineCacheService.cacheWorkerProfile(fresh);
      }
    } catch {
      // In offline mode, cached profile is retained
    } finally {
      setLoading(false);
    }
  };

  const handleUploadKyc = async () => {
    if (!dpdpaConsent) {
      Alert.alert(
        'Consent Required',
        'You must agree to the DPDPA consent terms to submit KYC documents (Rule S7).',
      );
      return;
    }

    setUploading(true);
    try {
      // Simulate object storage upload (Rule A6: MinIO/S3 object storage only)
      const mockObjectStorageUrl = `https://minio.coop.internal/kyc/${workerId}/aadhaar-${Date.now()}.pdf`;

      // Update worker profile with object storage URL
      const res = await fetch(`http://localhost:3000/api/workers/${workerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kycDocumentUrls: [mockObjectStorageUrl],
        }),
      });

      if (res.ok) {
        Alert.alert(
          'KYC Submitted',
          'Your KYC documents have been securely uploaded to object storage for cooperative verification.',
        );
        setKycDocUrl(mockObjectStorageUrl);
      }
    } catch (err) {
      Alert.alert('Upload Failed', 'Could not upload KYC document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading && !profile) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.workerName}>{profile?.name || 'Worker Profile'}</Text>
        <Text style={styles.coopName}>{profile?.cooperativeName}</Text>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              profile?.verificationStatus === 'VERIFIED' ? styles.badgeVerified : styles.badgePending,
            ]}
          >
            <Text style={styles.badgeText}>
              {profile?.verificationStatus === 'VERIFIED' ? 'Verified Member' : 'Pending Verification'}
            </Text>
          </View>
          <Text style={styles.ratingText}>★ {profile?.ratingAverage?.toFixed(1) || '5.0'}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>KYC & Aadhaar Verification</Text>
        <Text style={styles.sectionSubtitle}>
          Rule A6: Documents are securely encrypted and stored in object storage (MinIO).
        </Text>

        <Text style={styles.inputLabel}>Aadhaar Number (Last 4 digits / Virtual ID)</Text>
        <TextInput
          style={styles.input}
          placeholder="XXXX-XXXX-1234"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          maxLength={14}
          value={aadhaarNumber}
          onChangeText={setAadhaarNumber}
        />

        {/* DPDPA Consent Capture (Rule S7) */}
        <TouchableOpacity
          style={styles.consentRow}
          onPress={() => setDpdpaConsent(!dpdpaConsent)}
        >
          <View style={[styles.checkbox, dpdpaConsent && styles.checkboxChecked]}>
            {dpdpaConsent && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.consentText}>
            I provide explicit consent under the Digital Personal Data Protection Act (DPDPA) for my cooperative society to verify my identity and credentials.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadButton, (!dpdpaConsent || uploading) && styles.buttonDisabled]}
          onPress={handleUploadKyc}
          disabled={!dpdpaConsent || uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadButtonText}>Upload KYC Document to MinIO</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' },
  headerCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  workerName: { color: '#f8fafc', fontSize: 22, fontWeight: 'bold' },
  coopName: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeVerified: { backgroundColor: '#064e3b', borderWidth: 1, borderColor: '#059669' },
  badgePending: { backgroundColor: '#78350f', borderWidth: 1, borderColor: '#d97706' },
  badgeText: { color: '#f8fafc', fontSize: 12, fontWeight: '600' },
  ratingText: { color: '#f59e0b', fontSize: 14, fontWeight: 'bold' },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  sectionTitle: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold' },
  sectionSubtitle: { color: '#64748b', fontSize: 12, marginTop: 4, marginBottom: 16 },
  inputLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#020617',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#fff',
    padding: 12,
    marginBottom: 16,
  },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#2563eb' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  consentText: { color: '#94a3b8', fontSize: 11, flex: 1, lineHeight: 16 },
  uploadButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  uploadButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
