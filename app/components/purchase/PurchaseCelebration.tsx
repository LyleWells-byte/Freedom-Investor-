import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import type { PropertyListing } from '../../types/property';

interface Props {
  listing: PropertyListing;
  monthlyCashflow: number;
  newNetWorth: number;
  isFirstDeal?: boolean;
  onDone: () => void;
}

export default function PurchaseCelebration({
  listing,
  monthlyCashflow,
  newNetWorth,
  isFirstDeal,
  onDone,
}: Props) {
  const slide = useRef(new Animated.Value(400)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, { toValue: 0, friction: 6, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [slide, fade, onDone]);

  const flavor =
    listing.asset_class === 'brrrr'
      ? 'Rehab mode activated. Time to force that appreciation. 💪'
      : listing.asset_class === 'flip'
      ? 'Clock is ticking. Every day costs you money. Move fast. 🏃'
      : null;

  return (
    <Pressable style={styles.root} onPress={onDone}>
      <Animated.Text style={[styles.bigText, { opacity: fade }]}>Deal Closed. 🔑</Animated.Text>

      <Animated.View style={[styles.card, { transform: [{ translateY: slide }] }]}>
        <Text style={styles.address}>{listing.address}</Text>
        <Text style={styles.cf}>+${monthlyCashflow.toLocaleString()}/mo</Text>
        <Text style={styles.nw}>Net Worth: ${newNetWorth.toLocaleString()}</Text>
      </Animated.View>

      {isFirstDeal && (
        <Animated.View style={[styles.badge, { opacity: fade }]}>
          <Text style={styles.badgeText}>🏆 First Deal Closed</Text>
          <Text style={styles.badgeSub}>This is where it starts. Every empire began with one.</Text>
        </Animated.View>
      )}

      {flavor && <Text style={styles.flavor}>{flavor}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', alignItems: 'center', justifyContent: 'center', padding: 24 },
  bigText: { color: '#FFD24A', fontSize: 38, fontWeight: '900', marginBottom: 24 },
  card: { backgroundColor: '#101018', padding: 24, borderRadius: 16, borderWidth: 2, borderColor: '#FFD24A', alignItems: 'center', minWidth: 280 },
  address: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  cf: { color: '#4ADE80', fontSize: 32, fontWeight: '900', marginTop: 8 },
  nw: { color: '#A8A8B3', fontSize: 14, marginTop: 8 },
  badge: { marginTop: 24, alignItems: 'center' },
  badgeText: { color: '#FFD24A', fontSize: 20, fontWeight: '900' },
  badgeSub: { color: '#A8A8B3', textAlign: 'center', marginTop: 6, fontStyle: 'italic' },
  flavor: { color: '#FFD24A', marginTop: 24, fontStyle: 'italic', textAlign: 'center' },
});
