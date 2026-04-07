import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import type { FeedItem } from '../../types/clan';

const ICON: Record<FeedItem['type'], string> = {
  purchase: '🏠',
  market_event: '⚡',
  level_up: '🏆',
  milestone: '💰',
  flip_profit: '🔨',
  syndication: '🤝',
  challenge: '🎯',
};

export default function PackFeed({ items }: { items: FeedItem[] }) {
  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id}
      ListEmptyComponent={<Text style={styles.empty}>No activity yet. Make some moves.</Text>}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View style={styles.head}>
            <Text style={styles.icon}>{ICON[item.type]}</Text>
            <Text style={styles.name}>{item.playerName}</Text>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>
          <Text style={styles.message}>{item.message}</Text>
          <View style={styles.reactions}>
            {Object.entries(item.reactions).map(([k, v]) => (
              <Text key={k} style={styles.reaction}>
                {k} {v}
              </Text>
            ))}
            <Text style={styles.comment}>💬 {item.commentCount}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { color: '#777', textAlign: 'center', marginTop: 30, fontStyle: 'italic' },
  item: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginBottom: 8 },
  head: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 20, marginRight: 8 },
  name: { color: '#FFD24A', fontWeight: '800', flex: 1 },
  time: { color: '#777', fontSize: 11 },
  message: { color: '#E6E6E6', marginTop: 6, fontSize: 13 },
  reactions: { flexDirection: 'row', marginTop: 8 },
  reaction: { color: '#A8A8B3', marginRight: 12, fontSize: 12 },
  comment: { color: '#A8A8B3', marginLeft: 'auto', fontSize: 12 },
});
