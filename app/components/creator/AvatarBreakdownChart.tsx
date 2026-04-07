import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { AvatarType } from '../../types/player';

interface Props {
  counts: Record<AvatarType, number>;
  onFilter: (type: AvatarType) => void;
}

const COLORS: Record<AvatarType, string> = {
  agent: '#FFD24A',
  new_investor: '#4A90E2',
  w2_employee: '#F5A623',
  business_owner: '#7ED321',
};

const LABELS: Record<AvatarType, string> = {
  agent: 'Agent',
  new_investor: 'New Investor',
  w2_employee: 'W2 Employee',
  business_owner: 'Business Owner',
};

export default function AvatarBreakdownChart({ counts, onFilter }: Props) {
  const total = Object.values(counts).reduce((s, n) => s + n, 0) || 1;

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Avatar Breakdown</Text>
      <View style={styles.bar}>
        {(Object.keys(counts) as AvatarType[]).map((k) => {
          const pct = (counts[k] / total) * 100;
          return <View key={k} style={{ width: `${pct}%`, backgroundColor: COLORS[k], height: '100%' }} />;
        })}
      </View>
      {(Object.keys(counts) as AvatarType[]).map((k) => {
        const pct = ((counts[k] / total) * 100).toFixed(0);
        return (
          <Pressable key={k} style={styles.row} onPress={() => onFilter(k)}>
            <View style={[styles.swatch, { backgroundColor: COLORS[k] }]} />
            <Text style={styles.label}>{LABELS[k]}</Text>
            <Text style={styles.count}>
              {counts[k]} ({pct}%)
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginVertical: 10 },
  title: { color: '#FFD24A', fontWeight: '900', marginBottom: 10 },
  bar: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  swatch: { width: 12, height: 12, borderRadius: 3, marginRight: 8 },
  label: { color: '#E6E6E6', fontSize: 13, flex: 1 },
  count: { color: '#FFD24A', fontSize: 12, fontWeight: '700' },
});
