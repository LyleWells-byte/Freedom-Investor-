import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';

interface Props {
  navigation: { navigate: (s: string) => void };
}

const SAMPLE = [
  { id: '1', name: 'Wolf Pack Elite', members: 42, avgLevel: 8, cf: 28000, tags: ['Buy & Hold', 'Tax Strategy'] },
  { id: '2', name: 'Flip Kings TX', members: 18, avgLevel: 6, cf: 12000, tags: ['Flipping'] },
  { id: '3', name: 'BRRRR Builders', members: 27, avgLevel: 7, cf: 19000, tags: ['BRRRR', 'Beginner Friendly'] },
];

export default function ClanDiscoverScreen({ navigation }: Props) {
  const [q, setQ] = useState('');
  const filtered = SAMPLE.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Find Your Pack</Text>
      <Text style={styles.sub}>Real estate is a team sport. The best investors don't go it alone.</Text>

      <TextInput
        style={styles.search}
        placeholder="Search clans..."
        placeholderTextColor="#555"
        value={q}
        onChangeText={setQ}
      />

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.members} members • avg L{item.avgLevel} • ${item.cf.toLocaleString()}/mo
            </Text>
            <Text style={styles.tags}>{item.tags.join(' • ')}</Text>
            <Pressable style={styles.join}>
              <Text style={styles.joinText}>Request to Join</Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable style={styles.create} onPress={() => navigation.navigate('ClanCreate')}>
        <Text style={styles.createText}>Create Your Own Pack</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  sub: { color: '#A8A8B3', marginVertical: 8 },
  search: { backgroundColor: '#101018', color: '#FFFFFF', padding: 12, borderRadius: 10, marginVertical: 12 },
  card: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginBottom: 10 },
  name: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  meta: { color: '#A8A8B3', fontSize: 12, marginTop: 4 },
  tags: { color: '#FFD24A', fontSize: 11, marginTop: 4 },
  join: { backgroundColor: '#FFD24A', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  joinText: { color: '#08080C', fontWeight: '900' },
  create: { backgroundColor: '#1A1A22', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginVertical: 14 },
  createText: { color: '#FFD24A', fontWeight: '800' },
});
