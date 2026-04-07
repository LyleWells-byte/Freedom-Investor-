import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { RecruitProfile } from '../../types/creator';

interface Props {
  recruit: RecruitProfile;
  compact?: boolean;
  onView: () => void;
  onAddNote?: () => void;
  onConfirmTransfer?: () => void;
}

const AVATAR_ICON: Record<string, string> = {
  agent: '🏡',
  new_investor: '📈',
  w2_employee: '💼',
  business_owner: '🏢',
};

export default function RecruitCard({ recruit, compact, onView, onAddNote, onConfirmTransfer }: Props) {
  const days = Math.floor((Date.now() - new Date(recruit.lastActiveDate).getTime()) / 86400000);
  const lastActiveColor = days < 3 ? '#4ADE80' : days < 7 ? '#FBBF24' : '#F87171';
  const heat =
    recruit.avatarEngagementScore > 75 ? '🔴' : recruit.avatarEngagementScore > 50 ? '🟡' : '🔵';

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.icon}>{AVATAR_ICON[recruit.avatarType] ?? '👤'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{recruit.displayName}</Text>
            <Text style={styles.meta}>L{recruit.currentLevel} • {recruit.xpTotal} XP</Text>
            <Text style={[styles.active, { color: lastActiveColor }]}>Last active: {days}d ago</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.heat}>{heat} {recruit.avatarEngagementScore}</Text>
          <Text style={styles.cf}>${recruit.monthlyGameCashflow}/mo</Text>
          <Text style={styles.props}>{recruit.propertiesOwned} props</Text>
        </View>
      </View>

      {!compact && (
        <View style={styles.badges}>
          {recruit.wolfPackPitchShown && <Badge text="Pitch Shown" color="#444" />}
          {recruit.wolfPackCtaClicked && <Badge text="CTA Clicked 🔥" color="#FFD24A" />}
          {recruit.licenseTransferred && <Badge text="License 🐺" color="#4ADE80" />}
        </View>
      )}

      <View style={styles.actions}>
        <Pressable onPress={onView}>
          <Text style={styles.action}>View Details →</Text>
        </Pressable>
        {onAddNote && (
          <Pressable onPress={onAddNote}>
            <Text style={styles.action}>Add Note</Text>
          </Pressable>
        )}
        {!recruit.licenseTransferred && onConfirmTransfer && (
          <Pressable onPress={onConfirmTransfer}>
            <Text style={[styles.action, { color: '#4ADE80' }]}>Confirm Transfer</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginBottom: 10 },
  compact: { padding: 10 },
  row: { flexDirection: 'row' },
  left: { flexDirection: 'row', flex: 1 },
  icon: { fontSize: 28, marginRight: 10 },
  name: { color: '#FFFFFF', fontWeight: '800' },
  meta: { color: '#A8A8B3', fontSize: 11, marginTop: 2 },
  active: { fontSize: 11, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  heat: { color: '#FFD24A', fontWeight: '800' },
  cf: { color: '#4ADE80', fontSize: 12, marginTop: 4 },
  props: { color: '#A8A8B3', fontSize: 11 },
  badges: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 4, marginTop: 4 },
  badgeText: { color: '#08080C', fontSize: 10, fontWeight: '800' },
  actions: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  action: { color: '#FFD24A', fontSize: 12, fontWeight: '700' },
});
