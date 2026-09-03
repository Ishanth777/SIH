import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
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

  if (!isConnected) return <ActivityIndicator style={styles.center} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Dashboard</Text>
      
      {jobOffer ? (
        <View style={styles.card}>
          <Text style={styles.jobText}>New Job Request: {jobOffer.title || jobOffer.id}</Text>
          <Text style={styles.jobText}>Current Status: {status}</Text>

          {loading ? <ActivityIndicator size="small" /> : (
            <>
              {status === 'PENDING' && (
                <View style={styles.actions}>
                  <Button title="Accept" onPress={() => updateJobStatus('ACCEPT')} />
                  <Button title="Reject" color="red" onPress={() => updateJobStatus('REJECT')} />
                </View>
              )}
              {status === 'ACCEPTED' && (
                 <Button title="Start Job" onPress={() => updateJobStatus('START')} color="blue" />
              )}
              {status === 'IN_PROGRESS' && (
                 <Button title="Mark Completed" onPress={() => updateJobStatus('COMPLETE')} color="green" />
              )}
            </>
          )}
        </View>
      ) : (
        <Text>Waiting for incoming jobs...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 8, elevation: 3 },
  jobText: { fontSize: 16, marginBottom: 15 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});
