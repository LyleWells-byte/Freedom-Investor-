import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useGameStore } from '../../store/gameStore';
import type { ToastMessage } from '../../types/notifications';

const STYLE: Record<ToastMessage['type'], { bg: string; icon: string }> = {
  success: { bg: COLORS.positive, icon: '✓' },
  warning: { bg: COLORS.warning, icon: '⚠️' },
  error: { bg: COLORS.negative, icon: '✕' },
  info: { bg: COLORS.info, icon: 'ℹ' },
  gold: { bg: COLORS.gold, icon: '⭐' },
  market: { bg: COLORS.backgroundCard, icon: '⚡' },
};

export default function ToastNotification() {
  const queue = useGameStore((s) => s.toastQueue);
  const clear = useGameStore((s) => s.clearToast);

  if (queue.length === 0) return null;
  const t = queue[0];
  const s = STYLE[t.type];

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable style={[styles.toast, { backgroundColor: s.bg }]} onPress={() => clear(t.id)}>
        <Text style={styles.icon}>{s.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t.title}</Text>
          {t.subtitle && <Text style={styles.sub}>{t.subtitle}</Text>}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 60, left: 16, right: 16, zIndex: 999 },
  toast: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12 },
  icon: { fontSize: 20, marginRight: 12 },
  title: { color: '#08080C', fontWeight: '900' },
  sub: { color: '#08080C', fontSize: 12, marginTop: 2 },
});
