import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import DownlineStats from '../../components/creator/DownlineStats';
import ConversionFunnel from '../../components/creator/ConversionFunnel';
import AvatarBreakdownChart from '../../components/creator/AvatarBreakdownChart';
import LevelDistributionChart from '../../components/creator/LevelDistributionChart';
import RecruitCard from '../../components/creator/RecruitCard';
import {
  getDownlineStats,
  getConversionFunnel,
  getRecruitList,
} from '../../engine/CreatorEngine';
import type {
  ConversionFunnelData,
  DownlineStats as DLS,
  RecruitProfile,
} from '../../types/creator';

interface Props {
  navigation: { navigate: (s: string, p?: any) => void };
}

const EMPTY_STATS: DLS = {
  totalReferred: 0,
  activeThisMonth: 0,
  activeThisWeek: 0,
  level5Reached: 0,
  wolfPackPitchShown: 0,
  wolfPackCtaClicked: 0,
  ctaConversionRate: 0,
  licenseTransfers: 0,
  licenseConversionRate: 0,
  wolfPackBonusesApplied: 0,
  avgPlayerLevel: 0,
  avgMonthlyCashflow: 0,
  totalPortfolioValueAcrossDownline: 0,
};

const EMPTY_FUNNEL: ConversionFunnelData = {
  signups: 0,
  completedOnboarding: 0,
  reachedLevel3: 0,
  reachedLevel5: 0,
  pitchShown: 0,
  ctaClicked: 0,
  agentPathStarted: 0,
  licenseTransferred: 0,
};

export default function CreatorDashboardScreen({ navigation }: Props) {
  const [stats, setStats] = useState<DLS>(EMPTY_STATS);
  const [funnel, setFunnel] = useState<ConversionFunnelData>(EMPTY_FUNNEL);
  const [recruits, setRecruits] = useState<RecruitProfile[]>([]);

  useEffect(() => {
    (async () => {
      setStats(await getDownlineStats('lyle'));
      setFunnel(await getConversionFunnel('lyle'));
      setRecruits(await getRecruitList('lyle', {}));
    })();
  }, []);

  const hot = recruits.slice(0, 5);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.header}>Freedom Investor Creator</Text>
      <Text style={styles.sub}>Lyle Wells • code: lyle</Text>
      <Text style={styles.count}>{stats.totalReferred} players in your downline</Text>

      <Text style={styles.section}>Downline Stats</Text>
      <DownlineStats stats={stats} />

      <Text style={styles.section}>Conversion Funnel</Text>
      <ConversionFunnel data={funnel} />

      <Text style={styles.section}>Avatar Breakdown</Text>
      <AvatarBreakdownChart
        counts={{ agent: 0, new_investor: 0, w2_employee: 0, business_owner: 0 }}
        onFilter={() => {}}
      />

      <Text style={styles.section}>Level Distribution</Text>
      <LevelDistributionChart counts={new Array(20).fill(0)} highlightLevel={5} />

      <Text style={styles.section}>Hot Leads</Text>
      {hot.length === 0 ? (
        <Text style={styles.empty}>No recruits yet.</Text>
      ) : (
        hot.map((r) => (
          <RecruitCard
            key={r.id}
            recruit={r}
            compact
            onView={() => navigation.navigate('RecruitDetail', { playerId: r.playerId })}
          />
        ))
      )}

      <Text style={styles.section}>Quick Actions</Text>
      <View style={styles.actions}>
        <Pressable style={styles.btn}>
          <Text style={styles.btnText}>View All Recruits</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => navigation.navigate('DownlineExport')}>
          <Text style={styles.btnText}>Export CSV</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => navigation.navigate('EventDemo')}>
          <Text style={[styles.btnText, { color: '#08080C' }]}>Launch Event Demo</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  sub: { color: '#A8A8B3', marginTop: 4 },
  count: { color: '#FFD24A', marginTop: 6, fontWeight: '700' },
  section: { color: '#FFD24A', fontWeight: '900', fontSize: 16, marginTop: 20, marginBottom: 8 },
  empty: { color: '#777', fontStyle: 'italic' },
  actions: { marginTop: 8 },
  btn: { backgroundColor: '#101018', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#FFD24A' },
  btnPrimary: { backgroundColor: '#FFD24A' },
  btnText: { color: '#FFD24A', fontWeight: '800' },
});
