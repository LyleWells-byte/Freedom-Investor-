import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { createClan } from '../../engine/ClanEngine';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  navigation: { navigate: (s: string) => void };
}

const TAGS = ['Flipping', 'BRRRR', 'Buy & Hold', 'STR', 'Commercial', 'Tax Strategy', 'Beginner Friendly', 'Advanced Only'];

export default function ClanCreateScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [open, setOpen] = useState(true);
  const player = usePlayerStore((s) => s.player);

  const toggle = (t: string) => setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const onCreate = async () => {
    if (!player || !name) return;
    await createClan(player.id, name, desc);
    navigation.navigate('ClanHome');
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.header}>Create Your Pack</Text>
      <Text style={styles.label}>Pack Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#555" />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={desc}
        onChangeText={setDesc}
        multiline
        placeholderTextColor="#555"
      />
      <Text style={styles.label}>Specialty</Text>
      <View style={styles.tagRow}>
        {TAGS.map((t) => (
          <Pressable key={t} style={[styles.tag, tags.includes(t) && styles.tagOn]} onPress={() => toggle(t)}>
            <Text style={[styles.tagText, tags.includes(t) && styles.tagTextOn]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Privacy</Text>
      <View style={styles.privacy}>
        <Pressable style={[styles.priv, open && styles.privOn]} onPress={() => setOpen(true)}>
          <Text style={styles.privText}>Open</Text>
        </Pressable>
        <Pressable style={[styles.priv, !open && styles.privOn]} onPress={() => setOpen(false)}>
          <Text style={styles.privText}>Invite Only</Text>
        </Pressable>
      </View>

      <Pressable style={styles.cta} onPress={onCreate}>
        <Text style={styles.ctaText}>Create Pack</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', marginBottom: 16 },
  label: { color: '#A8A8B3', marginTop: 12, fontSize: 12 },
  input: { backgroundColor: '#101018', color: '#FFFFFF', padding: 12, borderRadius: 10, marginTop: 4 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  tag: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#101018', borderRadius: 14, marginRight: 6, marginBottom: 6 },
  tagOn: { backgroundColor: '#FFD24A' },
  tagText: { color: '#A8A8B3', fontSize: 11, fontWeight: '700' },
  tagTextOn: { color: '#08080C' },
  privacy: { flexDirection: 'row', marginTop: 6 },
  priv: { flex: 1, padding: 12, backgroundColor: '#101018', alignItems: 'center', marginRight: 6, borderRadius: 10 },
  privOn: { backgroundColor: '#FFD24A' },
  privText: { color: '#08080C', fontWeight: '800' },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  ctaText: { color: '#08080C', fontWeight: '900', fontSize: 16 },
});
