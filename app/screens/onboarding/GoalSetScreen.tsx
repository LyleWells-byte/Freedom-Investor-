import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  navigation: { navigate: (screen: string) => void };
}

const GOALS = [
  { key: 'freedom', icon: '🏖️', label: 'Financial Freedom' },
  { key: 'replace_w2', icon: '💰', label: 'Replace My W2 Income' },
  { key: 'rental_portfolio', icon: '🏡', label: 'Build a Rental Portfolio' },
  { key: 'generational', icon: '👨‍👩‍👧', label: 'Generational Wealth' },
  { key: 'reduce_tax', icon: '📉', label: 'Reduce My Tax Bill' },
  { key: 'retire_early', icon: '🚀', label: 'Retire Early' },
];

const TIMELINES = [5, 10, 15, 20];

export default function GoalSetScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [target, setTarget] = useState('');
  const [timeline, setTimeline] = useState(10);
  const setGoals = usePlayerStore((s) => s.setGoals);

  const toggle = (key: string) => {
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  };

  const onContinue = () => {
    setGoals({
      types: selected,
      passive_income_target: parseInt(target.replace(/[^0-9]/g, ''), 10) || 0,
      timeline_years: timeline,
    });
    navigation.navigate('VisionBoard');
  };

  return (
    <View style={styles.root}>
      <Text style={styles.header}>What are you building toward?</Text>

      <View style={styles.grid}>
        {GOALS.map((g) => {
          const on = selected.includes(g.key);
          return (
            <Pressable
              key={g.key}
              style={[styles.tile, on && styles.tileOn]}
              onPress={() => toggle(g.key)}
            >
              <Text style={styles.icon}>{g.icon}</Text>
              <Text style={[styles.label, on && styles.labelOn]}>{g.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.fieldLabel}>Monthly passive income target</Text>
      <View style={styles.inputRow}>
        <Text style={styles.dollar}>$</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={target}
          onChangeText={setTarget}
          placeholder="10000"
          placeholderTextColor="#444"
        />
      </View>

      <Text style={styles.fieldLabel}>Timeline to get there</Text>
      <View style={styles.timeline}>
        {TIMELINES.map((y) => (
          <Pressable
            key={y}
            style={[styles.year, timeline === y && styles.yearOn]}
            onPress={() => setTimeline(y)}
          >
            <Text style={[styles.yearText, timeline === y && styles.yearTextOn]}>{y} yr</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.cta} onPress={onContinue}>
        <Text style={styles.ctaText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 60, paddingHorizontal: 20 },
  header: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%', backgroundColor: '#101018', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 2, borderColor: '#222' },
  tileOn: { borderColor: '#FFD24A' },
  icon: { fontSize: 28 },
  label: { color: '#E6E6E6', marginTop: 6, fontWeight: '600' },
  labelOn: { color: '#FFD24A' },
  fieldLabel: { color: '#A8A8B3', marginTop: 12, fontSize: 13 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#333' },
  dollar: { color: '#FFD24A', fontSize: 22, fontWeight: '800', marginRight: 6 },
  input: { flex: 1, color: '#FFF', fontSize: 22, fontWeight: '700', paddingVertical: 6 },
  timeline: { flexDirection: 'row', marginTop: 8 },
  year: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#101018', marginRight: 8, borderWidth: 1, borderColor: '#222' },
  yearOn: { backgroundColor: '#FFD24A', borderColor: '#FFD24A' },
  yearText: { color: '#E6E6E6', fontWeight: '700' },
  yearTextOn: { color: '#08080C' },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 'auto', marginBottom: 20 },
  ctaText: { color: '#08080C', fontWeight: '800', fontSize: 16 },
});
