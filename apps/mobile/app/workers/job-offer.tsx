import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSocket } from '../../hooks/useSocket';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const WORKER_TOKEN = 'mock-worker-token';
const WORKER_ID = 'mock-worker-id'; 

export default function JobOfferScreen() {
  const { socket, isConnected } = useSocket(WORKER_TOKEN);
  const [jobOffer, setJobOffer] = useState<any>(null);
  const [status, setStatus] = useState<'IDLE' | 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED'>('IDLE');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.emit('worker:join_room', { workerId: WORKER_ID });

    socket.on('job:offer', (data) => {
      setJobOffer(data);
      setStatus('PENDING');
    });

    return () => {
      socket.off('job:offer');
    };
  }, [socket]);

  const updateJobStatus = async (action: string) => {
    if (!jobOffer) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/jobs/${jobOffer.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WORKER_TOKEN}`
        },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setStatus(
        action === 'ACCEPT' ? 'ACCEPTED' :
        action === 'START' ? 'IN_PROGRESS' :
        action === 'COMPLETE' ? 'COMPLETED' : 'IDLE'
      );
      if (action === 'REJECT' || action === 'COMPLETE') {
        setJobOffer(null);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not update job status.');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.connectingText}>Connecting to Worker Gateway...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Worker Operations</Text>
          <Text style={styles.subtitle}>Cooperative Labour Marketplace</Text>
        </View>

        {/* Live Status Badge */}
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10b981' : '#f43f5e' }]} />
          <Text style={styles.statusBadgeText}>
            {isConnected ? 'Gateway Live' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {jobOffer ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>Incoming Dispatch</Text>
              </View>
              <Text style={styles.jobIdText}>ID: #{jobOffer.id?.slice?.(0, 8) || '26089'}</Text>
            </View>

            <Text style={styles.jobTitle}>
              {jobOffer.title || 'General Cooperative Labour Assignment'}
            </Text>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Current State:</Text>
              <View style={styles.badgeHighlight}>
                <Text style={styles.badgeHighlightText}>{status.replace('_', ' ')}</Text>
              </View>
            </View>

            {loading ? (
              <ActivityIndicator size="small" color="#10b981" style={styles.loader} />
            ) : (
              <View style={styles.actionsContainer}>
                {status === 'PENDING' && (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.acceptButton]}
                      onPress={() => updateJobStatus('ACCEPT')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.acceptButtonText}>Accept Offer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.button, styles.rejectButton]}
                      onPress={() => updateJobStatus('REJECT')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.rejectButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {status === 'ACCEPTED' && (
                  <TouchableOpacity
                    style={[styles.button, styles.startButton]}
                    onPress={() => updateJobStatus('START')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.startButtonText}>Start Job</Text>
                  </TouchableOpacity>
                )}

                {status === 'IN_PROGRESS' && (
                  <TouchableOpacity
                    style={[styles.button, styles.completeButton]}
                    onPress={() => updateJobStatus('COMPLETE')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.completeButtonText}>Mark Completed</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <View style={[styles.statusDot, { backgroundColor: '#10b981', width: 10, height: 10 }]} />
            </View>
            <Text style={styles.emptyTitle}>Ready for Dispatch</Text>
            <Text style={styles.emptySubtitle}>
              Listening to real-time job offers from affiliated societies...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  connectingText: {
    marginTop: 14,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ecfdf5',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  tagBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  tagBadgeText: {
    color: '#4338ca',
    fontSize: 11,
    fontWeight: '700',
  },
  jobIdText: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    lineHeight: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statusLabel: {
    fontSize: 13,
    color: '#64748b',
    marginRight: 8,
  },
  badgeHighlight: {
    backgroundColor: '#ecfeff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a5f3fc',
  },
  badgeHighlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0e7490',
  },
  loader: {
    marginVertical: 14,
  },
  actionsContainer: {
    marginTop: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
  },
  rejectButtonText: {
    color: '#be123c',
    fontSize: 14,
    fontWeight: '700',
  },
  startButton: {
    backgroundColor: '#4f46e5',
    width: '100%',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  completeButton: {
    backgroundColor: '#059669',
    width: '100%',
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
