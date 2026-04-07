import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import LoanTierCard from '../../components/capital/LoanTierCard';
import DebtServiceWarning from '../../components/capital/DebtServiceWarning';
import { LOAN_TIERS, checkDebtServiceCoverage } from '../../engine/LoanEngine';
import { usePlayerStore } from '../../store/playerStore';
import type { ActiveLoan } from '../../types/loan';

interface Props {
  navigation: { navigate: (s: string, p?: any) => void };
}

export default function CapitalCenterScreen({ navigation }: Props) {
  const player = usePlayerStore((s) => s.player);
  const activeLoans: ActiveLoan[] = []; // TODO: load from store/Supabase
  const monthlyCashflow = 0;

  const debtStatus = checkDebtServiceCoverage(
    monthlyCashflow,
    player?.cash_balance ?? 0,
    activeLoans.map((l) => l.monthlyPayment)
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.header}>Capital Center</Text>
      <Text style={styles.sub}>Leverage is the investor's greatest tool. Use it wisely.</Text>

      <DebtServiceWarning status={debtStatus} monthlyCashflow={monthlyCashflow} />

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Active Loans</Text>
          <Pressable onPress={() => navigation.navigate('ActiveLoans')}>
            <Text style={styles.link}>View All →</Text>
          </Pressable>
        </View>
        {activeLoans.length === 0 ? (
          <Text style={styles.empty}>No active loans. Use leverage strategically.</Text>
        ) : (
          activeLoans.map((l) => (
            <View key={l.id} style={styles.loanRow}>
              <Text style={styles.loanType}>{l.tierId}</Text>
              <Text style={styles.loanBalance}>${l.remainingBalance.toLocaleString()}</Text>
            </View>
          ))
        )}
      </View>

      <Text style={styles.sectionTitle}>Available Capital</Text>
      {LOAN_TIERS.map((tier) => (
        <LoanTierCard
          key={tier.id}
          tier={tier}
          onSelect={() => navigation.navigate('LoanDetail', { tierId: tier.id })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 28, fontWeight: '900' },
  sub: { color: '#A8A8B3', marginVertical: 8 },
  section: { marginVertical: 12 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: '#FFD24A', fontWeight: '900', fontSize: 16, marginVertical: 8 },
  link: { color: '#FFD24A', fontSize: 12, fontWeight: '700' },
  empty: { color: '#777', fontStyle: 'italic', fontSize: 13 },
  loanRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#101018', padding: 12, borderRadius: 10, marginBottom: 6 },
  loanType: { color: '#E6E6E6', fontWeight: '700' },
  loanBalance: { color: '#FFD24A', fontWeight: '800' },
});
