import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  taxSavings: number;
  effectiveRateBefore: number;
  effectiveRateAfter: number;
}

export default function TaxSavingsCard({ taxSavings, effectiveRateBefore, effectiveRateAfter }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>You Saved</Text>
      <Text style={styles.amount}>${taxSavings.toLocaleString()}</Text>
      <Text style={styles.sub}>That money stays in your pocket. Not the IRS's.</Text>
      <View style={styles.row}>
        <Text style={styles.rate}>Before: {effectiveRateBefore.toFixed(1)}%</Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={[styles.rate, { color: '#4ADE80' }]}>After: {effectiveRateAfter.toFixed(1)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFD24A',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 12,
  },
  label: { color: '#08080C', fontWeight: '800', fontSize: 14, textTransform: 'uppercase' },
  amount: { color: '#08080C', fontSize: 48, fontWeight: '900', marginVertical: 6 },
  sub: { color: '#08080C', fontSize: 13, fontStyle: 'italic' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  rate: { color: '#08080C', fontWeight: '800', fontSize: 14, marginHorizontal: 8 },
  arrow: { color: '#08080C', fontSize: 16, fontWeight: '900' },
});
