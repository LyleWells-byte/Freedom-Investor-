import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { ClanMember } from '../../types/clan';

interface Props {
  member: ClanMember;
  isCreatorView?: boolean;
  onView: () => void;
  onPromote?: () => void;
  onRemove?: () => void;
}

export default function MemberCard({ member, isCreatorView, onView, onPromote, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{member.displayName}</Text>
      <Text style={styles.meta}>
        {member.avatarType.toUpperCase()} • L{member.level} • {member.role}
      </Text>
      <Text style={styles.cf}>${member.monthlyContribution.toLocaleString()}/mo contribution</Text>
      <Pressable style={styles.btn} onPress={onView}>
        <Text style={styles.btnText}>View Portfolio</Text>
      </Pressable>
      {isCreatorView && (
        <View style={styles.controls}>
          {onPromote && (
            <Pressable onPress={onPromote}>
              <Text style={styles.ctrl}>Promote</Text>
            </Pressable>
          )}
          {onRemove && (
            <Pressable onPress={onRemove}>
              <Text style={[styles.ctrl, { color: '#F87171' }]}>Remove</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginBottom: 10, width: '48%' },
  name: { color: '#FFFFFF', fontWeight: '800' },
  meta: { color: '#A8A8B3', fontSize: 11, marginTop: 4 },
  cf: { color: '#4ADE80', fontSize: 12, marginTop: 4 },
  btn: { marginTop: 10, backgroundColor: '#1A1A22', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFD24A', fontSize: 12, fontWeight: '700' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  ctrl: { color: '#FFD24A', fontSize: 11, fontWeight: '700' },
});
