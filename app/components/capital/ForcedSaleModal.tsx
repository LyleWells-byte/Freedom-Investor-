import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Modal } from 'react-native';

interface Props {
  visible: boolean;
  propertyAddress: string;
  marketValue: number;
  forcedSalePrice: number;
  mortgagePayoff: number;
  prepayPenalty: number;
  netProceeds: number;
  onConfirm: () => void;
}

export default function ForcedSaleModal({
  visible,
  propertyAddress,
  marketValue,
  forcedSalePrice,
  mortgagePayoff,
  prepayPenalty,
  netProceeds,
  onConfirm,
}: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [visible, pulse]);

  const loss = marketValue - forcedSalePrice;

  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.root}>
        <Animated.View style={[styles.warningBox, { transform: [{ scale: pulse }] }]}>
          <Text style={styles.warning}>⚠️ LOAN DEFAULT</Text>
        </Animated.View>

        <Text style={styles.message}>
          You could not service your debt.{'\n'}
          The market doesn't care about your intentions — only your cashflow.
        </Text>

        <View style={styles.card}>
          <Text style={styles.address}>{propertyAddress}</Text>
          <Row label="Market Value" value={`$${marketValue.toLocaleString()}`} />
          <Row label="Forced Sale Price" value={`$${forcedSalePrice.toLocaleString()}`} red />
          <Row label="Loss" value={`-$${loss.toLocaleString()}`} red />
          <Row label="Mortgage Payoff" value={`-$${mortgagePayoff.toLocaleString()}`} red />
          <Row label="Prepay Penalty" value={`-$${prepayPenalty.toLocaleString()}`} red />
          <View style={styles.divider} />
          <Row label="Net Proceeds" value={`$${netProceeds.toLocaleString()}`} bold />
        </View>

        <View style={styles.lessons}>
          <Text style={styles.lessonsTitle}>What went wrong:</Text>
          <Text style={styles.bullet}>• Over-leveraged with insufficient cashflow</Text>
          <Text style={styles.bullet}>• No cash reserves to bridge a tight month</Text>
          <Text style={styles.bullet}>• Underperforming asset dragged the portfolio</Text>

          <Text style={[styles.lessonsTitle, { marginTop: 12 }]}>How to prevent this:</Text>
          <Text style={styles.bullet}>• Keep 3-6 months of debt service in cash</Text>
          <Text style={styles.bullet}>• Stress-test new debt before adding it</Text>
          <Text style={styles.bullet}>• Cut underperformers before they sink you</Text>
        </View>

        <Pressable style={styles.cta} onPress={onConfirm}>
          <Text style={styles.ctaText}>Take the Loss. Learn the Lesson.</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function Row({ label, value, red, bold }: { label: string; value: string; red?: boolean; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && { fontWeight: '900', color: '#FFFFFF' }]}>{label}</Text>
      <Text style={[styles.rowValue, red && { color: '#F87171' }, bold && { fontWeight: '900' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0608', padding: 24, paddingTop: 60 },
  warningBox: { borderWidth: 3, borderColor: '#F87171', padding: 16, borderRadius: 12, alignItems: 'center' },
  warning: { color: '#F87171', fontSize: 28, fontWeight: '900' },
  message: { color: '#FFFFFF', fontSize: 14, textAlign: 'center', marginVertical: 16, lineHeight: 22 },
  card: { backgroundColor: '#0A0A10', padding: 14, borderRadius: 12 },
  address: { color: '#FFD24A', fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  rowLabel: { color: '#A8A8B3', fontSize: 13 },
  rowValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#2A2A35', marginVertical: 6 },
  lessons: { marginTop: 12 },
  lessonsTitle: { color: '#FFD24A', fontWeight: '800', marginBottom: 4 },
  bullet: { color: '#E6E6E6', fontSize: 12, marginVertical: 2 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
  ctaText: { color: '#08080C', fontWeight: '900' },
});
