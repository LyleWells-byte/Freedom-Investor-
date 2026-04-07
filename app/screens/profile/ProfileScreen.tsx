import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Switch } from 'react-native';
import { COLORS } from '../../constants/theme';
import XPBar from '../../components/shared/XPBar';
import AchievementBadgeView from '../../components/shared/AchievementBadge';
import { ACHIEVEMENTS } from '../../engine/XPEngine';
import { usePlayerStore } from '../../store/playerStore';
import { useGameStore } from '../../store/gameStore';

interface Props {
  navigation: { navigate: (s: string) => void };
}

export default function ProfileScreen({ navigation }: Props) {
  const player = usePlayerStore((s) => s.player);
  const speed = useGameStore((s) => s.gameSpeed);
  const setSpeed = useGameStore((s) => s.setGameSpeed);
  const isCreator = player?.display_name === 'Lyle' || true; // wire to creator_accounts

  if (!player) {
    return (
      <View style={styles.root}>
        <Text style={styles.empty}>No player loaded.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.name}>{player.display_name}</Text>
        <Text style={styles.type}>{player.avatar_type.toUpperCase()}</Text>
        <XPBar xp={player.xp} />
        <Text style={styles.since}>Member since {new Date(player.created_at).toLocaleDateString()}</Text>
      </View>

      <Text style={styles.section}>Stats</Text>
      <View style={styles.grid}>
        <Stat label="Properties" value="0" />
        <Stat label="Cashflow/mo" value="$0" />
        <Stat label="Net Worth" value={`$${player.cash_balance.toLocaleString()}`} />
        <Stat label="Tax Saved" value="$0" />
        <Stat label="Flips" value="0" />
        <Stat label="Cards Done" value="0" />
      </View>

      <Text style={styles.section}>Achievements</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {ACHIEVEMENTS.map((b) => (
          <AchievementBadgeView key={b.id} badge={b} earned={false} />
        ))}
      </ScrollView>

      <Pressable style={styles.linkBtn} onPress={() => navigation.navigate('VisionBoard')}>
        <Text style={styles.linkText}>Vision Board Snapshot →</Text>
      </Pressable>

      <Text style={styles.section}>Settings</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Game Speed</Text>
        <View style={styles.speedRow}>
          {[1, 2, 5].map((s) => (
            <Pressable
              key={s}
              style={[styles.speedBtn, speed === s && styles.speedBtnOn]}
              onPress={() => setSpeed(s as 1 | 2 | 5)}
            >
              <Text style={[styles.speedText, speed === s && styles.speedTextOn]}>{s}x</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <SettingToggle label="Push Notifications" />
      <SettingToggle label="Sound Effects" />
      <SettingToggle label="Haptic Feedback" />

      {isCreator && (
        <>
          <Text style={styles.section}>Creator</Text>
          <Pressable style={styles.linkBtn} onPress={() => navigation.navigate('CreatorDashboard')}>
            <Text style={styles.linkText}>Creator Dashboard →</Text>
          </Pressable>
          <Pressable style={styles.linkBtn} onPress={() => navigation.navigate('EventDemo')}>
            <Text style={styles.linkText}>Launch Event Demo →</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function SettingToggle({ label }: { label: string }) {
  const [on, setOn] = React.useState(true);
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch value={on} onValueChange={setOn} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50, paddingHorizontal: 16 },
  empty: { color: COLORS.textMuted, padding: 24 },
  header: { alignItems: 'center', paddingVertical: 20 },
  avatar: { fontSize: 60 },
  name: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '900', marginTop: 8 },
  type: { color: COLORS.gold, fontWeight: '700', marginTop: 4 },
  since: { color: COLORS.textMuted, fontSize: 11, marginTop: 8 },
  section: { color: COLORS.gold, fontSize: 16, fontWeight: '900', marginTop: 20, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  stat: { width: '32%', backgroundColor: COLORS.backgroundCard, padding: 12, borderRadius: 10, marginBottom: 8 },
  statLabel: { color: COLORS.textMuted, fontSize: 10 },
  statValue: { color: COLORS.textPrimary, fontWeight: '800', fontSize: 14, marginTop: 2 },
  linkBtn: { backgroundColor: COLORS.backgroundCard, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  linkText: { color: COLORS.gold, fontWeight: '800' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.backgroundCard, padding: 14, borderRadius: 10, marginTop: 6 },
  settingLabel: { color: COLORS.textPrimary },
  speedRow: { flexDirection: 'row' },
  speedBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.border, borderRadius: 6, marginLeft: 4 },
  speedBtnOn: { backgroundColor: COLORS.gold },
  speedText: { color: COLORS.textPrimary, fontWeight: '800' },
  speedTextOn: { color: COLORS.background },
});
