import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { COLORS } from '../../constants/theme';
import { usePlayerStore } from '../../store/playerStore';
import { useGameStore } from '../../store/gameStore';
import { awardXP } from '../../engine/XPEngine';

interface Props {
  navigation: { goBack: () => void };
}

const STATUSES = ['Ahead of schedule 🔥', 'On track 👍', 'Behind — need to adjust'] as const;

export default function AnnualReviewScreen({ navigation }: Props) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<string | null>(null);
  const [commitment, setCommitment] = useState('');
  const player = usePlayerStore((s) => s.player);
  const showToast = useGameStore((s) => s.showToast);

  const finish = async () => {
    if (!player) return;
    await awardXP(player.id, 'annualReviewComplete');
    showToast({ type: 'gold', title: '+300 XP', subtitle: 'Annual Review Complete' });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.counter}>Screen {step} of 5</Text>

      {step === 1 && (
        <View>
          <Text style={styles.title}>Your Year in Review</Text>
          <Stat label="Properties added" value="0" />
          <Stat label="Cashflow earned" value="$0" />
          <Stat label="Tax savings" value="$0" />
          <Stat label="Net worth growth" value="+0%" />
          <Text style={styles.body}>You've come a long way.</Text>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.title}>Goal Check</Text>
          <Text style={styles.body}>Are you on track?</Text>
          {STATUSES.map((s) => (
            <Pressable key={s} style={[styles.option, status === s && styles.optionOn]} onPress={() => setStatus(s)}>
              <Text style={styles.optionText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.title}>Adjust Your Goals</Text>
          <Text style={styles.body}>
            {status === 'Behind — need to adjust'
              ? "What's holding you back? Pick the obstacles and we'll suggest moves."
              : 'Time to level up your targets. Consider new asset classes or syndications.'}
          </Text>
        </View>
      )}

      {step === 4 && (
        <View>
          <Text style={styles.title}>Strategy for Next Year</Text>
          <Text style={styles.body}>
            Given your level and current portfolio, focus on adding 3 cashflow properties and ordering a cost seg study on your largest asset.
          </Text>
        </View>
      )}

      {step === 5 && (
        <View>
          <Text style={styles.title}>Commitment</Text>
          <Text style={styles.body}>What's your #1 move in the next 30 days?</Text>
          <TextInput
            style={styles.input}
            value={commitment}
            onChangeText={setCommitment}
            placeholder="My next move..."
            placeholderTextColor={COLORS.textMuted}
            multiline
          />
        </View>
      )}

      <Pressable
        style={styles.cta}
        onPress={() => (step < 5 ? setStep(step + 1) : finish())}
      >
        <Text style={styles.ctaText}>{step < 5 ? 'Next →' : "I'm committed."}</Text>
      </Pressable>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background, paddingTop: 60, paddingHorizontal: 24 },
  counter: { color: COLORS.textMuted, fontSize: 12, marginBottom: 12 },
  title: { color: COLORS.gold, fontSize: 26, fontWeight: '900' },
  body: { color: COLORS.textPrimary, fontSize: 16, marginVertical: 16, lineHeight: 24 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.backgroundCard, padding: 12, borderRadius: 10, marginVertical: 4 },
  statLabel: { color: COLORS.textSecondary },
  statValue: { color: COLORS.textPrimary, fontWeight: '800' },
  option: { backgroundColor: COLORS.backgroundCard, padding: 14, borderRadius: 10, marginVertical: 4, borderWidth: 1, borderColor: COLORS.border },
  optionOn: { borderColor: COLORS.gold },
  optionText: { color: COLORS.textPrimary, fontWeight: '700' },
  input: { backgroundColor: COLORS.backgroundCard, color: COLORS.textPrimary, padding: 12, borderRadius: 10, minHeight: 80, textAlignVertical: 'top' },
  cta: { backgroundColor: COLORS.gold, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  ctaText: { color: COLORS.background, fontWeight: '900' },
});
