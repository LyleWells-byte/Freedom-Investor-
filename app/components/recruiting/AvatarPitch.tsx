import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAvatarPitchCopy } from '../../engine/RecruitingEngine';
import type { AvatarType } from '../../types/player';

const ICON: Record<AvatarType, string> = {
  agent: '🏡',
  new_investor: '📈',
  w2_employee: '💼',
  business_owner: '🏢',
};

interface Props {
  avatarType: AvatarType;
  taxSavings?: number;
}

export default function AvatarPitch({ avatarType, taxSavings = 0 }: Props) {
  const c = getAvatarPitchCopy(avatarType, taxSavings);
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{ICON[avatarType]}</Text>
      <Text style={styles.headline}>{c.headline}</Text>
      <Text style={styles.body}>{c.body}</Text>
      <View style={styles.ctaBox}>
        <Text style={styles.cta}>{c.cta}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101018', borderWidth: 2, borderColor: '#FFD24A', padding: 18, borderRadius: 14, marginVertical: 12 },
  icon: { fontSize: 36, marginBottom: 8 },
  headline: { color: '#FFD24A', fontSize: 20, fontWeight: '900' },
  body: { color: '#E6E6E6', fontSize: 14, lineHeight: 22, marginTop: 10 },
  ctaBox: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#2A2A35' },
  cta: { color: '#FFD24A', fontWeight: '800', textAlign: 'center' },
});
