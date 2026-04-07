import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import WolfPackReveal from '../../components/recruiting/WolfPackReveal';
import AvatarPitch from '../../components/recruiting/AvatarPitch';
import { logRecruitingEvent } from '../../engine/RecruitingEngine';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  navigation: { navigate: (s: string) => void; goBack: () => void };
}

export default function WolfPackPitchScreen({ navigation }: Props) {
  const [step, setStep] = useState(1);
  const player = usePlayerStore((s) => s.player);
  const avatar = player?.avatar_type ?? 'new_investor';

  const advance = () => {
    if (player) logRecruitingEvent(player.id, 'step_reached', step + 1);
    setStep((s) => s + 1);
  };

  const onCta = async () => {
    if (player) await logRecruitingEvent(player.id, 'cta_clicked');
    Linking.openURL('https://freedominvestor.app/wolfpack/join');
  };

  const onAgentPath = async () => {
    if (player) await logRecruitingEvent(player.id, 'agent_path_started');
    navigation.navigate('AgentPath');
  };

  const onDismiss = async () => {
    if (player) await logRecruitingEvent(player.id, 'dismissed');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.dots}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[styles.dot, step >= i && styles.dotOn]} />
        ))}
      </View>

      {step === 1 && (
        <View style={styles.section}>
          <Text style={styles.h1}>You've proven you get it.</Text>
          <Text style={styles.stat}>Properties: 3</Text>
          <Text style={styles.stat}>Cashflow: $1,240/mo</Text>
          <Text style={styles.stat}>Tax savings: $4,800</Text>
          <Text style={styles.stat}>Net worth growth: +28%</Text>
          <Text style={styles.body}>
            Everything you built in this game?{'\n'}
            The strategy is real. The tax math is real.{'\n'}
            The only thing missing is doing it with real money.
          </Text>
        </View>
      )}

      {step === 2 && (
        <View style={styles.section}>
          <Text style={styles.h1}>Did you know real estate agents who actively invest get access to:</Text>
          <Text style={styles.check}>✓ Commission income that funds deals</Text>
          <Text style={styles.check}>✓ Full REPS status — write off everything</Text>
          <Text style={styles.check}>✓ MLS access before the public</Text>
          <Text style={styles.check}>✓ Bonus depreciation through cost seg</Text>
          <Text style={styles.check}>✓ A network of active investors building wealth together</Text>
          <Text style={styles.body}>The agents building the most wealth aren't just selling. They're buying.</Text>
        </View>
      )}

      {step === 3 && <WolfPackReveal />}

      {step === 4 && (
        <View style={styles.section}>
          <Text style={styles.h1}>Move your license. Get the advantage.</Text>
          <Text style={styles.benefit}>🏦 $250,000 Wolf Pack Bank Loan</Text>
          <Text style={styles.benefit}>🔓 All Asset Classes Unlocked</Text>
          <Text style={styles.benefit}>👑 Wolf Pack Elite Clan</Text>
          <Text style={styles.benefit}>📚 Full Freedom Academy Access</Text>
          <Text style={styles.benefit}>📞 Personal Onboarding Call</Text>
          <Text style={styles.price}>FREE — when you move your license to our brokerage network.</Text>
          <AvatarPitch avatarType={avatar} taxSavings={4800} />
        </View>
      )}

      {step === 5 && (
        <View style={styles.section}>
          <Text style={styles.h1}>Ready?</Text>
          <Pressable style={styles.cta} onPress={onCta}>
            <Text style={styles.ctaText}>Join the Wolf Pack — Move My License</Text>
          </Pressable>
          <Pressable style={styles.ghost} onPress={onAgentPath}>
            <Text style={styles.ghostText}>I'm Not Licensed Yet — Show Me How</Text>
          </Pressable>
          <Pressable onPress={onDismiss}>
            <Text style={styles.dismiss}>Maybe Later</Text>
          </Pressable>
        </View>
      )}

      {step < 5 && (
        <Pressable style={styles.next} onPress={advance}>
          <Text style={styles.nextText}>Next →</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  dot: { width: 8, height: 8, backgroundColor: '#222', borderRadius: 4, marginHorizontal: 4 },
  dotOn: { backgroundColor: '#FFD24A' },
  section: { paddingVertical: 12 },
  h1: { color: '#FFD24A', fontSize: 24, fontWeight: '900', marginBottom: 16 },
  stat: { color: '#FFFFFF', fontSize: 18, marginVertical: 4, fontWeight: '700' },
  body: { color: '#E6E6E6', marginTop: 16, lineHeight: 22 },
  check: { color: '#4ADE80', fontSize: 14, marginVertical: 4 },
  benefit: { color: '#FFD24A', fontSize: 14, marginVertical: 6 },
  price: { color: '#4ADE80', fontWeight: '900', fontSize: 22, marginTop: 14 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  ctaText: { color: '#08080C', fontWeight: '900' },
  ghost: { borderWidth: 1, borderColor: '#FFD24A', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  ghostText: { color: '#FFD24A', fontWeight: '700' },
  dismiss: { color: '#777', textAlign: 'center', marginTop: 14, fontSize: 12 },
  next: { backgroundColor: '#FFD24A', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  nextText: { color: '#08080C', fontWeight: '900' },
});
