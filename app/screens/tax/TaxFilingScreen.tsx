import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import TaxSavingsCard from '../../components/tax/TaxSavingsCard';
import DepreciationTracker from '../../components/tax/DepreciationTracker';
import CostSegCard from '../../components/tax/CostSegCard';
import {
  calculateFederalTax,
  calculateDepreciation,
  calculateREPSOffset,
  calculateProfessionalCosts,
} from '../../engine/TaxEngine';
import { usePlayerStore } from '../../store/playerStore';
import type { OwnedProperty } from '../../types/tax';

interface Props {
  route?: { params?: { year?: number; properties?: OwnedProperty[] } };
  navigation: { navigate: (s: string, p?: any) => void };
}

const COST_SEG_ELIGIBLE = new Set(['large_mf', 'commercial', 'storage', 'hotel', 'car_wash']);

export default function TaxFilingScreen({ route, navigation }: Props) {
  const player = usePlayerStore((s) => s.player);
  const year = route?.params?.year ?? new Date().getFullYear();
  const properties = route?.params?.properties ?? [];

  const w2 = player?.w2_income ?? 0;
  const reps = player?.reps_status ?? false;
  const passiveIncome = 0;

  const dep = useMemo(() => calculateDepreciation(properties), [properties]);
  const before = useMemo(() => calculateFederalTax(w2), [w2]);
  const repsResult = useMemo(
    () => calculateREPSOffset(w2, dep.totalAnnualDepreciation, reps, passiveIncome),
    [w2, dep, reps, passiveIncome]
  );
  const after = useMemo(() => calculateFederalTax(repsResult.taxableIncome), [repsResult]);
  const savings = Math.max(0, before.federalTax - after.federalTax);
  const profCosts = calculateProfessionalCosts(properties.length, player?.llc_formed ?? false, reps);
  const netAfterCosts = savings - profCosts.total;

  const eligible = properties.filter((p) => COST_SEG_ELIGIBLE.has(p.asset_class));

  const onFile = () => {
    if (player) {
      usePlayerStore.getState().setPlayer({
        ...player,
        cash_balance: Math.max(0, player.cash_balance - profCosts.cpaCost),
        xp: player.xp + 200,
      });
    }
    navigation.navigate('MainTabs');
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.header}>Your {year} Tax Filing</Text>
      <Text style={styles.sub}>{player?.display_name ?? 'Player'} • Filing Year {year}</Text>

      <View style={[styles.card, styles.before]}>
        <Text style={styles.cardTitle}>Without Real Estate</Text>
        <Row label="W2 Income" value={`$${w2.toLocaleString()}`} />
        <Row label="Federal Tax Owed" value={`$${before.federalTax.toLocaleString()}`} red />
        <Row label="Effective Rate" value={`${before.effectiveRate.toFixed(1)}%`} />
      </View>

      <View style={[styles.card, styles.afterCard]}>
        <Text style={styles.cardTitle}>With Your Real Estate Portfolio</Text>
        <Row label="Total Depreciation" value={`$${dep.totalAnnualDepreciation.toLocaleString()}`} />
        <Row
          label="REPS Offset Applied"
          value={
            reps
              ? `$${repsResult.appliedOffset.toLocaleString()}`
              : 'Passive only — upgrade to REPS to unlock full offset'
          }
        />
        <Row label="Taxable Income" value={`$${repsResult.taxableIncome.toLocaleString()}`} />
        <Row label="Federal Tax Owed" value={`$${after.federalTax.toLocaleString()}`} green />
        <Row label="Effective Rate" value={`${after.effectiveRate.toFixed(1)}%`} />
      </View>

      <TaxSavingsCard
        taxSavings={savings}
        effectiveRateBefore={before.effectiveRate}
        effectiveRateAfter={after.effectiveRate}
      />

      <DepreciationTracker summary={dep} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Professional Costs</Text>
        <Row label="CPA Fee" value={`-$${profCosts.cpaCost.toLocaleString()}`} red />
        <Row label="Attorney/LLC" value={`-$${profCosts.attorneyAnnual.toLocaleString()}`} red />
        <Row label="Net after professional costs" value={`$${netAfterCosts.toLocaleString()}`} green />
      </View>

      {reps ? (
        <View style={[styles.card, styles.greenBadge]}>
          <Text style={styles.greenText}>✓ Real Estate Professional Status Active</Text>
          <Text style={styles.smallText}>Full depreciation offset applied against W2 income.</Text>
        </View>
      ) : (
        <View style={[styles.card, styles.orangeBadge]}>
          <Text style={styles.orangeText}>⚠️ REPS Not Active</Text>
          <Text style={styles.smallText}>
            You left ${(repsResult.unusedLosses * 0.32).toFixed(0)} on the table.
          </Text>
          <Pressable onPress={() => navigation.navigate('REPSQuest')}>
            <Text style={styles.linkText}>Learn how to activate REPS →</Text>
          </Pressable>
        </View>
      )}

      {eligible.length > 0 && (
        <View>
          <Text style={styles.section}>Cost Seg Opportunities</Text>
          {eligible.map((p) => (
            <CostSegCard key={p.id} property={p} onOrder={() => {}} />
          ))}
        </View>
      )}

      {repsResult.unusedLosses > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Carry Forward Losses</Text>
          <Text style={styles.smallText}>
            ${repsResult.unusedLosses.toLocaleString()} in unused losses carried forward. These offset future passive income or activate when you achieve REPS status.
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Next Year Projection</Text>
        <Text style={styles.smallText}>
          If you add 3 more properties next year: ~${Math.round(dep.totalAnnualDepreciation * 1.5).toLocaleString()} depreciation, ~${Math.round(savings * 1.5).toLocaleString()} tax savings.
        </Text>
        <Text style={styles.smallText}>Keep building. Every property works for you at tax time.</Text>
      </View>

      <Pressable style={styles.cta} onPress={onFile}>
        <Text style={styles.ctaText}>File My Taxes — ${profCosts.cpaCost} paid to CPA</Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({ label, value, red, green }: { label: string; value: string; red?: boolean; green?: boolean }) {
  const color = red ? '#F87171' : green ? '#4ADE80' : '#FFFFFF';
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  sub: { color: '#A8A8B3', marginTop: 4, marginBottom: 12 },
  card: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginVertical: 6 },
  before: { borderLeftWidth: 4, borderLeftColor: '#F87171' },
  afterCard: { borderLeftWidth: 4, borderLeftColor: '#4ADE80' },
  cardTitle: { color: '#FFD24A', fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { color: '#A8A8B3', fontSize: 13 },
  value: { fontWeight: '700', fontSize: 13 },
  greenBadge: { borderColor: '#4ADE80', borderWidth: 1 },
  orangeBadge: { borderColor: '#FBBF24', borderWidth: 1 },
  greenText: { color: '#4ADE80', fontWeight: '900' },
  orangeText: { color: '#FBBF24', fontWeight: '900' },
  smallText: { color: '#A8A8B3', fontSize: 12, marginTop: 4 },
  linkText: { color: '#FFD24A', fontWeight: '700', marginTop: 8 },
  section: { color: '#FFD24A', fontWeight: '900', fontSize: 16, marginTop: 12, marginBottom: 4 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  ctaText: { color: '#08080C', fontWeight: '900' },
});
