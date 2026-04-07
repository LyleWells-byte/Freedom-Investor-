import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export type TabKey = 'invest' | 'portfolio' | 'academy' | 'pack' | 'profile';

interface Props {
  active: TabKey;
  badges?: Partial<Record<TabKey, number>>;
  onChange: (key: TabKey) => void;
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'invest', label: 'Invest', icon: '🗺️' },
  { key: 'portfolio', label: 'Portfolio', icon: '📊' },
  { key: 'academy', label: 'Academy', icon: '🎓' },
  { key: 'pack', label: 'Pack', icon: '🐺' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

export default function BottomTabNavigator({ active, badges = {}, onChange }: Props) {
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const isActive = t.key === active;
        const badge = badges[t.key];
        return (
          <Pressable key={t.key} style={styles.tab} onPress={() => onChange(t.key)}>
            <View>
              <Text style={[styles.icon, isActive && styles.active]}>{t.icon}</Text>
              {badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, isActive && styles.active]}>{t.label}</Text>
            {isActive && <View style={styles.underline} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 24,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, opacity: 0.55 },
  label: { color: COLORS.textMuted, fontSize: 10, marginTop: 2, fontWeight: '700' },
  active: { color: COLORS.gold, opacity: 1 },
  underline: { width: 24, height: 2, backgroundColor: COLORS.gold, marginTop: 2, borderRadius: 1 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.negative,
    borderRadius: 8,
    paddingHorizontal: 5,
    minWidth: 16,
    alignItems: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' },
});
