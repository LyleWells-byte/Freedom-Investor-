import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DownlineStats as DLStats } from '../../types/creator';

export default function DownlineStats({ stats }: { stats: DLStats }) {
  const activePct = stats.totalReferred > 0 ? (stats.activeThisWeek / stats.totalReferred) * 100 : 0;
  const activeColor = activePct > 40 ? '#4ADE80' : activePct > 20 ? '#FBBF24' : '#F87171';

  return (
    <View style={styles.grid}>
      <Stat label="Total Referred" value={stats.totalReferred} sub={`${stats.activeThisMonth} this month`} />
      <Stat
        label="Active This Week"
        value={stats.activeThisWeek}
        sub={`${activePct.toFixed(0)}% of downline`}
        color={activeColor}
      />
      <Stat label="Level 5 Reached" value={stats.level5Reached} sub={`${stats.wolfPackPitchShown} pitches shown`} />
      <Stat
        label="CTA Clicked"
        value={stats.wolfPackCtaClicked}
        sub={`${stats.ctaConversionRate.toFixed(1)}% conversion`}
      />
      <Stat
        label="License Transfers"
        value={stats.licenseTransfers}
        sub={`${stats.wolfPackBonusesApplied} bonuses applied`}
        color="#4ADE80"
      />
      <Stat
        label="Avg Engagement"
        value={`L${stats.avgPlayerLevel.toFixed(1)}`}
        sub={`$${stats.avgMonthlyCashflow.toLocaleString()}/mo avg`}
      />
    </View>
  );
}

function Stat({
  label,
  value,
  sub,
  color = '#FFD24A',
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {sub && <Text style={styles.sub}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#101018', padding: 14, borderRadius: 12, marginBottom: 10 },
  label: { color: '#A8A8B3', fontSize: 11 },
  value: { fontSize: 26, fontWeight: '900', marginTop: 4 },
  sub: { color: '#777', fontSize: 11, marginTop: 4 },
});
