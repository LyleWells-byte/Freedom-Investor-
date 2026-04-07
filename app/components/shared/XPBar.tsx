import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';
import { levelForXP, LEVELS } from '../../engine/XPEngine';

interface Props {
  xp: number;
  compact?: boolean;
}

export default function XPBar({ xp, compact }: Props) {
  const def = levelForXP(xp);
  const next = LEVELS.find((l) => l.level === def.level + 1);
  const span = next ? next.xpRequired - def.xpRequired : 1;
  const progress = next ? Math.min(1, (xp - def.xpRequired) / span) : 1;

  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <Text style={styles.level}>L{def.level}</Text>
        <Text style={styles.title}>{def.title}</Text>
        {!compact && next && (
          <Text style={styles.next}>
            {xp - def.xpRequired} / {span}
          </Text>
        )}
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { paddingVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  level: { color: COLORS.gold, fontWeight: '900', marginRight: 8, fontSize: 14 },
  title: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '700', flex: 1 },
  next: { color: COLORS.textMuted, fontSize: 11 },
  barBg: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: COLORS.gold },
});
