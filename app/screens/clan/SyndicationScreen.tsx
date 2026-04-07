import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import SyndicationDealCard from '../../components/clan/SyndicationDealCard';
import type { SyndicationDeal } from '../../types/clan';
import { usePlayerStore } from '../../store/playerStore';

export default function SyndicationScreen() {
  const player = usePlayerStore((s) => s.player);
  const deals: SyndicationDeal[] = []; // TODO: load from Supabase
  const canCreate = (player?.level ?? 1) >= 8;

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Syndications</Text>
      {canCreate && (
        <Pressable style={styles.create}>
          <Text style={styles.createText}>+ Create Syndication</Text>
        </Pressable>
      )}
      <FlatList
        data={deals}
        keyExtractor={(d) => d.id}
        ListEmptyComponent={<Text style={styles.empty}>No active syndications.</Text>}
        renderItem={({ item }) => <SyndicationDealCard deal={item} onInvest={() => {}} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', marginBottom: 12 },
  create: { backgroundColor: '#FFD24A', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  createText: { color: '#08080C', fontWeight: '900' },
  empty: { color: '#777', fontStyle: 'italic', marginTop: 20 },
});
