import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  counts: number[]; // index = level (1..20+)
  highlightLevel?: number;
}

export default function LevelDistributionChart({ counts, highlightLevel = 5 }: Props) {
  const max = Math.max(...counts, 1);
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Level Distribution</Text>
      <View style={styles.chart}>
        {counts.map((c, i) => {
          const h = (c / max) * 100;
          const lvl = i + 1;
          const isHi = lvl === highlightLevel;
          return (
            <View key={i} style={styles.col}>
              <View
                style={[
                  styles.bar,
                  { height: `${h}%`, backgroundColor: isHi ? '#FFD24A' : '#4A90E2' },
                ]}
              />
              {isHi && <Text style={styles.flag}>L5</Text>}
            </View>
          );
        })}
      </View>
      <Text style={styles.caption}>L5 = Wolf Pack trigger zone</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginVertical: 10 },
  title: { color: '#FFD24A', fontWeight: '900', marginBottom: 10 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120 },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%', marginHorizontal: 1 },
  bar: { width: '70%', borderRadius: 2 },
  flag: { color: '#FFD24A', fontSize: 9, marginTop: 2 },
  caption: { color: '#777', fontSize: 11, marginTop: 8, fontStyle: 'italic' },
});
