import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import EducationCard from '../../components/academy/EducationCard';
import { getEducationCard } from '../../data/educationCards';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  route: { params: { cardId: string } };
  navigation: { goBack: () => void };
}

export default function EducationCardScreen({ route, navigation }: Props) {
  const { cardId } = route.params;
  const card = getEducationCard(cardId);
  const [idx, setIdx] = useState(0);
  const player = usePlayerStore((s) => s.player);
  const setPlayer = usePlayerStore((s) => s.setPlayer);

  if (!card) {
    return (
      <View style={styles.root}>
        <Text style={styles.error}>Card not found.</Text>
      </View>
    );
  }

  const total = card.screens.length;
  const isLast = idx === total - 1;
  const screen = card.screens[idx];

  const onComplete = () => {
    if (player) setPlayer({ ...player, xp: player.xp + card.xpReward });
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${((idx + 1) / total) * 100}%` }]} />
      </View>
      <Text style={styles.counter}>
        {idx + 1} of {total}
      </Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <EducationCard screen={screen} />

        {isLast && (
          <View style={styles.takeawayBox}>
            <Text style={styles.takeawayLabel}>Key Takeaway</Text>
            <Text style={styles.takeawayText}>{card.keyTakeaway}</Text>
            <Text style={styles.xp}>+{card.xpReward} XP</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.nav}>
        <Pressable
          style={[styles.btn, idx === 0 && styles.btnDisabled]}
          disabled={idx === 0}
          onPress={() => setIdx((i) => i - 1)}
        >
          <Text style={styles.btnText}>Back</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnPrimary]}
          onPress={isLast ? onComplete : () => setIdx((i) => i + 1)}
        >
          <Text style={[styles.btnText, styles.btnTextPrimary]}>{isLast ? 'Complete' : 'Next'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 20 },
  error: { color: '#F87171', fontSize: 16 },
  barBg: { height: 4, backgroundColor: '#222', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#FFD24A' },
  counter: { color: '#A8A8B3', fontSize: 12, marginTop: 6, marginBottom: 14 },
  takeawayBox: { backgroundColor: '#1A1A22', borderLeftWidth: 4, borderLeftColor: '#FFD24A', padding: 16, borderRadius: 10, marginTop: 24 },
  takeawayLabel: { color: '#FFD24A', fontWeight: '900', marginBottom: 6 },
  takeawayText: { color: '#FFFFFF', fontSize: 15, lineHeight: 22 },
  xp: { color: '#4ADE80', fontWeight: '900', marginTop: 10 },
  nav: { flexDirection: 'row', paddingVertical: 14 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#333', marginHorizontal: 4 },
  btnPrimary: { backgroundColor: '#FFD24A', borderColor: '#FFD24A' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#E6E6E6', fontWeight: '800' },
  btnTextPrimary: { color: '#08080C' },
});
