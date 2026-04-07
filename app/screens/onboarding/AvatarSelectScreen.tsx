import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import AvatarCard from '../../components/onboarding/AvatarCard';
import { usePlayerStore } from '../../store/playerStore';
import type { AvatarType } from '../../types/player';

interface Props {
  navigation: { navigate: (screen: string) => void };
}

const AVATARS: {
  key: AvatarType;
  icon: string;
  title: string;
  tagline: string;
  advantages: string[];
}[] = [
  {
    key: 'agent',
    icon: '🏡',
    title: 'Real Estate Agent',
    tagline: 'You know the market. Now learn to own it.',
    advantages: [
      '2.5% commission rebate on every purchase',
      'MLS Early Access — see deals 24hrs first',
      'Faster path to REPS tax status',
    ],
  },
  {
    key: 'new_investor',
    icon: '📈',
    title: 'New Investor',
    tagline: "Zero properties. Zero excuses. Let's build.",
    advantages: [
      'Double XP on first 10 properties',
      '$75,000 starting cash (vs standard $50K)',
      'Beginner momentum — favorable early events',
    ],
  },
  {
    key: 'w2_employee',
    icon: '💼',
    title: 'W2 Employee',
    tagline: "Building someone else's dream. Time to build yours.",
    advantages: [
      'Highest W2 income floor — biggest tax offset',
      '"Tax Awakening" moment after year one',
      'Special quest: Offset Your W2 at Level 3',
    ],
  },
  {
    key: 'business_owner',
    icon: '🏢',
    title: 'Business Owner',
    tagline: 'You know how to run a business. Real estate is just your next one.',
    advantages: [
      'LLC formed at game start (saves $800)',
      'Business line of credit $25K at 7%',
      'Can partner on deals from Day 1',
    ],
  },
];

export default function AvatarSelectScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<AvatarType | null>(null);
  const setAvatar = usePlayerStore((s) => s.setAvatar);

  const handleContinue = () => {
    if (!selected) return;
    setAvatar(selected);
    navigation.navigate('W2Income');
  };

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Who are you right now?</Text>
      <Text style={styles.sub}>
        Your starting advantages depend on it. Be honest — the game rewards the truth.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {AVATARS.map((a) => (
          <AvatarCard
            key={a.key}
            icon={a.icon}
            title={a.title}
            tagline={a.tagline}
            advantages={a.advantages}
            selected={selected === a.key}
            onPress={() => setSelected(a.key)}
          />
        ))}
      </ScrollView>

      {selected && (
        <Pressable style={styles.cta} onPress={handleContinue}>
          <Text style={styles.ctaText}>Continue</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 60, paddingHorizontal: 20 },
  header: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  sub: { color: '#A8A8B3', fontSize: 14, marginTop: 8, marginBottom: 24 },
  scroll: { paddingVertical: 12, paddingRight: 20 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginVertical: 24 },
  ctaText: { color: '#08080C', fontWeight: '800', fontSize: 16 },
});
