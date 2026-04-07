import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../constants/theme';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  navigation: { navigate: (s: string) => void };
}

export default function VisionBoardScreen({ navigation }: Props) {
  const player = usePlayerStore((s) => s.player);

  if (!player) return null;

  const target = player.goals.passive_income_target || 10000;
  const current = 0;
  const pct = Math.min(100, (current / target) * 100);
  const yearsRemaining = player.goals.timeline_years || 10;

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{player.display_name}'s Freedom Vision</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>

      <Text style={styles.section}>Monthly Passive Income</Text>
      <View style={styles.card}>
        <View style={styles.ringBox}>
          <Text style={styles.ringValue}>${current.toLocaleString()}</Text>
          <Text style={styles.ringTarget}>of ${target.toLocaleString()}/mo</Text>
        </View>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.pct}>{pct.toFixed(0)}% there</Text>
        <Text style={styles.motivation}>
          {Math.ceil((target - current) / 400)} more properties at $400 average gets you there.
        </Text>
      </View>

      <Text style={styles.section}>Timeline</Text>
      <View style={styles.card}>
        <Text style={styles.bigText}>{yearsRemaining} years remaining</Text>
        <Text style={styles.subText}>on your {yearsRemaining} year plan</Text>
      </View>

      <Text style={styles.section}>Lifetime Tax Savings (in-game)</Text>
      <View style={styles.card}>
        <Text style={styles.gold}>$0</Text>
      </View>

      <Text style={styles.section}>Portfolio Snapshot</Text>
      <View style={styles.card}>
        <Text style={styles.subText}>0 properties owned</Text>
        <Text style={styles.subText}>Total value: ${player.cash_balance.toLocaleString()}</Text>
      </View>

      {player.goals.vision_description && (
        <View style={styles.whyCard}>
          <Text style={styles.whyLabel}>Your Why</Text>
          <Text style={styles.whyText}>"{player.goals.vision_description}"</Text>
        </View>
      )}

      <Pressable style={styles.review} onPress={() => navigation.navigate('AnnualReview')}>
        <Text style={styles.reviewText}>Start Annual Review →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50, paddingHorizontal: 16 },
  header: { alignItems: 'center', marginBottom: 16 },
  title: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '900' },
  date: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  section: { color: COLORS.gold, fontWeight: '900', marginTop: 16, marginBottom: 6 },
  card: { backgroundColor: COLORS.backgroundCard, padding: 16, borderRadius: 12 },
  ringBox: { alignItems: 'center', marginBottom: 12 },
  ringValue: { color: COLORS.gold, fontSize: 36, fontWeight: '900' },
  ringTarget: { color: COLORS.textMuted, fontSize: 12 },
  barBg: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: COLORS.gold },
  pct: { color: COLORS.textPrimary, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  motivation: { color: COLORS.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 8, fontStyle: 'italic' },
  bigText: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '900' },
  subText: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  gold: { color: COLORS.gold, fontSize: 36, fontWeight: '900', textAlign: 'center' },
  whyCard: { marginTop: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: COLORS.gold, backgroundColor: COLORS.backgroundCard, borderRadius: 12 },
  whyLabel: { color: COLORS.gold, fontWeight: '800' },
  whyText: { color: COLORS.textPrimary, fontStyle: 'italic', marginTop: 6 },
  review: { backgroundColor: COLORS.gold, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  reviewText: { color: COLORS.background, fontWeight: '900' },
});
