import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ASSET_CLASSES } from '../../data/assetClasses';

interface Props {
  playerLevel: number;
  completedCardIds: string[];
}

export default function ProgressRoadmap({ playerLevel, completedCardIds }: Props) {
  const nextLocked = ASSET_CLASSES.find((a) => a.unlockLevel > playerLevel);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {ASSET_CLASSES.map((a) => {
        const unlocked = a.unlockLevel <= playerLevel;
        const isNext = nextLocked?.id === a.id;
        const completedCount = a.educationCardIds.filter((id) => completedCardIds.includes(id)).length;
        const allDone = completedCount === a.educationCardIds.length && completedCount > 0;

        return (
          <View
            key={a.id}
            style={[
              styles.node,
              unlocked && styles.nodeUnlocked,
              isNext && styles.nodeNext,
            ]}
          >
            <Text style={styles.icon}>{unlocked ? a.icon : '🔒'}</Text>
            <Text style={styles.lvl}>L{a.unlockLevel}</Text>
            <Text style={styles.name} numberOfLines={1}>
              {a.name}
            </Text>
            {allDone && <Text style={styles.check}>✓</Text>}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 12 },
  node: {
    width: 100,
    padding: 10,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#101018',
    borderWidth: 2,
    borderColor: '#222',
    alignItems: 'center',
    opacity: 0.6,
  },
  nodeUnlocked: { opacity: 1, borderColor: '#4ADE80' },
  nodeNext: { borderColor: '#FFD24A' },
  icon: { fontSize: 24 },
  lvl: { color: '#FFD24A', fontWeight: '900', fontSize: 12, marginTop: 2 },
  name: { color: '#E6E6E6', fontSize: 10, textAlign: 'center', marginTop: 4 },
  check: { color: '#4ADE80', fontWeight: '900', marginTop: 4 },
});
