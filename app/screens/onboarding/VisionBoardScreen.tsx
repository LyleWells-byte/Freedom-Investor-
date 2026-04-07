import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { usePlayerStore, startingCashFor, llcFormedFor } from '../../store/playerStore';
import type { Player } from '../../types/player';

interface Props {
  navigation: { reset: (state: any) => void };
}

const VISIONS = [
  { key: 'beach', icon: '🏖️', label: 'Beach house' },
  { key: 'family', icon: '🏡', label: 'Family home' },
  { key: 'travel', icon: '✈️', label: 'World travel' },
  { key: 'chart', icon: '📈', label: 'Chart up' },
  { key: 'car', icon: '🚗', label: 'Luxury car' },
  { key: 'retire', icon: '🌅', label: 'Early retirement' },
];

export default function VisionBoardScreen({ navigation }: Props) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [why, setWhy] = useState('');
  const draft = usePlayerStore((s) => s.draft);
  const setPlayer = usePlayerStore((s) => s.setPlayer);

  const handleFinish = async () => {
    if (!draft.avatar_type) return;
    const player: Player = {
      id: `local-${Date.now()}`,
      clerk_user_id: '',
      display_name: draft.display_name ?? 'Player',
      avatar_type: draft.avatar_type,
      w2_income: draft.w2_income ?? 0,
      goals: {
        types: draft.goals?.types ?? [],
        passive_income_target: draft.goals?.passive_income_target ?? 0,
        timeline_years: draft.goals?.timeline_years ?? 10,
        vision_description: why,
        vision_image_url: chosen ?? undefined,
      },
      level: 1,
      xp: 0,
      cash_balance: startingCashFor(draft.avatar_type),
      reps_status: false,
      llc_formed: llcFormedFor(draft.avatar_type),
      created_at: new Date().toISOString(),
    };

    try {
      // TODO: replace with real Supabase insert
      // await supabase.from('players').insert(player)
      setPlayer(player);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (e) {
      Alert.alert('Could not save player', String(e));
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>What does winning look like for you?</Text>
      <Text style={styles.sub}>This stays on your profile. Look at it every time you play.</Text>

      <Pressable style={styles.upload}>
        <Text style={styles.uploadText}>📷 Upload a personal image</Text>
      </Pressable>

      <Text style={styles.or}>— or pick a vision —</Text>

      <View style={styles.grid}>
        {VISIONS.map((v) => {
          const on = chosen === v.key;
          return (
            <Pressable
              key={v.key}
              style={[styles.tile, on && styles.tileOn]}
              onPress={() => setChosen(v.key)}
            >
              <Text style={styles.icon}>{v.icon}</Text>
              <Text style={[styles.label, on && styles.labelOn]}>{v.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.fieldLabel}>Describe your why in one line</Text>
      <TextInput
        style={styles.input}
        value={why}
        onChangeText={setWhy}
        placeholder="My kids never worry about money."
        placeholderTextColor="#555"
      />

      <Pressable style={styles.cta} onPress={handleFinish}>
        <Text style={styles.ctaText}>Let's Build</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 60, paddingHorizontal: 20 },
  header: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  sub: { color: '#A8A8B3', fontSize: 14, marginTop: 8, marginBottom: 16 },
  upload: { backgroundColor: '#101018', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  uploadText: { color: '#FFD24A', fontWeight: '700' },
  or: { color: '#777', textAlign: 'center', marginVertical: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '31%', backgroundColor: '#101018', padding: 12, borderRadius: 12, marginBottom: 10, alignItems: 'center', borderWidth: 2, borderColor: '#222' },
  tileOn: { borderColor: '#FFD24A' },
  icon: { fontSize: 26 },
  label: { color: '#E6E6E6', marginTop: 4, fontSize: 11, textAlign: 'center' },
  labelOn: { color: '#FFD24A' },
  fieldLabel: { color: '#A8A8B3', marginTop: 14, fontSize: 13 },
  input: { color: '#FFF', borderBottomWidth: 1, borderBottomColor: '#333', paddingVertical: 8, fontSize: 16 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  ctaText: { color: '#08080C', fontWeight: '900', fontSize: 17 },
});
