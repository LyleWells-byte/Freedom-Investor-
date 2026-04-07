import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import {
  calculateCashflow,
  calculatePropertyTax,
  calculateInsurance,
} from '../../engine/MortgageEngine';
import type { CashflowBreakdown } from '../../types/mortgage';

interface Props {
  purchasePrice: number;
  monthlyRent: number;
  monthlyPayment: number;
  vacancyRate: number;
  downPayment: number;
  onChange?: (cf: CashflowBreakdown) => void;
}

export default function CashflowCalculator({
  purchasePrice,
  monthlyRent,
  monthlyPayment,
  vacancyRate,
  downPayment,
  onChange,
}: Props) {
  const [selfManage, setSelfManage] = useState(false);

  const cf = useMemo(() => {
    const tax = calculatePropertyTax(purchasePrice);
    const ins = calculateInsurance(purchasePrice);
    const mgmtRate = selfManage ? 0 : 0.08;
    const maint = Math.round(monthlyRent * 0.05);
    const capex = Math.round(monthlyRent * 0.05);
    const result = calculateCashflow(
      monthlyRent,
      vacancyRate,
      monthlyPayment,
      tax,
      ins,
      mgmtRate,
      maint,
      capex,
      downPayment
    );
    onChange?.(result);
    return result;
  }, [purchasePrice, monthlyRent, monthlyPayment, vacancyRate, downPayment, selfManage, onChange]);

  return (
    <View style={styles.box}>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{selfManage ? 'Self Manage' : 'Hire Manager'}</Text>
        <Switch value={selfManage} onValueChange={setSelfManage} />
      </View>

      <Line label="Gross Rent" value={cf.grossRent} />
      <Line label={`Vacancy (${Math.round(vacancyRate * 100)}%)`} value={-cf.vacancyLoss} />
      <Line label="Effective Income" value={cf.effectiveGrossIncome} bold />
      <Line label="Mortgage P&I" value={-cf.mortgage} />
      <Line label="Property Tax" value={-cf.propertyTax} />
      <Line label="Insurance" value={-cf.insurance} />
      <Line label="Property Mgmt" value={-cf.propertyManagement} />
      <Line label="Maintenance Reserve" value={-cf.maintenanceReserve} />
      <Line label="CapEx Reserve" value={-cf.capexReserve} />
      <View style={styles.divider} />
      <View style={styles.netRow}>
        <Text style={styles.netLabel}>Net Cashflow</Text>
        <Text style={[styles.netValue, { color: cf.netCashflow >= 0 ? '#4ADE80' : '#F87171' }]}>
          ${cf.netCashflow.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

function Line({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <View style={styles.line}>
      <Text style={[styles.lineLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.lineValue, bold && styles.bold, value < 0 && { color: '#F87171' }]}>
        ${value.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#101018', padding: 16, borderRadius: 12, marginVertical: 12 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  toggleLabel: { color: '#FFD24A', fontWeight: '700' },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  lineLabel: { color: '#A8A8B3', fontSize: 13 },
  lineValue: { color: '#E6E6E6', fontSize: 13 },
  bold: { fontWeight: '800', color: '#FFFFFF' },
  divider: { height: 1, backgroundColor: '#2A2A35', marginVertical: 8 },
  netRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  netLabel: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  netValue: { fontWeight: '900', fontSize: 22 },
});
