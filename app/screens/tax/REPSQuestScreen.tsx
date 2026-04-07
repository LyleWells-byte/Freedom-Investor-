import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  navigation: { navigate: (s: string) => void };
}

const CARDS = [
  {
    title: 'What is REPS?',
    body:
      'Real Estate Professional Status. An IRS designation that unlocks unlimited depreciation offset against active income.\n\nRequirements: 750+ hours/yr in real estate, more time in RE than any other profession.',
  },
  {
    title: 'How to Qualify',
    body:
      '• Get your real estate license (Agent avatar or complete the Get Your License quest)\n• Become a full-time investor (Level 15)\n• Complete 750 in-game hours of RE activity (tracked automatically)',
  },
  {
    title: 'The Tax Math',
    body:
      'Without REPS: $180K W2 + $40K depreciation = $0 W2 offset. Tax bill stays high.\n\nWith REPS: $180K W2 + $40K depreciation = full offset. Taxable income drops to $140K.\n\nSavings: ~$10,000+ per year.',
  },
  {
    title: 'Bonus Depreciation + Cost Seg',
    body:
      'With REPS active, a cost seg study on one commercial property can generate $200K+ in first-year depreciation.\n\nAgainst $180K W2 income — effective federal tax = $0 that year.\n\nThis is legal. This is how it works. This is why investors pay less tax than employees.',
  },
  {
    title: 'Your Path to REPS',
    body:
      'Progress: 12% toward REPS qualification.\nNext milestone: Buy 3 more rental properties.\nEstimated in-game months to qualification: 8.',
  },
];

export default function REPSQuestScreen({ navigation }: Props) {
  const [idx, setIdx] = useState(0);
  const player = usePlayerStore((s) => s.player);
  const setPlayer = usePlayerStore((s) => s.setPlayer);

  const next = () => {
    if (idx < CARDS.length - 1) {
      setIdx(idx + 1);
    } else {
      if (player) setPlayer({ ...player, xp: player.xp + 500 });
      navigation.navigate('MainTabs');
    }
  };

  const card = CARDS[idx];
  const isLast = idx === CARDS.length - 1;

  return (
    <View style={styles.root}>
      <Text style={styles.progress}>
        Card {idx + 1} of {CARDS.length}
      </Text>
      <View style={styles.card}>
        <Text style={styles.title}>{card.title}</Text>
        <Text style={styles.body}>{card.body}</Text>
      </View>
      <Pressable style={styles.cta} onPress={next}>
        <Text style={styles.ctaText}>{isLast ? "I'm Going for REPS" : 'Next →'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', padding: 24, paddingTop: 60 },
  progress: { color: '#A8A8B3', fontSize: 12, marginBottom: 16 },
  card: { flex: 1, backgroundColor: '#101018', padding: 24, borderRadius: 16 },
  title: { color: '#FFD24A', fontSize: 26, fontWeight: '900', marginBottom: 16 },
  body: { color: '#E6E6E6', fontSize: 16, lineHeight: 24 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  ctaText: { color: '#08080C', fontWeight: '900', fontSize: 16 },
});
