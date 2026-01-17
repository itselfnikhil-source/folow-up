import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-paper';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import authService from '../services/authService';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const u = await authService.getStoredUser();
      const w = await authService.getStoredWorkspace();
      setUser(u);
      setCurrentWorkspace(w);
    })();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {user && (user.role === 'manager' || user.is_manager) && currentWorkspace && (
        <TouchableOpacity style={styles.workspaceBanner} onPress={() => {}}
        >
          <Text style={{ color: '#0F172A', fontWeight: '700' }}>{currentWorkspace.name}</Text>
          <Text style={{ color: '#64748B', marginTop: 4 }}>Active workspace</Text>
        </TouchableOpacity>
      )}
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back 👋</Text>
          <Text style={styles.subtitle}>Here’s your lead performance</Text>
        </View>
        <MaterialCommunityIcons
          name="bell-outline"
          size={26}
          color="#1E293B"
        />
      </View>

      {/* ================= SUMMARY CARDS ================= */}
      <View style={styles.row}>
        <SummaryCard
          title="Total Leads"
          value="1,240"
          icon="phone"
          colors={['#2563EB', '#1E40AF']}
        />
        <SummaryCard
          title="Follow-ups Today"
          value="42"
          icon="calendar-check"
          colors={['#16A34A', '#166534']}
        />
      </View>

      <View style={styles.row}>
        <SummaryCard
          title="Yesterday"
          value="38"
          icon="history"
          colors={['#F59E0B', '#B45309']}
        />
        <SummaryCard
          title="Last 7 Days"
          value="310"
          icon="chart-line"
          colors={['#9333EA', '#6B21A8']}
        />
      </View>

      {/* ================= AI SUGGESTION ================= */}
      <Card style={styles.aiCard}>
        <MaterialCommunityIcons
          name="robot-outline"
          size={26}
          color="#2563EB"
        />
        <Text style={styles.aiText}>
          AI Suggestion: Focus on leads contacted between{' '}
          <Text style={styles.aiBold}>11 AM – 2 PM</Text> for higher conversion.
        </Text>
      </Card>

      {/* ================= WEEKLY LEADS CHART ================= */}
      <Card style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Weekly Lead Activity</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: [45, 60, 52, 70, 90, 40, 55] }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 16 }}
        />
      </Card>

      {/* ================= KPI + DONUT ================= */}
      <View style={styles.kpiRow}>
        <Card style={styles.kpiCard}>
          <Text style={styles.sectionTitle}>Conversion Rate</Text>
          <ProgressChart
            data={{ data: [0.72] }}
            width={140}
            height={140}
            strokeWidth={12}
            radius={42}
            chartConfig={progressConfig}
            hideLegend
          />
          <Text style={styles.kpiValue}>72%</Text>
        </Card>

        <View style={styles.kpiStack}>
          <MiniKpi title="Avg Calls / Day" value="65" icon="phone" />
          <MiniKpi title="Connected Leads" value="420" icon="check-circle" />
          <MiniKpi title="Pending Follow-ups" value="88" icon="clock-outline" />
        </View>
      </View>

      {/* ================= RECENT LEADS ================= */}
      <Card style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Recent Leads</Text>

        <LeadItem name="Rahul Sharma" status="Interested" />
        <LeadItem name="Anita Verma" status="Follow-up" />
        <LeadItem name="Mohit Singh" status="Not Answered" />
      </Card>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ================= COMPONENTS ================= */

function SummaryCard({ title, value, icon, colors }: any) {
  return (
    <LinearGradient colors={colors} style={styles.summaryCard}>
      <MaterialCommunityIcons name={icon} size={26} color="#fff" />
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryTitle}>{title}</Text>
    </LinearGradient>
  );
}

function MiniKpi({ title, value, icon }: any) {
  return (
    <Card style={styles.miniKpi}>
      <MaterialCommunityIcons name={icon} size={22} color="#2563EB" />
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniTitle}>{title}</Text>
    </Card>
  );
}

function LeadItem({ name, status }: any) {
  return (
    <View style={styles.leadItem}>
      <View>
        <Text style={styles.leadName}>{name}</Text>
        <Text style={styles.leadStatus}>{status}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#94A3B8" />
    </View>
  );
}

/* ================= CHART CONFIG ================= */

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: () => '#2563EB',
  labelColor: () => '#64748B',
  strokeWidth: 3,
};

const progressConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: () => '#16A34A',
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    color: '#64748B',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryCard: {
    width: '48%',
    borderRadius: 18,
    padding: 16,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginTop: 10,
  },
  summaryTitle: {
    color: '#E5E7EB',
    marginTop: 4,
  },
  aiCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    gap: 10,
  },
  aiText: {
    color: '#1E293B',
    flex: 1,
  },
  aiBold: {
    fontWeight: '700',
    color: '#2563EB',
  },
  chartCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#0F172A',
  },
  kpiRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  kpiCard: {
    width: '45%',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: -10,
  },
  kpiStack: {
    width: '52%',
    justifyContent: 'space-between',
  },
  miniKpi: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  miniValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  miniTitle: {
    color: '#64748B',
    fontSize: 12,
  },
  leadItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leadName: {
    fontWeight: '600',
  },
  leadStatus: {
    color: '#64748B',
    fontSize: 12,
  },
  workspaceBanner: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'column',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
});
