import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';

const SCREENS = [
  {
    title: 'Why Get Your License?',
    body: '• Commission income funds deals\n• MLS access = better deals\n• REPS status = massive tax advantage\n• Network of agents who invest',
  },
  {
    title: 'What Does It Cost?',
    body: 'Texas pre-license: ~$500-800 in courses\nExam fee: $54\nLicense fee: $185\n\nTotal: under $1,100 to change your financial trajectory forever.',
  },
  {
    title: 'How Long Does It Take?',
    body: '180 hours of coursework (self-paced).\nPass the state exam.\nFind a sponsoring broker.\n\nMost people complete in 3-6 months while working their W2.',
  },
  {
    title: 'The Math',
    body: 'Year 1 as an agent:\n2 transactions × $300K = $18,000 commission.\nThat\'s a down payment on a rental.\nThat rental generates $400/mo.\nIn 10 years: $48,000.\nThe license paid for itself 40x over.',
  },
  {
    title: 'Your Next Step',
    body: 'The Wolf Pack will sponsor your license and give you a community of investors who actually buy what they sell.',
  },
];

export default function AgentPathScreen() {
  const [idx, setIdx] = useState(0);
  const isLast = idx === SCREENS.length - 1;
  const s = SCREENS[idx];

  const onBook = () => Linking.openURL('https://freedominvestor.app/wolfpack/calendar');

  return (
    <View style={styles.root}>
      <Text style={styles.counter}>
        {idx + 1} / {SCREENS.length}
      </Text>
      <View style={styles.card}>
        <Text style={styles.title}>{s.title}</Text>
        <Text style={styles.body}>{s.body}</Text>
      </View>

      {isLast ? (
        <Pressable style={styles.cta} onPress={onBook}>
          <Text style={styles.ctaText}>I'm Ready — Let's Talk</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.cta} onPress={() => setIdx(idx + 1)}>
          <Text style={styles.ctaText}>Next →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', padding: 24, paddingTop: 60 },
  counter: { color: '#A8A8B3', fontSize: 12, marginBottom: 14 },
  card: { flex: 1, backgroundColor: '#101018', padding: 24, borderRadius: 16 },
  title: { color: '#FFD24A', fontSize: 26, fontWeight: '900', marginBottom: 16 },
  body: { color: '#E6E6E6', fontSize: 16, lineHeight: 26 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  ctaText: { color: '#08080C', fontWeight: '900', fontSize: 16 },
});
