import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  navigation: { navigate: (screen: string) => void };
}

function effectiveRate(income: number): number {
  if (income <= 44725) return 0.22;
  if (income <= 95375) return 0.24;
  if (income <= 182150) return 0.32;
  return 0.35;
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function W2IncomeScreen({ navigation }: Props) {
  const [income, setIncome] = useState('');
  const setW2Income = usePlayerStore((s) => s.setW2Income);

  const value = parseInt(income.replace(/[^0-9]/g, ''), 10) || 0;
  const burden = useMemo(() => Math.round(value * effectiveRate(value)), [value]);
  const recovery = Math.round(burden * 0.32);

  const onContinue = () => {
    setW2Income(value);
    navigation.navigate('GoalSet');
  };

  return (
    <View style={styles.root}>
      <Text style={styles.header}>What do you make at your day job?</Text>
      <Text style={styles.sub}>
        This drives your tax simulation. The higher your income, the more real estate saves you.
      </Text>

      <View style={styles.inputRow}>
        <Text style={styles.dollar}>$</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
          placeholder="0"
          placeholderTextColor="#444"
        />
      </View>

      {value > 0 && (
        <View style={styles.calcBox}>
          <Text style={styles.calcLabel}>Estimated annual tax burden:</Text>
          <Text style={styles.calcValue}>${fmt(burden)}</Text>
          <Text style={styles.calcLabel}>With real estate strategy, you could recover:</Text>
          <Text style={styles.gold}>${fmt(recovery)}</Text>
          <Text style={styles.hint}>
            We'll show you exactly how after your first in-game year.
          </Text>
        </View>
      )}

      <Pressable style={styles.cta} onPress={onContinue} disabled={value === 0}>
        <Text style={styles.ctaText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 60, paddingHorizontal: 24 },
  header: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  sub: { color: '#A8A8B3', fontSize: 14, marginTop: 8, marginBottom: 32 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#FFD24A', paddingVertical: 8 },
  dollar: { color: '#FFD24A', fontSize: 36, fontWeight: '800', marginRight: 8 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 36, fontWeight: '800' },
  calcBox: { marginTop: 28, padding: 16, backgroundColor: '#101018', borderRadius: 12 },
  calcLabel: { color: '#A8A8B3', fontSize: 13, marginTop: 8 },
  calcValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  gold: { color: '#FFD24A', fontSize: 28, fontWeight: '900' },
  hint: { color: '#777', fontSize: 12, marginTop: 12, fontStyle: 'italic' },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 'auto', marginBottom: 30 },
  ctaText: { color: '#08080C', fontWeight: '800', fontSize: 16 },
});
