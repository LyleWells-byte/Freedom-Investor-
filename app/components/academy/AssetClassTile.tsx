import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { AssetClassDefinition } from '../../data/assetClasses';

interface Props {
  assetClass: AssetClassDefinition;
  isLocked: boolean;
  cardsCompleted: number;
  totalCards: number;
  onPress: () => void;
  onUnlock: () => void;
}

export default function AssetClassTile({
  assetClass,
  isLocked,
  cardsCompleted,
  totalCards,
  onPress,
  onUnlock,
}: Props) {
  const progressPct = totalCards > 0 ? (cardsCompleted / totalCards) * 100 : 0;

  return (
    <Pressable
      style={[styles.tile, isLocked && styles.locked]}
      onPress={isLocked ? onUnlock : onPress}
    >
      <Text style={styles.icon}>{isLocked ? '🔒' : assetClass.icon}</Text>
      <Text style={styles.name}>{assetClass.name}</Text>
      {isLocked ? (
        <>
          <Text style={styles.unlockText}>Unlocks at Level {assetClass.unlockLevel}</Text>
          {assetClass.isFreeOrPaid === 'paid_unlock' && (
            <Text style={styles.unlockBuy}>Unlock Now — ${assetClass.earlyUnlockPrice}</Text>
          )}
        </>
      ) : (
        <>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.progress}>
            {cardsCompleted}/{totalCards} cards
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    backgroundColor: '#101018',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#222',
  },
  locked: { opacity: 0.55 },
  icon: { fontSize: 32 },
  name: { color: '#FFFFFF', fontWeight: '800', fontSize: 14, marginTop: 6 },
  unlockText: { color: '#A8A8B3', fontSize: 11, marginTop: 6 },
  unlockBuy: { color: '#FFD24A', fontSize: 12, fontWeight: '800', marginTop: 4 },
  barBg: { height: 6, backgroundColor: '#222', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#FFD24A' },
  progress: { color: '#A8A8B3', fontSize: 11, marginTop: 4 },
});
