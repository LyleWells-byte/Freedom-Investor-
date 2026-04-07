import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { NeighborhoodClass } from '../../types/property';

interface Props {
  neighborhoodClass: NeighborhoodClass;
  isLocked: boolean;
  availableCount: number;
  currentPriceIndex: number;
  currentVacancyRate: number;
  trendDirection?: 'up' | 'down' | 'flat';
  onPress: () => void;
}

const META: Record<NeighborhoodClass, { name: string; color: string; icon: string }> = {
  A: { name: 'Prestige Hills', color: '#FFD700', icon: '👑' },
  B: { name: 'Midtown Grove', color: '#4A90E2', icon: '🏠' },
  C: { name: 'Riverside District', color: '#F5A623', icon: '🔧' },
  D: { name: 'Eastside', color: '#D0021B', icon: '🔒' },
};

export default function NeighborhoodZone({
  neighborhoodClass,
  isLocked,
  availableCount,
  currentPriceIndex,
  currentVacancyRate,
  trendDirection = 'flat',
  onPress,
}: Props) {
  const m = META[neighborhoodClass];
  const arrow = trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→';
  const arrowColor = trendDirection === 'up' ? '#4ADE80' : trendDirection === 'down' ? '#F87171' : '#999';

  return (
    <Pressable
      style={[styles.zone, { borderColor: m.color }, isLocked && styles.locked]}
      onPress={isLocked ? undefined : onPress}
    >
      <Text style={styles.icon}>{m.icon}</Text>
      <Text style={[styles.classBadge, { color: m.color }]}>{neighborhoodClass}-Class</Text>
      <Text style={styles.name}>{m.name}</Text>
      <Text style={styles.stat}>
        Idx {currentPriceIndex.toFixed(0)} <Text style={{ color: arrowColor }}>{arrow}</Text>
      </Text>
      <Text style={styles.stat}>Vac {currentVacancyRate.toFixed(0)}%</Text>
      <View style={[styles.pulse, { backgroundColor: m.color }]}>
        <Text style={styles.pulseText}>{availableCount} available</Text>
      </View>
      {isLocked && <Text style={styles.lockText}>Unlocks at Level 10</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  zone: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 14,
    borderWidth: 2,
    backgroundColor: '#101018',
    justifyContent: 'space-between',
    minHeight: 150,
  },
  locked: { opacity: 0.45 },
  icon: { fontSize: 28 },
  classBadge: { fontWeight: '900', fontSize: 12, marginTop: 4 },
  name: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  stat: { color: '#A8A8B3', fontSize: 12 },
  pulse: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4 },
  pulseText: { color: '#08080C', fontWeight: '800', fontSize: 11 },
  lockText: { color: '#F87171', fontSize: 11, marginTop: 4, fontWeight: '700' },
});
