import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { JobOfferEvent } from '../types/location.types';

interface IncomingJobOfferModalProps {
  visible: boolean;
  offer: JobOfferEvent | null;
  onAccept: (jobId: string) => void;
  onReject: (jobId: string) => void;
}

export const IncomingJobOfferModal: React.FC<IncomingJobOfferModalProps> = ({
  visible,
  offer,
  onAccept,
  onReject,
}) => {
  if (!offer) return null;

  const distanceKm = (offer.distanceMeters / 1000).toFixed(1);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚡ New Job Match ({distanceKm} km away)</Text>
          </View>

          <Text style={styles.title}>Service Category: {offer.category}</Text>
          <Text style={styles.subtitle}>
            A customer nearby is requesting emergency/scheduled service.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => onReject(offer.jobId)}
            >
              <Text style={styles.rejectText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => onAccept(offer.jobId)}
            >
              <Text style={styles.acceptText}>Accept Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  badge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 13,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#f1f5f9',
  },
  rejectText: {
    color: '#475569',
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#2563eb',
  },
  acceptText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
