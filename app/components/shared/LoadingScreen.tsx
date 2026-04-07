import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

const TIPS = [
  "Depreciation is the investor's best friend.",
  'A BRRRR done right returns infinite capital.',
  'The best time to buy was yesterday. The second best time is today.',
  'Cashflow pays the bills. Appreciation builds the wealth.',
  'Your W2 income + real estate = the most powerful wealth combination.',
];

export default function LoadingScreen() {
  const [tipIdx, setTipIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTipIdx((x) => (x + 1) % TIPS.length), 2000);
    return () => clearInterval(i);
  }, []);
  return (
    <View style={styles.root}>
      <Text style={styles.logo}>FREEDOM INVESTOR</Text>
      <View style={styles.barBg}>
        <View style={styles.barFill} />
      </View>
      <Text style={styles.tip}>{TIPS[tipIdx]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { color: COLORS.gold, fontSize: 32, fontWeight: '900', letterSpacing: 2, marginBottom: 24 },
  barBg: { width: '60%', height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  barFill: { width: '60%', height: '100%', backgroundColor: COLORS.gold },
  tip: { color: COLORS.textSecondary, marginTop: 24, textAlign: 'center', fontStyle: 'italic', maxWidth: 280 },
});
