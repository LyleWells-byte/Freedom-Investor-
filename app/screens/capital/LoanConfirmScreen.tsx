import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { getLoanTier } from '../../engine/LoanEngine';
import { usePlayerStore } from '../../store/playerStore';
import type { ActiveLoan } from '../../types/loan';

interface Props {
  route: { params: { tierId: string } };
  navigation: { navigate: (s: string, p?: any) => void };
}

export default function LoanConfirmScreen({ route, navigation }: Props) {
  const tier = getLoanTier(route.params.tierId);
  const player = usePlayerStore((s) => s.player);
  const setPlayer = usePlayerStore((s) => s.setPlayer);
  const [processing, setProcessing] = useState(false);

  if (!tier) {
    return (
      <View style={styles.root}>
        <Text style={styles.err}>Loan tier not found.</Text>
      </View>
    );
  }

  const totalRepayment = Math.round(tier.monthlyPayment * tier.termMonths);
  const prepayLabel = describePrepay(tier.id);

  const handlePay = async () => {
    if (!player) return;
    setProcessing(true);
    try {
      // TODO: Stripe payment sheet
      // const result = await presentStripePaymentSheet(tier.stripeProductId)
      // if (!result.success) throw new Error('Payment cancelled')

      const newLoan: ActiveLoan = {
        id: `loan-${Date.now()}`,
        playerId: player.id,
        tierId: tier.id,
        principal: tier.inGameCapital,
        remainingBalance: tier.inGameCapital,
        annualRate: tier.annualRate,
        termMonths: tier.termMonths,
        monthsActive: 0,
        monthlyPayment: tier.monthlyPayment,
        nextPaymentDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        stripePaymentId: 'pi_simulated',
        status: 'current',
        originationDate: new Date().toISOString(),
      };

      // TODO: await supabase.from('loans').insert(newLoan)

      setPlayer({
        ...player,
        cash_balance: player.cash_balance + tier.inGameCapital,
        xp: player.xp + 200,
      });

      Alert.alert(
        '💰 Capital Deployed',
        `$${tier.inGameCapital.toLocaleString()} added to your portfolio.`,
        [{ text: 'OK', onPress: () => navigation.navigate('CapitalCenter') }]
      );
    } catch (e) {
      Alert.alert('Payment failed', 'Your portfolio is unchanged.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.header}>Review & Pay</Text>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Freedom Investor Capital Injection</Text>
        <Row label="Loan Type" value={tier.name} />
        <Row label="In-Game Capital" value={`$${tier.inGameCapital.toLocaleString()}`} />
        <Row label="Real Charge" value={`$${tier.realPrice}`} />
        <Row label="Monthly Payment" value={`$${tier.monthlyPayment.toLocaleString()}/mo × ${tier.termMonths}`} />
        <Row label="Total Repayment" value={`$${totalRepayment.toLocaleString()}`} />
        <Row label="Prepay Penalty" value={prepayLabel} />
      </View>

      <Text style={styles.disclaimer}>
        This is a real-money purchase that creates an in-game loan liability. Monthly payments will be automatically deducted from your in-game cashflow. Failure to maintain sufficient funds may result in forced asset liquidation within the game simulation. This is a game mechanic, not a real financial product.
      </Text>

      <Pressable style={styles.applePay} onPress={handlePay} disabled={processing}>
        <Text style={styles.applePayText}>{processing ? 'Processing…' : ' Pay'}</Text>
      </Pressable>
      <Pressable style={styles.cardBtn} onPress={handlePay} disabled={processing}>
        <Text style={styles.cardBtnText}>Pay with Card</Text>
      </Pressable>
    </ScrollView>
  );
}

function describePrepay(id: string): string {
  switch (id) {
    case 'heloc':
      return 'None';
    case 'hard_money':
      return '2% before month 6';
    case 'private_lender':
      return '1% during year 1';
    case 'institutional_loc':
      return '3-2-1 step down (years 1-3)';
    default:
      return '—';
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', marginBottom: 16 },
  summary: { backgroundColor: '#101018', borderWidth: 2, borderColor: '#FFD24A', padding: 16, borderRadius: 14 },
  summaryTitle: { color: '#FFD24A', fontWeight: '900', fontSize: 16, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  rowLabel: { color: '#A8A8B3', fontSize: 13 },
  rowValue: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  disclaimer: { color: '#777', fontSize: 11, marginTop: 14, lineHeight: 16 },
  applePay: { backgroundColor: '#FFFFFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  applePayText: { color: '#08080C', fontWeight: '900', fontSize: 16 },
  cardBtn: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  cardBtnText: { color: '#08080C', fontWeight: '900', fontSize: 16 },
  err: { color: '#F87171', padding: 24 },
});
