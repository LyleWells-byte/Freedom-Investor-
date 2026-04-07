import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import MortgageCard from '../../components/purchase/MortgageCard';
import { initializeMarketState } from '../../engine/MarketEngine';
import {
  calculateInsurance,
  calculatePropertyTax,
  calculateMonthlyPayment,
  calculateDSCR,
  MIN_DSCR_NORMAL,
} from '../../engine/MortgageEngine';
import type { MortgageOption, MortgageType } from '../../types/mortgage';
import type { PropertyListing } from '../../types/property';

interface Props {
  route: { params: { listing: PropertyListing } };
  navigation: { navigate: (s: string, p?: any) => void };
}

export default function MortgageSelectScreen({ route, navigation }: Props) {
  const { listing } = route.params;
  const [selected, setSelected] = useState<MortgageType | null>(null);
  const market = useMemo(() => initializeMarketState(), []);

  const options: MortgageOption[] = useMemo(
    () => [
      {
        type: 'conventional',
        label: 'Conventional 30yr',
        rate: market.rates.conventional_30yr,
        downPaymentPercent: 0.2,
        termMonths: 360,
        prepayPenaltySchedule: { type: 'none' },
        requiresDSCR: false,
        minDSCR: 0,
        bestFor: 'Long term holds, primary residence hack',
        educationBlurb: 'Traditional financing with the lowest rates available. Requires income verification and strong credit.',
      },
      {
        type: 'dscr',
        label: 'DSCR Loan',
        rate: market.rates.dscr,
        downPaymentPercent: 0.25,
        termMonths: 360,
        prepayPenaltySchedule: { type: 'step_down', schedule: [3, 2, 1] },
        requiresDSCR: true,
        minDSCR: MIN_DSCR_NORMAL,
        bestFor: 'Investors with multiple properties, no income verification needed',
        educationBlurb: 'Qualifies based on property cashflow, not your W2. Standard for serious investors building a portfolio.',
      },
      {
        type: 'hard_money',
        label: 'Hard Money',
        rate: market.rates.hard_money,
        downPaymentPercent: 0.15,
        termMonths: 12,
        prepayPenaltySchedule: { type: 'short_term', flatPercent: 0.02, monthsThreshold: 6 },
        requiresDSCR: false,
        minDSCR: 0,
        bestFor: 'Flips, BRRRR, fast close',
        educationBlurb: 'Short term, high rate — designed for speed. Get in, add value, refi or sell fast.',
      },
      {
        type: 'private_lender',
        label: 'Private Lender',
        rate: market.rates.private_lender,
        downPaymentPercent: 0.15,
        termMonths: 24,
        prepayPenaltySchedule: { type: 'year_one', flatPercent: 0.01 },
        requiresDSCR: false,
        minDSCR: 0,
        bestFor: 'Creative deals, relationship capital',
        educationBlurb: 'Borrowed from individuals, not banks. More flexible terms, faster close, relationship-driven.',
      },
      {
        type: 'cash',
        label: 'Cash',
        rate: 0,
        downPaymentPercent: 1,
        termMonths: 0,
        prepayPenaltySchedule: { type: 'none' },
        requiresDSCR: false,
        minDSCR: 0,
        bestFor: 'Highest cashflow, distressed deals, auction purchases',
        educationBlurb: 'Maximum cashflow and negotiating power. Ties up capital but eliminates financing risk.',
      },
    ],
    [market]
  );

  const monthlyExpenses =
    calculatePropertyTax(listing.purchase_price) + calculateInsurance(listing.purchase_price);

  const selectedOption = options.find((o) => o.type === selected);
  let dscrFails = false;
  if (selectedOption?.requiresDSCR) {
    const loanAmt = listing.purchase_price * (1 - selectedOption.downPaymentPercent);
    const pmt = calculateMonthlyPayment(loanAmt, selectedOption.rate, selectedOption.termMonths);
    const ratio = calculateDSCR(listing.projected_rent, 0.07, pmt, monthlyExpenses);
    dscrFails = ratio < selectedOption.minDSCR;
  }

  const onContinue = () => {
    if (!selectedOption || dscrFails) return;
    navigation.navigate('PurchaseConfirm', { listing, option: selectedOption });
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text style={styles.header}>How are you funding this deal?</Text>
      <Text style={styles.sub}>
        Choose wisely — each loan type has different costs, risks, and exit strategies.
      </Text>

      {options.map((o) => (
        <MortgageCard
          key={o.type}
          option={o}
          purchasePrice={listing.purchase_price}
          monthlyRent={listing.projected_rent}
          vacancyRate={0.07}
          monthlyExpenses={monthlyExpenses}
          selected={selected === o.type}
          onSelect={() => setSelected(o.type)}
        />
      ))}

      {dscrFails && (
        <View style={styles.warn}>
          <Text style={styles.warnText}>
            ⚠️ This property doesn't qualify for DSCR financing at current rent levels. Increase rent, reduce price, or choose a different loan type.
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.cta, (!selected || dscrFails) && styles.ctaDisabled]}
        onPress={onContinue}
        disabled={!selected || dscrFails}
      >
        <Text style={styles.ctaText}>Review and Confirm →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  sub: { color: '#A8A8B3', marginVertical: 10 },
  warn: { backgroundColor: '#3B0E12', padding: 12, borderRadius: 10, marginBottom: 12 },
  warnText: { color: '#F87171', fontSize: 13, fontWeight: '600' },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: '#08080C', fontWeight: '900', fontSize: 16 },
});
