import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { LoanTier } from '../../types/loan';

interface Props {
  tier: LoanTier;
  onSelect: () => void;
}

export default function LoanTierCard({ tier, onSelect }: Props) {
  const prepayLabel = describePrepay(tier);
  return (
    <Pressable style={[styles.card, { borderColor: tier.color }]} onPress={onSelect}>
      <View style={styles.headerRow}>
        <View style={styles.left}>
          <Text style={styles.icon}>{tier.icon}</Text>
          <Text style={styles.name}>{tier.name}</Text>
          <View style={[styles.priceTag, { backgroundColor: tier.color }]}>
            <Text style={styles.priceText}>${tier.realPrice}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.capLabel}>In-Game</Text>
          <Text style={[styles.capValue, { color: tier.color }]}>
            ${tier.inGameCapital.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.chipRow}>
        <Chip label={`Rate ${(tier.annualRate * 100).toFixed(2)}%`} />
        <Chip label={`Term ${tier.termMonths}mo`} />
        <Chip label={`Prepay ${prepayLabel}`} />
      </View>

      <Text style={styles.blurb}>{tier.educationBlurb}</Text>

      <View style={[styles.cta, { backgroundColor: tier.color }]}>
        <Text style={styles.ctaText}>Fund My Portfolio →</Text>
      </View>
    </Pressable>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function describePrepay(t: LoanTier): string {
  const p = t.prepaySchedule as { type?: string };
  if (p.type === 'none') return 'None';
  if (p.type === 'short_term') return '<6mo';
  if (p.type === 'year_one') return '1yr';
  if (p.type === 'step_down') return '3-2-1';
  return '—';
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101018', borderWidth: 2, borderRadius: 16, padding: 16, marginBottom: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { fontSize: 28, marginRight: 8 },
  name: { color: '#FFFFFF', fontWeight: '800', fontSize: 15, flex: 1 },
  priceTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  priceText: { color: '#08080C', fontWeight: '900', fontSize: 12 },
  right: { alignItems: 'flex-end' },
  capLabel: { color: '#777', fontSize: 10 },
  capValue: { fontWeight: '900', fontSize: 22 },
  chipRow: { flexDirection: 'row', marginTop: 12 },
  chip: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#1A1A22', borderRadius: 6, marginRight: 6 },
  chipText: { color: '#E6E6E6', fontSize: 11, fontWeight: '700' },
  blurb: { color: '#A8A8B3', fontSize: 12, marginTop: 12, fontStyle: 'italic' },
  cta: { marginTop: 14, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  ctaText: { color: '#08080C', fontWeight: '900' },
});
