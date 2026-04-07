import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import DSCRCalculator from './DSCRCalculator';
import { calculateMonthlyPayment } from '../../engine/MortgageEngine';
import type { MortgageOption } from '../../types/mortgage';

interface Props {
  option: MortgageOption;
  purchasePrice: number;
  monthlyRent: number;
  vacancyRate: number;
  monthlyExpenses: number;
  selected: boolean;
  onSelect: () => void;
}

const ICON: Record<string, string> = {
  conventional: '🏦',
  dscr: '📊',
  hard_money: '⚡',
  private_lender: '🤝',
  cash: '💵',
};

export default function MortgageCard({
  option,
  purchasePrice,
  monthlyRent,
  vacancyRate,
  monthlyExpenses,
  selected,
  onSelect,
}: Props) {
  const downPayment = Math.round(purchasePrice * option.downPaymentPercent);
  const loanAmount = purchasePrice - downPayment;
  const monthlyPayment = calculateMonthlyPayment(loanAmount, option.rate, option.termMonths);

  const prepayLabel = describePrepay(option);

  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onSelect}
    >
      <View style={styles.headerRow}>
        <Text style={styles.icon}>{ICON[option.type]}</Text>
        <Text style={styles.title}>{option.label}</Text>
        <Text style={styles.rate}>{option.rate.toFixed(2)}%</Text>
      </View>

      <View style={styles.statRow}>
        <Stat label="Down" value={`${Math.round(option.downPaymentPercent * 100)}%`} sub={`$${downPayment.toLocaleString()}`} />
        <Stat label="Payment" value={`$${monthlyPayment.toLocaleString()}/mo`} />
        <Stat label="Term" value={`${option.termMonths / 12}y`} />
      </View>

      <Text style={styles.prepay}>Prepay: {prepayLabel}</Text>
      <Text style={styles.bestFor}>Best for: {option.bestFor}</Text>
      <Text style={styles.blurb}>{option.educationBlurb}</Text>

      {option.requiresDSCR && (
        <DSCRCalculator
          monthlyRent={monthlyRent}
          vacancyRate={vacancyRate}
          monthlyPayment={monthlyPayment}
          monthlyExpenses={monthlyExpenses}
          minDSCR={option.minDSCR}
        />
      )}

      <View style={[styles.selectBtn, selected && styles.selectBtnOn]}>
        <Text style={[styles.selectText, selected && styles.selectTextOn]}>
          {selected ? 'Selected ✓' : 'Select'}
        </Text>
      </View>
    </Pressable>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

function describePrepay(o: MortgageOption): string {
  const p = o.prepayPenaltySchedule;
  if (p.type === 'none') return 'None';
  if (p.type === 'step_down') return '3-2-1 step down';
  if (p.type === 'short_term') return `${(p.flatPercent ?? 0) * 100}% before 6 mo`;
  if (p.type === 'year_one') return `${(p.flatPercent ?? 0) * 100}% year 1`;
  return 'See terms';
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101018', padding: 16, borderRadius: 14, borderWidth: 2, borderColor: '#222', marginBottom: 14 },
  cardSelected: { borderColor: '#FFD24A' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 24 },
  title: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, marginLeft: 8, flex: 1 },
  rate: { color: '#FFD24A', fontWeight: '900', fontSize: 18 },
  statRow: { flexDirection: 'row', marginTop: 10 },
  stat: { flex: 1 },
  statLabel: { color: '#777', fontSize: 11 },
  statValue: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  statSub: { color: '#A8A8B3', fontSize: 11 },
  prepay: { color: '#A8A8B3', fontSize: 12, marginTop: 8 },
  bestFor: { color: '#E6E6E6', fontSize: 12, marginTop: 4 },
  blurb: { color: '#777', fontSize: 12, marginTop: 6, fontStyle: 'italic' },
  selectBtn: { marginTop: 12, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: '#1A1A22' },
  selectBtnOn: { backgroundColor: '#FFD24A' },
  selectText: { color: '#E6E6E6', fontWeight: '800' },
  selectTextOn: { color: '#08080C' },
});
