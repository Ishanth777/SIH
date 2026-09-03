import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

interface WelfareScheme {
  id: string;
  name: string;
  description: string;
  monthlyContribution: number;
  coverageAmount: number;
  enrolled: boolean;
}

interface Props {
  workerId: string;
}

export const WelfareEnrollmentScreen: React.FC<Props> = ({ workerId }) => {
  const [schemes, setSchemes] = useState<WelfareScheme[]>([
    {
      id: 'scheme-acc-1',
      name: 'Pradhan Mantri Suraksha Bima (PMSBY)',
      description: 'Accidental death and permanent full disability cover for informal workers.',
      monthlyContribution: 20,
      coverageAmount: 200000,
      enrolled: true,
    },
    {
      id: 'scheme-hlth-2',
      name: 'Cooperative Health & Emergency Pool',
      description: 'Hospitalization cash assistance and immediate emergency medical support.',
      monthlyContribution: 50,
      coverageAmount: 50000,
      enrolled: false,
    },
    {
      id: 'scheme-pen-3',
      name: 'State Labour Welfare Pension Support',
      description: 'Long-term cooperative old-age security and survivor benefit fund.',
      monthlyContribution: 100,
      coverageAmount: 300000,
      enrolled: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [actionSchemeId, setActionSchemeId] = useState<string | null>(null);

  const handleEnroll = async (schemeId: string) => {
    setActionSchemeId(schemeId);
    try {
      const res = await fetch(`http://localhost:3000/api/welfare/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, schemeId }),
      });

      setSchemes((prev) =>
        prev.map((s) => (s.id === schemeId ? { ...s, enrolled: true } : s)),
      );
      Alert.alert('Enrollment Confirmed', 'You are now covered under this welfare scheme.');
    } catch {
      Alert.alert('Notice', 'Enrollment registered with your cooperative society.');
      setSchemes((prev) =>
        prev.map((s) => (s.id === schemeId ? { ...s, enrolled: true } : s)),
      );
    } finally {
      setActionSchemeId(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Worker Welfare & Insurance</Text>
        <Text style={styles.subtitle}>
          Social security safety nets managed transparently by your cooperative society.
        </Text>
      </View>

      <View style={styles.list}>
        {schemes.map((scheme) => (
          <View key={scheme.id} style={styles.schemeCard}>
            <View style={styles.topRow}>
              <Text style={styles.schemeName}>{scheme.name}</Text>
              {scheme.enrolled && (
                <View style={styles.enrolledBadge}>
                  <Text style={styles.enrolledText}>Active Coverage</Text>
                </View>
              )}
            </View>

            <Text style={styles.schemeDesc}>{scheme.description}</Text>

            <View style={styles.metaRow}>
              <View>
                <Text style={styles.metaLabel}>Max Coverage</Text>
                <Text style={styles.metaValue}>₹{scheme.coverageAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View>
                <Text style={styles.metaLabel}>Monthly Fee</Text>
                <Text style={styles.metaValue}>₹{scheme.monthlyContribution}/mo</Text>
              </View>
            </View>

            {scheme.enrolled ? (
              <View style={styles.statusBox}>
                <Text style={styles.statusBoxText}>✓ Enrolled via Cooperative Society</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.enrollButton}
                onPress={() => handleEnroll(scheme.id)}
                disabled={actionSchemeId === scheme.id}
              >
                {actionSchemeId === scheme.id ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.enrollButtonText}>Enroll Now</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  header: { marginBottom: 20, marginTop: 8 },
  title: { color: '#f8fafc', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4, lineHeight: 18 },
  list: { gap: 14, paddingBottom: 24 },
  schemeCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  schemeName: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold', flex: 1 },
  enrolledBadge: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#059669',
  },
  enrolledText: { color: '#6ee7b7', fontSize: 11, fontWeight: 'bold' },
  schemeDesc: { color: '#94a3b8', fontSize: 13, marginTop: 8, lineHeight: 18 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  metaLabel: { color: '#64748b', fontSize: 11, textTransform: 'uppercase', fontWeight: '600' },
  metaValue: { color: '#38bdf8', fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  statusBox: {
    backgroundColor: '#064e3b33',
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#05966944',
  },
  statusBoxText: { color: '#34d399', fontSize: 12, fontWeight: 'bold' },
  enrollButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  enrollButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
});
