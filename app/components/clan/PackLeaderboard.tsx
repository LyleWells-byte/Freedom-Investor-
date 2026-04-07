import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';

type Metric = 'net_worth' | 'cashflow' | 'properties' | 'tax_savings' | 'flip_profits';

interface Entry {
  rank: number;
  playerName: string;
  value: number;
  delta: number;
}

interface Props {
  entries: Record<Metric, Entry[]>;
  globalRank?: number;
}

const LABELS: Record<Metric, string> = {
  net_worth: 'Net Worth',
  cashflow: 'Cashflow',
  properties: 'Properties',
  tax_savings: 'Tax Savings',
  flip_profits: 'Flip Profits',
};

export default function PackLeaderboard({ entries, globalRank }: Props) {
  const [metric, setMetric] = useState<Metric>('cashflow');
  const list = entries[metric] ?? [];

  return (
    <View style={styles.root}>
      <View style={styles.tabs}>
        {(Object.keys(LABELS) as Metric[]).map((m) => (
          <Pressable key={m} style={[styles.tab, metric === m && styles.tabOn]} onPress={() => setMetric(m)}>
            <Text style={[styles.tabText, metric === m && styles.tabTextOn]}>{LABELS[m]}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={list}
        keyExtractor={(e) => `${e.rank}`}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{item.rank === 1 ? '👑' : `#${item.rank}`}</Text>
            <Text style={styles.name}>{item.playerName}</Text>
            <Text style={styles.value}>${item.value.toLocaleString()}</Text>
            <Text style={[styles.delta, { color: item.delta >= 0 ? '#4ADE80' : '#F87171' }]}>
              {item.delta >= 0 ? '↑' : '↓'} {Math.abs(item.delta)}
            </Text>
          </View>
        )}
      />

      {globalRank && (
        <Text style={styles.global}>Your pack is ranked #{globalRank} globally by total monthly cashflow</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  tab: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#101018', borderRadius: 12, marginRight: 6, marginBottom: 6 },
  tabOn: { backgroundColor: '#FFD24A' },
  tabText: { color: '#A8A8B3', fontSize: 11, fontWeight: '700' },
  tabTextOn: { color: '#08080C' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101018', padding: 10, borderRadius: 8, marginBottom: 6 },
  rank: { color: '#FFD24A', fontWeight: '900', width: 40 },
  name: { color: '#FFFFFF', fontWeight: '700', flex: 1 },
  value: { color: '#FFFFFF', marginRight: 8 },
  delta: { fontWeight: '700', fontSize: 12 },
  global: { color: '#FFD24A', textAlign: 'center', marginTop: 12, fontStyle: 'italic' },
});
