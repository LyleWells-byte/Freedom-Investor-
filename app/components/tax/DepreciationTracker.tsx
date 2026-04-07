import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { DepreciationSummary } from '../../types/tax';

export default function DepreciationTracker({ summary }: { summary: DepreciationSummary }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.box}>
      <Pressable onPress={() => setOpen((o) => !o)}>
        <View style={styles.headRow}>
          <Text style={styles.title}>Depreciation Breakdown</Text>
          <Text style={styles.total}>${summary.totalAnnualDepreciation.toLocaleString()}</Text>
        </View>
      </Pressable>
      {open &&
        summary.byProperty.map((p) => (
          <View key={p.propertyId} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.addr}>{p.address}</Text>
              <Text style={styles.meta}>
                {p.depreciationSchedule} • {p.monthsHeld}mo held
              </Text>
            </View>
            <Text style={styles.amount}>${p.proratedDepreciation.toLocaleString()}</Text>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginVertical: 8 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#FFFFFF', fontWeight: '800' },
  total: { color: '#4ADE80', fontWeight: '900', fontSize: 18 },
  row: { flexDirection: 'row', paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#1A1A22', marginTop: 6 },
  addr: { color: '#E6E6E6', fontSize: 13 },
  meta: { color: '#777', fontSize: 11 },
  amount: { color: '#4ADE80', fontWeight: '800' },
});
