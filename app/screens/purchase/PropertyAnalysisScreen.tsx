import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import CashflowCalculator from '../../components/purchase/CashflowCalculator';
import { calculateMonthlyPayment } from '../../engine/MortgageEngine';
import type { PropertyListing } from '../../types/property';

interface Props {
  route: { params: { listing: PropertyListing } };
  navigation: { navigate: (s: string, p?: any) => void };
}

export default function PropertyAnalysisScreen({ route, navigation }: Props) {
  const { listing } = route.params;
  const downPayment = listing.purchase_price * 0.25;
  const loanAmount = listing.purchase_price - downPayment;
  const estPayment = calculateMonthlyPayment(loanAmount, 7.5, 360);

  const insight = educationInsight(listing);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.address}>{listing.address}</Text>
      <View style={styles.badgeRow}>
        <Badge text={`${listing.neighborhood_class}-Class`} />
        <Badge text={listing.asset_class.toUpperCase()} />
        <Text style={styles.dom}>{listing.days_on_market}d on market</Text>
      </View>
      <Text style={styles.stars}>{'★'.repeat(listing.condition_rating)}{'☆'.repeat(5 - listing.condition_rating)}</Text>

      <View style={styles.grid}>
        <Metric label="Purchase Price" value={`$${listing.purchase_price.toLocaleString()}`} />
        <Metric label="Est. Monthly Rent" value={`$${listing.projected_rent.toLocaleString()}`} />
        <Metric
          label="Est. Monthly CF"
          value={`$${listing.projected_cashflow.toLocaleString()}`}
          color={listing.projected_cashflow >= 0 ? '#4ADE80' : '#F87171'}
        />
        <Metric label="Cash on Cash" value={`${listing.cash_on_cash_return}%`} />
      </View>

      <Text style={styles.section}>Cashflow Breakdown</Text>
      <CashflowCalculator
        purchasePrice={listing.purchase_price}
        monthlyRent={listing.projected_rent}
        monthlyPayment={estPayment}
        vacancyRate={0.07}
        downPayment={downPayment}
      />

      <Text style={styles.section}>Market Context</Text>
      <View style={styles.context}>
        <Text style={styles.contextLine}>Phase: Expansion</Text>
        <Text style={styles.contextLine}>Zone vacancy: 7%</Text>
        <Text style={styles.contextLine}>Rate environment: Conventional 6.5% / DSCR 7.5%</Text>
      </View>

      <View style={styles.insightBox}>
        <Text style={styles.insightTitle}>💡 Pro Tip</Text>
        <Text style={styles.insightText}>{insight}</Text>
      </View>

      <Pressable
        style={styles.cta}
        onPress={() => navigation.navigate('MortgageSelect', { listing })}
      >
        <Text style={styles.ctaText}>Choose Your Financing →</Text>
      </Pressable>
    </ScrollView>
  );
}

function educationInsight(l: PropertyListing): string {
  if (l.asset_class === 'brrrr') {
    const arv = Math.round(l.purchase_price * 1.35);
    const recovered = Math.round(arv * 0.75);
    return `After rehab, target ARV of $${arv.toLocaleString()}. At 75% LTV cash-out refi you recover $${recovered.toLocaleString()} of your capital.`;
  }
  if (l.asset_class === 'flip') {
    const profit = Math.round(l.purchase_price * 0.18);
    return `Profit estimate after rehab + selling costs: $${profit.toLocaleString()}. Hold time: ~4 months.`;
  }
  if (l.asset_class === 'str') {
    return `At 65% occupancy and $${Math.round(l.projected_rent / 15)} ADR your gross revenue is ${Math.round(l.projected_rent * 1.6)}/mo. Factor in 3% platform fees and cleaning costs.`;
  }
  return 'Long-term holds are won by buying right and managing well. Stress-test your numbers before you sign.';
}

function Badge({ text }: { text: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  address: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  badge: { backgroundColor: '#FFD24A', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 8 },
  badgeText: { color: '#08080C', fontSize: 11, fontWeight: '900' },
  dom: { color: '#777', fontSize: 12 },
  stars: { color: '#FFD24A', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 },
  metric: { width: '48%', backgroundColor: '#101018', padding: 14, borderRadius: 12, marginRight: '2%', marginBottom: 10 },
  metricLabel: { color: '#777', fontSize: 12 },
  metricValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', marginTop: 4 },
  section: { color: '#FFD24A', fontSize: 16, fontWeight: '800', marginTop: 16 },
  context: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginTop: 8 },
  contextLine: { color: '#A8A8B3', fontSize: 13, marginVertical: 2 },
  insightBox: { backgroundColor: '#1A1A22', padding: 14, borderRadius: 12, marginTop: 12 },
  insightTitle: { color: '#FFD24A', fontWeight: '800', marginBottom: 4 },
  insightText: { color: '#E6E6E6', fontSize: 13 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  ctaText: { color: '#08080C', fontWeight: '900', fontSize: 16 },
});
