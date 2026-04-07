import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';

export interface AvatarCardProps {
  icon: string;
  title: string;
  tagline: string;
  advantages: string[];
  selected: boolean;
  onPress: () => void;
}

export default function AvatarCard({
  icon,
  title,
  tagline,
  advantages,
  selected,
  onPress,
}: AvatarCardProps) {
  const glow = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(glow, {
      toValue: selected ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [selected, glow]);

  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: ['#222', '#FFD24A'],
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.card, { borderColor }]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.tagline}>{tagline}</Text>
        <View style={styles.list}>
          {advantages.map((a, i) => (
            <Text key={i} style={styles.bullet}>
              • {a}
            </Text>
          ))}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    padding: 20,
    marginRight: 16,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: '#0E0E12',
  },
  icon: { fontSize: 40, marginBottom: 8 },
  title: { color: '#FFD24A', fontSize: 22, fontWeight: '800' },
  tagline: { color: '#E6E6E6', fontSize: 14, marginTop: 6, marginBottom: 12 },
  list: { marginTop: 8 },
  bullet: { color: '#CFCFCF', fontSize: 13, marginBottom: 6 },
});
