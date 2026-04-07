import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  principal: number;
  annualRate: number;
  termMonths: number;
  prepayExpiresMonth?: number;
}

export default function LoanAmortizationChart({
  principal,
  annualRate,
  termMonths,
  prepayExpiresMonth,
}: Props) {
  const schedule = useMemo(() => buildSchedule(principal, annualRate, termMonths), [principal, annualRate, termMonths]);
  const maxPmt = Math.max(...schedule.map((s) => s.principal + s.interest));
  // Sample down to ~12 bars for display
  const step = Math.max(1, Math.floor(schedule.length / 12));
  const sampled = schedule.filter((_, i) => i % step === 0).slice(0, 12);

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Amortization</Text>
      <View style={styles.chart}>
        {sampled.map((row, i) => {
          const totalH = ((row.principal + row.interest) / maxPmt) * 100;
          const principalH = (row.principal / (row.principal + row.interest)) * totalH;
          return (
            <View key={i} style={styles.barCol}>
              <View style={[styles.barTotal, { height: `${totalH}%` }]}>
                <View style={[styles.barPrincipal, { height: `${principalH / totalH * 100}%` }]} />
              </View>
              <Text style={styles.label}>M{row.month}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legendRow}>
        <Legend color="#FFD24A" label="Principal" />
        <Legend color="#4A90E2" label="Interest" />
        {prepayExpiresMonth && (
          <Text style={styles.prepay}>Prepay clears @ M{prepayExpiresMonth}</Text>
        )}
      </View>
    </View>
  );
}

function buildSchedule(principal: number, annualRate: number, termMonths: number) {
  const r = annualRate / 12;
  const pmt = (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);
  let bal = principal;
  const out: { month: number; principal: number; interest: number; balance: number }[] = [];
  for (let m = 1; m <= termMonths; m++) {
    const interest = bal * r;
    const prin = pmt - interest;
    bal = Math.max(0, bal - prin);
    out.push({ month: m, principal: prin, interest, balance: bal });
  }
  return out;
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legend}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginVertical: 8 },
  title: { color: '#FFD24A', fontWeight: '800', marginBottom: 10 },
  chart: { flexDirection: 'row', height: 120, alignItems: 'flex-end', justifyContent: 'space-between' },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end', marginHorizontal: 1 },
  barTotal: { width: '70%', backgroundColor: '#4A90E2', justifyContent: 'flex-end', borderRadius: 2 },
  barPrincipal: { width: '100%', backgroundColor: '#FFD24A' },
  label: { color: '#777', fontSize: 9, marginTop: 2 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  legend: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  swatch: { width: 10, height: 10, borderRadius: 2, marginRight: 4 },
  legendText: { color: '#A8A8B3', fontSize: 11 },
  prepay: { color: '#FFD24A', fontSize: 10, marginLeft: 'auto', fontStyle: 'italic' },
});
