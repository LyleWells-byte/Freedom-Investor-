import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface Props {
  showCreatorInfo?: boolean;
  creatorName?: string;
  creatorTitle?: string;
}

export default function WolfPackReveal({
  showCreatorInfo = true,
  creatorName = 'Lyle Wells',
  creatorTitle = 'Licensed Real Estate Agent\nFreedom Investor',
}: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [scale, fade, slide]);

  return (
    <View style={styles.root}>
      <Animated.Text style={[styles.wolf, { transform: [{ scale }] }]}>🐺</Animated.Text>
      <Animated.Text style={[styles.title, { opacity: fade }]}>WOLF PACK</Animated.Text>
      <Animated.Text style={[styles.sub, { opacity: fade }]}>
        A group of agents and investors building real wealth together.{'\n'}
        In this game — and in real life.
      </Animated.Text>
      {showCreatorInfo && (
        <Animated.View style={[styles.creator, { transform: [{ translateY: slide }], opacity: fade }]}>
          <Text style={styles.led}>Led by</Text>
          <Text style={styles.name}>{creatorName.toUpperCase()}</Text>
          <Text style={styles.title2}>{creatorTitle}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#08080C' },
  wolf: { fontSize: 110, marginBottom: 18 },
  title: { color: '#FFD24A', fontSize: 38, fontWeight: '900', letterSpacing: 4 },
  sub: { color: '#FFFFFF', fontSize: 14, marginTop: 12, textAlign: 'center', lineHeight: 22 },
  creator: { marginTop: 28, alignItems: 'center' },
  led: { color: '#A8A8B3', fontSize: 11 },
  name: { color: '#FFD24A', fontWeight: '900', fontSize: 18, marginTop: 4 },
  title2: { color: '#E6E6E6', textAlign: 'center', fontSize: 12, marginTop: 4 },
});
