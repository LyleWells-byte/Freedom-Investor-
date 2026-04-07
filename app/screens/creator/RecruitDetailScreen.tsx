import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { confirmLicenseTransfer, updateRecruitNotes } from '../../engine/CreatorEngine';
import type { RecruitProfile } from '../../types/creator';

interface Props {
  route: { params: { playerId: string; recruit?: RecruitProfile } };
}

export default function RecruitDetailScreen({ route }: Props) {
  const recruit = route.params.recruit;
  const [notes, setNotes] = useState(recruit?.creatorNotes ?? '');

  if (!recruit) {
    return (
      <View style={styles.root}>
        <Text style={styles.err}>Recruit not loaded. Wire up Supabase fetch by playerId.</Text>
      </View>
    );
  }

  const onTransfer = async () => {
    await confirmLicenseTransfer(recruit.playerId, 'creator');
    Alert.alert('License Transfer Confirmed', `${recruit.displayName} has been added to the Wolf Pack.`);
  };

  const saveNotes = async () => {
    await updateRecruitNotes(recruit.playerId, notes);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.name}>{recruit.displayName}</Text>
      <Text style={styles.meta}>
        L{recruit.currentLevel} • {recruit.avatarType.toUpperCase()} • engagement {recruit.avatarEngagementScore}
      </Text>

      <Text style={styles.section}>Game Stats</Text>
      <Stat label="Monthly Cashflow" value={`$${recruit.monthlyGameCashflow.toLocaleString()}`} />
      <Stat label="Net Worth" value={`$${recruit.netWorthInGame.toLocaleString()}`} />
      <Stat label="Properties" value={`${recruit.propertiesOwned}`} />
      <Stat label="Asset Classes Unlocked" value={recruit.assetClassesUnlocked.join(', ') || '—'} />
      <Stat label="Total XP" value={`${recruit.xpTotal}`} />

      <Text style={styles.section}>Recruiting Journey</Text>
      <Event icon="📱" text={`Signed up — ${recruit.signupDate}`} />
      <Event icon="✅" text="Completed onboarding" />
      <Event icon="🏠" text="First property purchased" />
      {recruit.currentLevel >= 5 && <Event icon="⭐" text="Reached Level 5" />}
      {recruit.wolfPackPitchShown && <Event icon="👀" text={`Pitch shown — step ${recruit.wolfPackPitchStep}/5`} />}
      {recruit.wolfPackCtaClicked && <Event icon="🔥" text={`CTA clicked — ${recruit.wolfPackCtaClickedAt}`} />}
      {recruit.licenseTransferred && <Event icon="🐺" text={`License transferred — ${recruit.licenseTransferredAt}`} />}

      <Text style={styles.section}>Creator Notes</Text>
      <TextInput
        style={styles.notes}
        multiline
        value={notes}
        onChangeText={setNotes}
        onBlur={saveNotes}
        placeholder="Met at [event]. Interested in [topic]. Follow up by [date]."
        placeholderTextColor="#555"
      />

      <Text style={styles.section}>Actions</Text>
      {!recruit.licenseTransferred && (
        <Pressable style={styles.cta} onPress={onTransfer}>
          <Text style={styles.ctaText}>Confirm License Transfer</Text>
        </Pressable>
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

function Event({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.event}>
      <Text style={styles.eventIcon}>{icon}</Text>
      <Text style={styles.eventText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  err: { color: '#F87171', padding: 24 },
  name: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  meta: { color: '#FFD24A', marginTop: 4 },
  section: { color: '#FFD24A', fontWeight: '900', marginTop: 20, marginBottom: 8 },
  stat: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#101018', padding: 10, borderRadius: 8, marginBottom: 4 },
  statLabel: { color: '#A8A8B3', fontSize: 12 },
  statValue: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  event: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  eventIcon: { fontSize: 16, marginRight: 8 },
  eventText: { color: '#E6E6E6', fontSize: 13 },
  notes: { backgroundColor: '#101018', color: '#FFFFFF', padding: 12, borderRadius: 10, minHeight: 100, textAlignVertical: 'top' },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  ctaText: { color: '#08080C', fontWeight: '900' },
});
