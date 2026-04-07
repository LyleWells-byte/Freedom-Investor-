import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';

interface Props {
  navigation: { navigate: (screen: string) => void };
}

export default function WelcomeScreen({ navigation }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, [fade, scale]);

  return (
    <View style={styles.root}>
      <Animated.Text style={[styles.logo, { opacity: fade, transform: [{ scale }] }]}>
        FREEDOM INVESTOR
      </Animated.Text>
      <Animated.Text style={[styles.headline, { opacity: fade }]}>
        Build Wealth. Offset Taxes. Live Free.
      </Animated.Text>
      <Animated.Text style={[styles.sub, { opacity: fade }]}>
        The real estate game that teaches you how money actually works.
      </Animated.Text>

      <View style={styles.buttons}>
        <Pressable style={styles.primary} onPress={() => navigation.navigate('AvatarSelect')}>
          <Text style={styles.primaryText}>Start Building</Text>
        </Pressable>
        <Pressable style={styles.ghost} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.ghostText}>I already have an account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { color: '#FFD24A', fontSize: 38, fontWeight: '900', letterSpacing: 2, textAlign: 'center' },
  headline: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 24, textAlign: 'center' },
  sub: { color: '#A8A8B3', fontSize: 14, marginTop: 12, textAlign: 'center', maxWidth: 320 },
  buttons: { marginTop: 60, width: '100%' },
  primary: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#08080C', fontSize: 17, fontWeight: '800' },
  ghost: { marginTop: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#333', borderRadius: 12 },
  ghostText: { color: '#E6E6E6', fontSize: 15, fontWeight: '600' },
});
