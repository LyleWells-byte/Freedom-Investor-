import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import LoanAmortizationChart from '../../components/capital/LoanAmortizationChart';
import { getLoanTier } from '../../engine/LoanEngine';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  route: { params: { tierId: string } };
  navigation: { navigate: (s: string, p?: any) => void };
}

export default function LoanDetailScreen({ route, navigation }: Props) {
  const tier = getLoanTier(route.params.tierId);
  const player = usePlayerStore((s) => s.player);

  if (!tier) {
    return (
      <View style={styles.root}>
        <Text style={styles.error}>Loan tier not found.</Text>
      </View>
    );
  }

  const totalRepayment = tier.monthlyPayment * tier.termMonths;
  const totalInterest = totalRepayment - tier.inGameCapital;
  const portfolioCF = 0;
  const newCF = portfolioCF - tier.monthlyPayment;
  const coverageBefore = portfolioCF;
  const coverageAfter = newCF;

  const deploymentSuggestion = suggestDeployment(player?.level ?? 1, tier.inGameCapital);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.header}>
        {tier.icon} {tier.name}
      </Text>
      <Text style={styles.sub}>
        ${tier.realPrice} → ${tier.inGameCapital.toLocaleString()} in-game capital
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Loan Terms</Text>
        <Row label="Loan Amount" value={`$${tier.inGameCapital.toLocaleString()}`} />
        <Row label="Annual Rate" value={`${(tier.annualRate * 100).toFixed(2)}%`} />
        <Row label="Term" value={`${tier.termMonths} months`} />
        <Row label="Monthly Payment" value={`$${tier.monthlyPayment.toLocaleString()}`} />
        <Row label="Total Interest" value={`$${Math.round(totalInterest).toLocaleString()}`} />
      </View>

      <LoanAmortizationChart
        principal={tier.inGameCapital}
        annualRate={tier.annualRate}
        termMonths={tier.termMonths}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Impact on Portfolio</Text>
        <Row label="Current monthly cashflow" value={`$${coverageBefore.toLocaleString()}`} />
        <Row label="New loan payment" value={`-$${tier.monthlyPayment.toLocaleString()}`} red />
        <Row
          label="New net cashflow"
          value={`$${coverageAfter.toLocaleString()}`}
          color={coverageAfter >= 0 ? '#4ADE80' : '#F87171'}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Why real investors use this</Text>
        <Text style={styles.blurb}>{tier.educationBlurb}</Text>
        <View style={styles.quote}>
          <Text style={styles.quoteText}>"{tier.realWorldAnalogy}"</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Deployment Suggestion</Text>
        <Text style={styles.blurb}>{deploymentSuggestion}</Text>
      </View>

      <Pressable
        style={styles.cta}
        onPress={() => navigation.navigate('LoanConfirm', { tierId: tier.id })}
      >
        <Text style={styles.ctaText}>Proceed to Checkout →</Text>
      </Pressable>
    </ScrollView>
  );
}

function suggestDeployment(level: number, capital: number): string {
  if (capital >= 500000) return 'This capital is sized for a multifamily acquisition. Check the B and C zone listings.';
  if (level <= 3) return 'Use this capital to purchase your first B-class property and start building cashflow immediately.';
  return 'Consider a BRRRR to recycle this capital across multiple deals.';
}

function Row({ label, value, red, color }: { label: string; value: string; red?: boolean; color?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, red && { color: '#F87171' }, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  sub: { color: '#FFD24A', marginVertical: 6, fontWeight: '700' },
  card: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginVertical: 6 },
  cardTitle: { color: '#FFD24A', fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rowLabel: { color: '#A8A8B3', fontSize: 13 },
  rowValue: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  blurb: { color: '#E6E6E6', fontSize: 13, lineHeight: 20 },
  quote: { borderLeftWidth: 3, borderLeftColor: '#FFD24A', paddingLeft: 12, marginTop: 10 },
  quoteText: { color: '#FFD24A', fontStyle: 'italic', fontSize: 13 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  ctaText: { color: '#08080C', fontWeight: '900', fontSize: 16 },
  error: { color: '#F87171', padding: 24 },
});
