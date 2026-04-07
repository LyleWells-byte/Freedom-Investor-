import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { SyndicationDeal } from '../../types/clan';

interface Props {
  deal: SyndicationDeal;
  yourInvestment?: number;
  onInvest: () => void;
}

export default function SyndicationDealCard({ deal, yourInvestment, onInvest }: Props) {
  const pct = (deal.raisedSoFar / deal.targetRaise) * 100;
  const yourEquity = yourInvestment ? (yourInvestment / deal.targetRaise) * 100 : 0;
  return (
    <View style={styles.card}>
      <Text style={styles.address}>{deal.propertyAddress}</Text>
      <Text style={styles.price}>${deal.purchasePrice.toLocaleString()}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.stat}>
        ${deal.raisedSoFar.toLocaleString()} of ${deal.targetRaise.toLocaleString()} raised
      </Text>
      <Text style={styles.stat}>
        {deal.currentInvestors} of {deal.maxInvestors} investor spots filled
      </Text>
      <Text style={styles.stat}>Min buy-in: ${deal.minimumBuyIn.toLocaleString()}</Text>
      <Text style={styles.stat}>Projected: ${deal.monthlyDistribution}/mo</Text>
      {yourInvestment ? (
        <Text style={styles.yours}>
          You: ${yourInvestment.toLocaleString()} ({yourEquity.toFixed(1)}%)
        </Text>
      ) : (
        <Pressable style={styles.btn} onPress={onInvest}>
          <Text style={styles.btnText}>Invest Now</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#FFD24A' },
  address: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  price: { color: '#FFD24A', fontWeight: '900', fontSize: 20, marginTop: 4 },
  barBg: { height: 8, backgroundColor: '#222', borderRadius: 4, marginVertical: 8, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#4ADE80' },
  stat: { color: '#A8A8B3', fontSize: 12, marginVertical: 2 },
  yours: { color: '#4ADE80', marginTop: 8, fontWeight: '800' },
  btn: { marginTop: 10, backgroundColor: '#FFD24A', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#08080C', fontWeight: '900' },
});
