import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateDSCR, MIN_DSCR_NORMAL } from '../../engine/MortgageEngine';

interface Props {
  monthlyRent: number;
  vacancyRate: number;
  monthlyPayment: number;
  monthlyExpenses: number;
  minDSCR?: number;
}

export default function DSCRCalculator({
  monthlyRent,
  vacancyRate,
  monthlyPayment,
  monthlyExpenses,
  minDSCR = MIN_DSCR_NORMAL,
}: Props) {
  const ratio = calculateDSCR(monthlyRent, vacancyRate, monthlyPayment, monthlyExpenses);
  const qualified = ratio >= minDSCR;

  return (
    <View style={styles.box}>
      <Text style={styles.label}>DSCR Ratio</Text>
      <Text style={[styles.ratio, { color: qualified ? '#4ADE80' : '#F87171' }]}>
        {ratio.toFixed(2)} {qualified ? '✓' : '✗'}
      </Text>
      <Text style={styles.minimum}>Minimum required: {minDSCR.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 12, backgroundColor: '#0A0A10', borderRadius: 10, marginTop: 8 },
  label: { color: '#A8A8B3', fontSize: 12 },
  ratio: { fontSize: 24, fontWeight: '900', marginTop: 2 },
  minimum: { color: '#777', fontSize: 11, marginTop: 2 },
});
