import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ConversionFunnelData } from '../../types/creator';

export default function ConversionFunnel({ data }: { data: ConversionFunnelData }) {
  const stages: [string, number][] = [
    ['Signups', data.signups],
    ['Onboarded', data.completedOnboarding],
    ['Level 3', data.reachedLevel3],
    ['Level 5', data.reachedLevel5],
    ['Pitch Shown', data.pitchShown],
    ['CTA Clicked', data.ctaClicked],
    ['License Transferred', data.licenseTransferred],
  ];
  const max = Math.max(...stages.map((s) => s[1]), 1);

  let largestDropIdx = 0;
  let largestDropPct = 0;
  for (let i = 1; i < stages.length; i++) {
    const prev = stages[i - 1][1];
    const cur = stages[i][1];
    if (prev === 0) continue;
    const dropPct = ((prev - cur) / prev) * 100;
    if (dropPct > largestDropPct) {
      largestDropPct = dropPct;
      largestDropIdx = i;
    }
  }

  const SUGGESTIONS: Record<string, string> = {
    Onboarded: 'Your QR code audience may need more context. Show the demo longer before they scan.',
    'Level 3': 'Players are losing momentum early. Consider posting a pack challenge to re-engage.',
    'Level 5': 'Players churn before unlocking the pitch. Add re-engagement nudges around L4.',
    'CTA Clicked': 'The pitch is landing but not converting. Personalize follow-up by avatar type.',
  };

  return (
    <View style={styles.box}>
      {stages.map(([name, count], i) => {
        const widthPct = (count / max) * 100;
        const prev = i > 0 ? stages[i - 1][1] : count;
        const dropPct = prev > 0 ? ((prev - count) / prev) * 100 : 0;
        return (
          <View key={name} style={styles.row}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${widthPct}%` }]} />
            </View>
            <Text style={styles.count}>{count}</Text>
            {i > 0 && dropPct > 0 && <Text style={styles.drop}>-{dropPct.toFixed(0)}%</Text>}
          </View>
        );
      })}
      {largestDropPct > 0 && (
        <Text style={styles.warn}>
          ⚠️ Most dropoff: {stages[largestDropIdx - 1][0]} → {stages[largestDropIdx][0]}.
          {' '}
          {SUGGESTIONS[stages[largestDropIdx][0]] ?? ''}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  name: { color: '#E6E6E6', fontSize: 12, width: 100 },
  barBg: { flex: 1, height: 14, backgroundColor: '#222', borderRadius: 4, marginHorizontal: 6, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#FFD24A' },
  count: { color: '#FFFFFF', fontSize: 12, width: 36, textAlign: 'right' },
  drop: { color: '#F87171', fontSize: 10, marginLeft: 6, width: 36 },
  warn: { color: '#FBBF24', fontSize: 12, marginTop: 12 },
});
