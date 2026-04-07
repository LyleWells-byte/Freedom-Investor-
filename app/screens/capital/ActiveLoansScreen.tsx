import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Modal, Alert } from 'react-native';
import { calculatePrepayPenalty, getLoanTier } from '../../engine/LoanEngine';
import { usePlayerStore } from '../../store/playerStore';
import type { ActiveLoan } from '../../types/loan';

export default function ActiveLoansScreen() {
  const player = usePlayerStore((s) => s.player);
  const setPlayer = usePlayerStore((s) => s.setPlayer);
  const [loans, setLoans] = useState<ActiveLoan[]>([]); // TODO: load from Supabase
  const [payoffLoan, setPayoffLoan] = useState<ActiveLoan | null>(null);

  const confirmPayoff = () => {
    if (!payoffLoan || !player) return;
    const penalty = calculatePrepayPenalty(
      payoffLoan.tierId,
      payoffLoan.monthsActive,
      payoffLoan.remainingBalance
    );
    const total = payoffLoan.remainingBalance + penalty;
    if (player.cash_balance < total) {
      Alert.alert('Insufficient cash', `You need $${Math.round(total).toLocaleString()} to pay off this loan.`);
      return;
    }
    setPlayer({ ...player, cash_balance: player.cash_balance - total, xp: player.xp + 300 });
    setLoans((ls) => ls.filter((l) => l.id !== payoffLoan.id));
    setPayoffLoan(null);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.header}>Active Loans</Text>

      {loans.length === 0 ? (
        <Text style={styles.empty}>No active loans.</Text>
      ) : (
        loans.map((l) => {
          const tier = getLoanTier(l.tierId);
          const pct = ((l.principal - l.remainingBalance) / l.principal) * 100;
          const penalty = calculatePrepayPenalty(l.tierId, l.monthsActive, l.remainingBalance);
          return (
            <View key={l.id} style={[styles.card, { borderColor: tier?.color ?? '#222' }]}>
              <Text style={styles.name}>{tier?.name}</Text>
              <Row label="Original" value={`$${l.principal.toLocaleString()}`} />
              <Row label="Remaining" value={`$${Math.round(l.remainingBalance).toLocaleString()}`} />
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` }]} />
              </View>
              <Row label="Monthly Payment" value={`$${l.monthlyPayment.toLocaleString()}`} />
              <Row label="Months Remaining" value={`${Math.max(0, l.termMonths - l.monthsActive)}`} />
              <Row
                label="Prepay Penalty"
                value={penalty > 0 ? `$${Math.round(penalty).toLocaleString()}` : 'Expired — none'}
              />
              <Row label="Status" value={l.status.toUpperCase()} />
              <Pressable style={styles.payoffBtn} onPress={() => setPayoffLoan(l)}>
                <Text style={styles.payoffText}>Pay Off Early</Text>
              </Pressable>
            </View>
          );
        })
      )}

      <Modal visible={!!payoffLoan} transparent animationType="fade">
        <View style={styles.modalRoot}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Early Payoff Summary</Text>
            {payoffLoan && (
              <>
                <Row label="Remaining Balance" value={`$${Math.round(payoffLoan.remainingBalance).toLocaleString()}`} />
                <Row
                  label="Prepay Penalty"
                  value={`$${Math.round(
                    calculatePrepayPenalty(payoffLoan.tierId, payoffLoan.monthsActive, payoffLoan.remainingBalance)
                  ).toLocaleString()}`}
                />
                <Row
                  label="Total to Pay Off"
                  value={`$${Math.round(
                    payoffLoan.remainingBalance +
                      calculatePrepayPenalty(payoffLoan.tierId, payoffLoan.monthsActive, payoffLoan.remainingBalance)
                  ).toLocaleString()}`}
                />
                <Pressable style={styles.confirm} onPress={confirmPayoff}>
                  <Text style={styles.confirmText}>Confirm Payoff</Text>
                </Pressable>
                <Pressable onPress={() => setPayoffLoan(null)}>
                  <Text style={styles.cancel}>Cancel</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  header: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', marginBottom: 12 },
  empty: { color: '#777', fontStyle: 'italic' },
  card: { backgroundColor: '#101018', padding: 14, borderRadius: 12, borderWidth: 2, marginBottom: 12 },
  name: { color: '#FFD24A', fontWeight: '900', fontSize: 16, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  rowLabel: { color: '#A8A8B3', fontSize: 13 },
  rowValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  barBg: { height: 6, backgroundColor: '#222', borderRadius: 3, marginVertical: 8, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#4ADE80' },
  payoffBtn: { marginTop: 10, backgroundColor: '#FFD24A', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  payoffText: { color: '#08080C', fontWeight: '900' },
  modalRoot: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#101018', padding: 24, borderRadius: 16 },
  modalTitle: { color: '#FFD24A', fontWeight: '900', fontSize: 18, marginBottom: 12 },
  confirm: { backgroundColor: '#FFD24A', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  confirmText: { color: '#08080C', fontWeight: '900' },
  cancel: { color: '#A8A8B3', textAlign: 'center', marginTop: 12 },
});
