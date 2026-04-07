import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useGameStore } from '../../store/gameStore';
import { getAssetClass } from '../../data/assetClasses';

export default function LevelUpModal() {
  const data = useGameStore((s) => s.pendingLevelUp);
  const badges = useGameStore((s) => s.pendingBadges);
  const clear = useGameStore((s) => s.clearPendingLevelUp);

  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!data) return;
    scale.setValue(0);
    fade.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [data, scale, fade]);

  if (!data) return null;
  const unlock = data.unlocksAssetClass ? getAssetClass(data.unlocksAssetClass) : null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.root}>
        <Animated.Text style={[styles.level, { transform: [{ scale }] }]}>
          LEVEL {data.newLevel}
        </Animated.Text>
        <Animated.Text style={[styles.title, { opacity: fade }]}>{data.title}</Animated.Text>

        {unlock && (
          <Animated.View style={[styles.unlockCard, { opacity: fade }]}>
            <Text style={styles.unlockText}>🔓 {unlock.name.toUpperCase()} UNLOCKED</Text>
            <Text style={styles.unlockTagline}>{unlock.tagline}</Text>
          </Animated.View>
        )}

        {badges.length > 0 && (
          <Animated.View style={[styles.badges, { opacity: fade }]}>
            <Text style={styles.badgesTitle}>New Achievements</Text>
            {badges.map((b) => (
              <Text key={b.id} style={styles.badge}>
                {b.icon} {b.name}
              </Text>
            ))}
          </Animated.View>
        )}

        <Pressable style={styles.btn} onPress={clear}>
          <Text style={styles.btnText}>Continue</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.overlay, alignItems: 'center', justifyContent: 'center', padding: 24 },
  level: { color: COLORS.gold, fontSize: 56, fontWeight: '900', letterSpacing: 4 },
  title: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '800', marginTop: 12 },
  unlockCard: { backgroundColor: COLORS.backgroundCard, padding: 16, borderRadius: 16, borderWidth: 2, borderColor: COLORS.gold, marginTop: 24, alignItems: 'center' },
  unlockText: { color: COLORS.gold, fontWeight: '900' },
  unlockTagline: { color: COLORS.textPrimary, marginTop: 6, fontStyle: 'italic', textAlign: 'center' },
  badges: { marginTop: 16, alignItems: 'center' },
  badgesTitle: { color: COLORS.textSecondary, marginBottom: 6 },
  badge: { color: COLORS.gold, fontSize: 14, fontWeight: '700' },
  btn: { backgroundColor: COLORS.gold, paddingHorizontal: 36, paddingVertical: 14, borderRadius: 12, marginTop: 28 },
  btnText: { color: COLORS.background, fontWeight: '900', fontSize: 16 },
});
