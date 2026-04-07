import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import PurchaseCelebration from '../../components/purchase/PurchaseCelebration';
import { calculateMonthlyPayment } from '../../engine/MortgageEngine';
import { usePlayerStore } from '../../store/playerStore';
import type { MortgageOption } from '../../types/mortgage';
import type { PropertyListing } from '../../types/property';

interface Props {
  route: { params: { listing: PropertyListing; option: MortgageOption } };
  navigation: { navigate: (s: string, p?: any) => void; reset?: any };
}

export default function PurchaseConfirmScreen({ route, navigation }: Props) {
  const { listing, option } = route.params;
  const player = usePlayerStore((s) => s.player);
  const setPlayer = usePlayerStore((s) => s.setPlayer);
  const [closed, setClosed] = useState(false);

  const downPayment = Math.round(listing.purchase_price * option.downPaymentPercent);
  const loanAmount = listing.purchase_price - downPayment;
  const monthlyPayment = calculateMonthlyPayment(loanAmount, option.rate, option.termMonths);
  const annualDepreciation = Math.round((listing.purchase_price * 0.8) / 27.5);
  const annualTaxBenefit = Math.round(annualDepreciation * 0.32);

  const cash = player?.cash_balance ?? 0;
  const insufficient = downPayment > cash;
  const remaining = cash - downPayment;
  const lowReserves = remaining < 10000;

  const hasPrepay = option.type === 'dscr' || option.type === 'hard_money';
  const prepayYears = option.type === 'dscr' ? 3 : 0.5;
  const prepayPct = option.type === 'dscr' ? 3 : 2;
  const prepayAmount = Math.round(loanAmount * (prepayPct / 100));

  const onConfirm = () => {
    if (insufficient || !player) return;
    setPlayer({ ...player, cash_balance: remaining });
    setClosed(true);
  };

  if (closed) {
    return (
      <PurchaseCelebration
        listing={listing}
        monthlyCashflow={listing.projected_cashflow}
        newNetWorth={remaining + listing.purchase_price}
        isFirstDeal={true}
        onDone={() => navigation.navigate('MainTabs')}
      />
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.header}>Review & Confirm</Text>

      <View style={styles.summary}>
        <Text style={styles.address}>{listing.address}</Text>
        <Row label="Purchase Price" value={`$${listing.purchase_price.toLocaleString()}`} />
        <Row label="Loan Type" value={option.label} />
        <Row label="Down Payment" value={`$${downPayment.toLocaleString()}`} />
        <Row label="Monthly Payment" value={`$${monthlyPayment.toLocaleString()}`} />
        <Row label="Projected Cashflow" value={`$${listing.projected_cashflow.toLocaleString()}/mo`} />
        <Row label="Est. Annual Tax Benefit" value={`$${annualTaxBenefit.toLocaleString()}`} />
      </View>

      {hasPrepay && (
        <View style={styles.prepay}>
          <Text style={styles.prepayText}>
            ⚠️ Prepayment Penalty Active{'\n'}
            If you sell within {prepayYears} year(s) you'll owe {prepayPct}% of loan balance (~${prepayAmount.toLocaleString()}).
            Plan your exit strategy before you close.
          </Text>
        </View>
      )}

      {insufficient ? (
        <View style={styles.error}>
          <Text style={styles.errorText}>
            Insufficient funds. You need ${(downPayment - cash).toLocaleString()} more to close this deal.
            Visit the Capital Center to fund your next deal.
          </Text>
        </View>
      ) : (
        <View style={styles.ok}>
          <Text style={styles.okText}>After closing you will have ${remaining.toLocaleString()} remaining.</Text>
          {lowReserves && (
            <Text style={styles.lowText}>⚠️ Low reserves. Keep 3-6 months of expenses in cash at all times.</Text>
          )}
        </View>
      )}

      <Pressable
        style={[styles.cta, insufficient && styles.disabled]}
        disabled={insufficient}
        onPress={onConfirm}
      >
        <Text style={styles.ctaText}>Close This Deal 🔑</Text>
      </Pressable>
    </ScrollView>
  );
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
  header: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginBottom: 16 },
  summary: { backgroundColor: '#101018', padding: 16, borderRadius: 12 },
  address: { color: '#FFD24A', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  rowLabel: { color: '#A8A8B3', fontSize: 13 },
  rowValue: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  prepay: { backgroundColor: '#3A2F0A', padding: 12, borderRadius: 10, marginTop: 12 },
  prepayText: { color: '#FFD24A', fontSize: 12 },
  error: { backgroundColor: '#3B0E12', padding: 12, borderRadius: 10, marginTop: 12 },
  errorText: { color: '#F87171', fontSize: 13 },
  ok: { backgroundColor: '#0E2A1A', padding: 12, borderRadius: 10, marginTop: 12 },
  okText: { color: '#4ADE80', fontSize: 13, fontWeight: '700' },
  lowText: { color: '#FBBF24', fontSize: 12, marginTop: 6 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  disabled: { opacity: 0.4 },
  ctaText: { color: '#08080C', fontWeight: '900', fontSize: 16 },
});
