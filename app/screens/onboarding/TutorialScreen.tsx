import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { COLORS } from '../../constants/theme';
import { TUTORIAL_STEPS } from '../../engine/TutorialEngine';
import { useGameStore } from '../../store/gameStore';
import { awardXP } from '../../engine/XPEngine';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  navigation: { reset: (state: any) => void };
}

export default function TutorialScreen({ navigation }: Props) {
  const [idx, setIdx] = useState(0);
  const setComplete = useGameStore((s) => s.setTutorialComplete);
  const showToast = useGameStore((s) => s.showToast);
  const player = usePlayerStore((s) => s.player);

  const step = TUTORIAL_STEPS[idx];
  const isLast = idx === TUTORIAL_STEPS.length - 1;

  const next = async () => {
    if (isLast) {
      setComplete();
      if (player) await awardXP(player.id, 'educationCardComplete');
      showToast({ type: 'gold', title: '🌱 First Day Investor', subtitle: '+250 XP' });
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } else {
      setIdx(idx + 1);
    }
  };

  const skip = () => {
    setComplete();
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.root}>
        <View style={styles.spotlight} />
        <View style={styles.tooltip}>
          <Text style={styles.counter}>
            Step {idx + 1} of {TUTORIAL_STEPS.length}
          </Text>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.body}>{step.body}</Text>
          <View style={styles.row}>
            <Pressable onPress={skip}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={next}>
              <Text style={styles.btnText}>{isLast ? "Start Building →" : 'Next →'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', padding: 24 },
  spotlight: { position: 'absolute', top: '20%', left: '20%', width: '60%', height: '20%', borderRadius: 120, borderWidth: 2, borderColor: COLORS.gold },
  tooltip: { backgroundColor: COLORS.backgroundCard, padding: 24, borderRadius: 16, borderWidth: 2, borderColor: COLORS.gold },
  counter: { color: COLORS.textMuted, fontSize: 11 },
  title: { color: COLORS.gold, fontSize: 22, fontWeight: '900', marginTop: 6 },
  body: { color: COLORS.textPrimary, fontSize: 14, marginTop: 10, lineHeight: 22 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  skip: { color: COLORS.textMuted, fontWeight: '700' },
  btn: { backgroundColor: COLORS.gold, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  btnText: { color: COLORS.background, fontWeight: '900' },
});
