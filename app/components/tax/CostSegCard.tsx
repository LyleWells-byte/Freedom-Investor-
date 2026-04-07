import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { calculateCostSegBenefit } from '../../engine/TaxEngine';
import type { OwnedProperty } from '../../types/tax';

interface Props {
  property: OwnedProperty;
  studyCost?: number;
  onOrder: (property: OwnedProperty, cost: number) => void;
}

export default function CostSegCard({ property, studyCost = 4500, onOrder }: Props) {
  const result = calculateCostSegBenefit(property, studyCost);
  return (
    <View style={styles.card}>
      <Text style={styles.address}>{property.address}</Text>
      <Row label="Study cost" value={`$${result.studyCost.toLocaleString()}`} />
      <Row label="First-year bonus depreciation" value={`$${result.firstYearBonus.toLocaleString()}`} />
      <Row
        label="Net benefit"
        value={`$${result.netBenefit.toLocaleString()}`}
        color={result.netBenefit >= 0 ? '#4ADE80' : '#F87171'}
      />
      <Pressable style={styles.btn} onPress={() => onOrder(property, studyCost)}>
        <Text style={styles.btnText}>Order Cost Seg Study</Text>
      </Pressable>
    </View>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginVertical: 6 },
  address: { color: '#FFD24A', fontWeight: '800', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  label: { color: '#A8A8B3', fontSize: 12 },
  value: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  btn: { marginTop: 10, backgroundColor: '#FFD24A', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#08080C', fontWeight: '900' },
});
