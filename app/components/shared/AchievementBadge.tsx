import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../constants/theme';
import type { AchievementBadge as Badge } from '../../types/xp';

const RARITY_COLOR: Record<Badge['rarity'], string> = {
  common: COLORS.border,
  rare: COLORS.bClass,
  epic: COLORS.gold,
  legendary: COLORS.rarityTrophy,
};

interface Props {
  badge: Badge;
  earned?: boolean;
  onPress?: () => void;
}

export default function AchievementBadgeView({ badge, earned, onPress }: Props) {
  return (
    <Pressable style={[styles.box, { borderColor: RARITY_COLOR[badge.rarity] }, !earned && styles.locked]} onPress={onPress}>
      <Text style={styles.icon}>{earned ? badge.icon : '?'}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {badge.name}
      </Text>
      <Text style={styles.rarity}>{badge.rarity}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { width: 100, padding: 10, borderRadius: 12, borderWidth: 2, backgroundColor: COLORS.backgroundCard, marginRight: 10, alignItems: 'center' },
  locked: { opacity: 0.4 },
  icon: { fontSize: 32 },
  name: { color: COLORS.textPrimary, fontSize: 11, fontWeight: '800', marginTop: 4, textAlign: 'center' },
  rarity: { color: COLORS.textMuted, fontSize: 9, marginTop: 2, textTransform: 'uppercase' },
});
