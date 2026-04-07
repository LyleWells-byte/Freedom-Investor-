import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { PackChallengeT } from '../../types/clan';

interface Props {
  challenge: PackChallengeT;
  totalMembers: number;
  isComplete: boolean;
}

export default function PackChallenge({ challenge, totalMembers, isComplete }: Props) {
  const [open, setOpen] = useState(false);
  const completed = challenge.completions.length;
  return (
    <Pressable style={styles.card} onPress={() => setOpen(!open)}>
      <Text style={styles.title}>{challenge.title}</Text>
      <Text style={styles.desc}>{challenge.description}</Text>
      <Text style={styles.progress}>
        {completed} of {totalMembers} members completed
      </Text>
      <Text style={styles.status}>{isComplete ? '✓ Complete' : 'In Progress'}</Text>
      <Text style={styles.reward}>+{challenge.rewardXP} XP</Text>
      {open && (
        <Text style={styles.how}>
          How to complete: hit {challenge.targetMetric} of {challenge.targetValue}.
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101018', padding: 14, borderRadius: 12, marginBottom: 10 },
  title: { color: '#FFD24A', fontWeight: '900', fontSize: 15 },
  desc: { color: '#E6E6E6', fontSize: 12, marginTop: 4 },
  progress: { color: '#A8A8B3', fontSize: 11, marginTop: 6 },
  status: { color: '#4ADE80', marginTop: 4, fontWeight: '700' },
  reward: { color: '#FFD24A', marginTop: 4, fontSize: 12 },
  how: { color: '#A8A8B3', fontSize: 11, marginTop: 8, fontStyle: 'italic' },
});
