import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';

interface Props {
  route: { params: { w2Income: number; depreciation: number; taxBefore: number; taxAfter: number } };
  navigation: { navigate: (s: string, p?: any) => void };
}

export default function TaxAwakeningScreen({ route, navigation }: Props) {
  const { w2Income, depreciation, taxBefore, taxAfter } = route.params;
  const savings = Math.max(0, taxBefore - taxAfter);
  const [step, setStep] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    const t1 = setTimeout(() => setStep(1), 3000);
    const t2 = setTimeout(() => setStep(2), 5000);
    const t3 = setTimeout(() => setStep(3), 8000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [fade]);

  const tint =
    step === 0 ? '#1A0608' : step === 1 ? '#0A0A10' : step >= 2 ? '#06190E' : '#0A0A10';

  return (
    <View style={[styles.root, { backgroundColor: tint }]}>
      {step === 0 && (
        <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
          <Text style={styles.label}>W2 Income</Text>
          <Text style={styles.bigRed}>${w2Income.toLocaleString()}</Text>
          <Text style={styles.label}>Federal Tax Owed</Text>
          <Text style={styles.bigRed}>${taxBefore.toLocaleString()}</Text>
          <Text style={styles.flavor}>Every year. Gone.</Text>
          <Text style={styles.flavor}>You worked {Math.round(taxBefore / 35)} hours to pay that bill.</Text>
        </Animated.View>
      )}

      {step === 1 && (
        <Text style={styles.shift}>But this year was different.</Text>
      )}

      {step === 2 && (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.label}>Depreciation</Text>
          <Text style={styles.bigGreen}>${depreciation.toLocaleString()}</Text>
          <Text style={styles.label}>New Tax Bill</Text>
          <Text style={styles.bigGreen}>${taxAfter.toLocaleString()}</Text>
          <Text style={styles.savings}>${savings.toLocaleString()} SAVED</Text>
        </View>
      )}

      {step === 3 && (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.lesson}>
            That wasn't luck.{'\n'}That was depreciation.{'\n\n'}A legal tax advantage the wealthy have used for decades.{'\n'}Your properties lost value on paper — so the IRS taxed you less.{'\n'}Except your properties actually went UP in value.{'\n\n'}That's the game within the game.
          </Text>
          <Text style={styles.cta}>
            Imagine this with 10 properties. Or 20.{'\n'}The math doesn't stop working — it just gets bigger.
          </Text>
          <Pressable style={styles.btn} onPress={() => navigation.navigate('CityMap')}>
            <Text style={styles.btnText}>Buy More Properties →</Text>
          </Pressable>
          <Pressable style={styles.ghost} onPress={() => navigation.navigate('REPSQuest')}>
            <Text style={styles.ghostText}>Learn About REPS →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  label: { color: '#A8A8B3', fontSize: 12, marginTop: 16 },
  bigRed: { color: '#F87171', fontSize: 44, fontWeight: '900' },
  bigGreen: { color: '#4ADE80', fontSize: 44, fontWeight: '900' },
  flavor: { color: '#FFFFFF', fontSize: 16, marginTop: 12, fontStyle: 'italic' },
  shift: { color: '#FFD24A', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  savings: { color: '#FFD24A', fontSize: 38, fontWeight: '900', marginTop: 20 },
  lesson: { color: '#FFFFFF', fontSize: 16, lineHeight: 24, textAlign: 'center' },
  cta: { color: '#FFD24A', fontSize: 14, marginTop: 20, textAlign: 'center', fontStyle: 'italic' },
  btn: { backgroundColor: '#FFD24A', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, marginTop: 24 },
  btnText: { color: '#08080C', fontWeight: '900' },
  ghost: { paddingVertical: 12, marginTop: 8 },
  ghostText: { color: '#E6E6E6', fontWeight: '700' },
});
