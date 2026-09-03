import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface JobEarning {
  jobId: string;
  category: string;
  date: string;
  grossAmount: number;
  welfareContribution: number;
  netPayout: number;
  status: 'SETTLED' | 'PROCESSING';
}

export const WorkerEarningsScreen: React.FC = () => {
  const [earnings] = useState({
    totalNetWeek: 4850,
    totalJobsWeek: 8,
    totalWelfareFunded: 240,
    bankAccountMasked: 'HDFC Bank •••• 4129',
  });

  const [history] = useState<JobEarning[]>([
    {
      jobId: 'job-9841',
      category: 'Electrician',
      date: 'Today, 2:30 PM',
      grossAmount: 750,
      welfareContribution: 35,
      netPayout: 715,
      status: 'SETTLED',
    },
    {
      jobId: 'job-9812',
      category: 'Electrician',
      date: 'Yesterday, 11:15 AM',
      grossAmount: 600,
      welfareContribution: 30,
      netPayout: 570,
      status: 'SETTLED',
    },
    {
      jobId: 'job-9764',
      category: 'Electrician',
      date: '01 Sep, 4:00 PM',
      grossAmount: 900,
      welfareContribution: 45,
      netPayout: 855,
      status: 'SETTLED',
    },
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings & Payouts</Text>
        <Text style={styles.subtitle}>
          Fair-wage model guaranteed. 100% of labour earnings go directly to your account.
        </Text>
      </View>

      {/* Main Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>This Week's Net Payout</Text>
        <Text style={styles.statsAmount}>₹{earnings.totalNetWeek.toLocaleString('en-IN')}</Text>
        <View style={styles.payoutStatusRow}>
          <View style={styles.greenDot} />
          <Text style={styles.payoutStatusText}>Direct Transfer to {earnings.bankAccountMasked}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.kpiRow}>
          <View>
            <Text style={styles.kpiLabel}>Completed Jobs</Text>
            <Text style={styles.kpiValue}>{earnings.totalJobsWeek}</Text>
          </View>
          <View>
            <Text style={styles.kpiLabel}>Welfare Saved</Text>
            <Text style={styles.kpiValue}>₹{earnings.totalWelfareFunded}</Text>
          </View>
        </View>
      </View>

      {/* Job History */}
      <Text style={styles.sectionHeading}>Recent Settlements</Text>
      <View style={styles.historyList}>
        {history.map((item) => (
          <View key={item.jobId} style={styles.historyCard}>
            <View style={styles.historyTop}>
              <View>
                <Text style={styles.historyCategory}>{item.category}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <Text style={styles.historyPayout}>+₹{item.netPayout}</Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownText}>Gross: ₹{item.grossAmount}</Text>
              <Text style={styles.breakdownText}>Welfare: -₹{item.welfareContribution}</Text>
              <Text style={styles.settledText}>✓ {item.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  header: { marginBottom: 16, marginTop: 8 },
  title: { color: '#f8fafc', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4, lineHeight: 18 },
  statsCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 24,
  },
  statsLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  statsAmount: { color: '#10b981', fontSize: 32, fontWeight: 'extrabold', marginTop: 4 },
  payoutStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
  payoutStatusText: { color: '#94a3b8', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#1e293b', marginVertical: 16 },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-around' },
  kpiLabel: { color: '#64748b', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  kpiValue: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold', marginTop: 2, textAlign: 'center' },
  sectionHeading: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  historyList: { gap: 10, paddingBottom: 24 },
  historyCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  historyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyCategory: { color: '#f8fafc', fontSize: 15, fontWeight: 'bold' },
  historyDate: { color: '#64748b', fontSize: 12, marginTop: 2 },
  historyPayout: { color: '#10b981', fontSize: 16, fontWeight: 'bold' },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  breakdownText: { color: '#64748b', fontSize: 12 },
  settledText: { color: '#10b981', fontSize: 12, fontWeight: '600' },
});
