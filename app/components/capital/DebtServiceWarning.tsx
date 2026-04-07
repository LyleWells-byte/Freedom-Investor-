import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DebtServiceStatus } from '../../types/loan';

export default function DebtServiceWarning({
  status,
  monthlyCashflow,
}: {
  status: DebtServiceStatus;
  monthlyCashflow: number;
}) {
  const color =
    status.status === 'healthy' ? '#4ADE80' : status.status === 'warning' ? '#FBBF24' : '#F87171';
  return (
    <View style={[styles.box, { borderColor: color }]}>
      <Text style={[styles.title, { color }]}>
        Debt Coverage: {status.coverageRatio}x ({status.status.toUpperCase()})
      </Text>
      <Text style={styles.line}>Monthly loan payments: ${status.totalDebtService.toLocaleString()}</Text>
      <Text style={styles.line}>Net cashflow: ${monthlyCashflow.toLocaleString()}</Text>
      {status.status !== 'healthy' && (
        <Text style={[styles.warn, { color }]}>⚠️ {status.recommendation}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#101018', borderWidth: 2, padding: 14, borderRadius: 12, marginBottom: 12 },
  title: { fontWeight: '900', fontSize: 16, marginBottom: 6 },
  line: { color: '#A8A8B3', fontSize: 12, marginVertical: 2 },
  warn: { fontSize: 12, marginTop: 6, fontWeight: '700' },
});
