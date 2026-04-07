import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { EducationScreen } from '../../data/educationCards';

interface Props {
  screen: EducationScreen;
}

export default function EducationCard({ screen }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.headline}>{screen.headline}</Text>
      <Text style={styles.body}>{screen.body}</Text>
      {renderVisual(screen)}
    </View>
  );
}

function renderVisual(screen: EducationScreen) {
  const data = screen.visualData ?? {};
  switch (screen.visual) {
    case 'formula':
      return (
        <View style={styles.formula}>
          <Text style={styles.formulaText}>{(data.formula as string) ?? ''}</Text>
        </View>
      );
    case 'number_example':
      return (
        <View style={styles.number}>
          {Object.entries(data).map(([k, v]) => (
            <Text key={k} style={styles.numberLine}>
              <Text style={styles.numberKey}>{k}: </Text>
              {String(v)}
            </Text>
          ))}
        </View>
      );
    case 'comparison':
      return (
        <View style={styles.compare}>
          <Text style={styles.compareText}>Side-by-side comparison</Text>
        </View>
      );
    case 'checklist':
      return (
        <View style={styles.checklist}>
          <Text style={styles.checkItem}>✓ Key requirement</Text>
        </View>
      );
    case 'story':
      return null;
  }
}

const styles = StyleSheet.create({
  box: { padding: 8 },
  headline: { color: '#FFD24A', fontSize: 26, fontWeight: '900', marginBottom: 12 },
  body: { color: '#E6E6E6', fontSize: 16, lineHeight: 24, marginBottom: 16 },
  formula: { backgroundColor: '#1A1A22', padding: 16, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#FFD24A' },
  formulaText: { color: '#FFD24A', fontFamily: 'Courier', fontSize: 16, fontWeight: '800', textAlign: 'center' },
  number: { backgroundColor: '#101018', padding: 14, borderRadius: 10 },
  numberLine: { color: '#FFFFFF', fontSize: 16, marginVertical: 4 },
  numberKey: { color: '#FFD24A', fontWeight: '800' },
  compare: { backgroundColor: '#101018', padding: 14, borderRadius: 10 },
  compareText: { color: '#A8A8B3' },
  checklist: { padding: 8 },
  checkItem: { color: '#4ADE80', fontSize: 14, marginVertical: 4 },
});
