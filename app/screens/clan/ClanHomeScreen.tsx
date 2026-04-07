import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import PackFeed from '../../components/clan/PackFeed';
import PackChat from '../../components/clan/PackChat';
import MemberCard from '../../components/clan/MemberCard';
import PackLeaderboard from '../../components/clan/PackLeaderboard';
import PackChallenge from '../../components/clan/PackChallenge';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  navigation: { navigate: (s: string, p?: any) => void };
}

type Tab = 'feed' | 'chat' | 'members' | 'syndications' | 'leaderboard' | 'challenges';

export default function ClanHomeScreen({ navigation }: Props) {
  const [tab, setTab] = useState<Tab>('feed');
  const player = usePlayerStore((s) => s.player);

  // TODO: load from Supabase. For now, empty state.
  const inClan = false;

  if (!inClan) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>You're not in a pack yet.</Text>
        <Pressable style={styles.btn} onPress={() => navigation.navigate('ClanDiscover')}>
          <Text style={styles.btnText}>Find Your Pack →</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.clanName}>Wolf Pack Elite</Text>
        <Text style={styles.points}>⭐ 1,240 pts</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {(['feed', 'chat', 'members', 'syndications', 'leaderboard', 'challenges'] as Tab[]).map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabOn]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextOn]}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.content}>
        {tab === 'feed' && <PackFeed items={[]} />}
        {tab === 'chat' && (
          <PackChat
            currentPlayerId={player?.id ?? ''}
            messages={[]}
            onSend={() => {}}
          />
        )}
        {tab === 'members' && <Text style={styles.coming}>Member grid coming soon.</Text>}
        {tab === 'syndications' && (
          <Pressable style={styles.btn} onPress={() => navigation.navigate('Syndication')}>
            <Text style={styles.btnText}>View Syndications →</Text>
          </Pressable>
        )}
        {tab === 'leaderboard' && (
          <PackLeaderboard
            entries={{ net_worth: [], cashflow: [], properties: [], tax_savings: [], flip_profits: [] }}
          />
        )}
        {tab === 'challenges' && <Text style={styles.coming}>No active challenges.</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50 },
  empty: { flex: 1, backgroundColor: '#08080C', alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  header: { paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clanName: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  points: { color: '#FFD24A', fontWeight: '800' },
  tabBar: { flexGrow: 0, paddingHorizontal: 16, marginVertical: 14 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#101018', borderRadius: 14, marginRight: 8 },
  tabOn: { backgroundColor: '#FFD24A' },
  tabText: { color: '#A8A8B3', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  tabTextOn: { color: '#08080C' },
  content: { flex: 1, paddingHorizontal: 16 },
  coming: { color: '#777', fontStyle: 'italic', marginTop: 20 },
  btn: { backgroundColor: '#FFD24A', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#08080C', fontWeight: '900' },
});
