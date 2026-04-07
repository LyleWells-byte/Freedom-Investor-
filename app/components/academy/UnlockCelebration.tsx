import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import type { AssetClassDefinition } from '../../data/assetClasses';

interface Props {
  assetClass: AssetClassDefinition;
  onStart: () => void;
  onLater: () => void;
}

export default function UnlockCelebration({ assetClass, onStart, onLater }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [scale, fade]);

  return (
    <View style={styles.root}>
      <Animated.Text style={[styles.icon, { transform: [{ scale }] }]}>{assetClass.icon}</Animated.Text>
      <Animated.Text style={[styles.title, { opacity: fade }]}>
        {assetClass.name.toUpperCase()} UNLOCKED
      </Animated.Text>
      <Animated.Text style={[styles.tagline, { opacity: fade }]}>{assetClass.tagline}</Animated.Text>
      <Animated.Text style={[styles.example, { opacity: fade }]}>{assetClass.realWorldExample}</Animated.Text>
      <Animated.Text style={[styles.lessons, { opacity: fade }]}>
        {assetClass.educationCardIds.length} new lessons waiting for you
      </Animated.Text>
      <Pressable style={styles.btn} onPress={onStart}>
        <Text style={styles.btnText}>Start Learning Now</Text>
      </Pressable>
      <Pressable style={styles.ghost} onPress={onLater}>
        <Text style={styles.ghostText}>I'll check it out later</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', alignItems: 'center', justifyContent: 'center', padding: 28 },
  icon: { fontSize: 96, marginBottom: 20 },
  title: { color: '#FFD24A', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  tagline: { color: '#FFFFFF', fontSize: 16, marginTop: 12, textAlign: 'center', fontStyle: 'italic' },
  example: { color: '#A8A8B3', fontSize: 13, marginTop: 16, textAlign: 'center' },
  lessons: { color: '#FFD24A', fontSize: 14, marginTop: 24, fontWeight: '700' },
  btn: { backgroundColor: '#FFD24A', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, marginTop: 24 },
  btnText: { color: '#08080C', fontWeight: '900', fontSize: 16 },
  ghost: { paddingVertical: 12, marginTop: 8 },
  ghostText: { color: '#A8A8B3', fontWeight: '600' },
});
