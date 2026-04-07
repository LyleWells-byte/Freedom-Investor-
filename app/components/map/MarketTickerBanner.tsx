import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing, Dimensions } from 'react-native';
import type { MarketState } from '../../engine/MarketEngine';

interface Props {
  marketState: MarketState;
  monthlyCashflow?: number;
  lastEventName?: string | null;
}

export default function MarketTickerBanner({ marketState, monthlyCashflow = 0, lastEventName }: Props) {
  const scroll = useRef(new Animated.Value(0)).current;
  const width = Dimensions.get('window').width;

  useEffect(() => {
    scroll.setValue(0);
    Animated.loop(
      Animated.timing(scroll, {
        toValue: 1,
        duration: 22000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [scroll]);

  const monthLabel = monthIndexToLabel(marketState.game_month);
  const text = `DSCR Rate: ${marketState.rates.dscr.toFixed(2)}%  •  Conventional: ${marketState.rates.conventional_30yr.toFixed(2)}%  •  Phase: ${marketState.current_phase.toUpperCase()}  •  ${monthLabel}  •  Last Event: ${lastEventName ?? '—'}  •  Your CF: $${monthlyCashflow.toLocaleString()}`;

  const translate = scroll.interpolate({ inputRange: [0, 1], outputRange: [width, -width * 2] });

  return (
    <View style={styles.bar}>
      <Animated.Text style={[styles.text, { transform: [{ translateX: translate }] }]} numberOfLines={1}>
        {text}    {text}
      </Animated.Text>
    </View>
  );
}

function monthIndexToLabel(m: number): string {
  const start = new Date(2024, 0, 1);
  start.setMonth(start.getMonth() + m);
  return start.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  bar: {
    height: 32,
    backgroundColor: '#0A0A10',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A22',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: { color: '#FFD24A', fontWeight: '700', fontSize: 13 },
});
