import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Note: Requires react-native-qrcode-svg installed.
// Falls back to placeholder block if not available.
let QRCode: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  QRCode = require('react-native-qrcode-svg').default;
} catch {
  QRCode = null;
}

interface Props {
  creatorCode: string;
  creatorName?: string;
  trecNumber?: string;
}

export default function QRCodeDisplay({ creatorCode, creatorName, trecNumber }: Props) {
  const url = `https://freedominvestor.app/ref/${creatorCode}`;
  const size = Dimensions.get('window').width * 0.6;

  return (
    <View style={styles.root}>
      <View style={[styles.frame, { width: size + 24, height: size + 24 }]}>
        {QRCode ? (
          <QRCode value={url} size={size} backgroundColor="#FFFFFF" color="#000000" />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size }]}>
            <Text style={styles.placeholderText}>QR</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>Download Freedom Investor</Text>
      <Text style={styles.sub}>Your first property is waiting.</Text>
      <Text style={styles.url}>freedominvestor.app/ref/{creatorCode}</Text>
      {(creatorName || trecNumber) && (
        <Text style={styles.creator}>
          {creatorName} {trecNumber ? `• TREC ${trecNumber}` : ''}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  frame: { backgroundColor: '#FFFFFF', borderWidth: 6, borderColor: '#FFD24A', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  placeholder: { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 64, fontWeight: '900', color: '#08080C' },
  title: { color: '#FFD24A', fontSize: 24, fontWeight: '900', marginTop: 24 },
  sub: { color: '#FFFFFF', fontSize: 14, marginTop: 6 },
  url: { color: '#A8A8B3', fontSize: 12, marginTop: 8 },
  creator: { color: '#777', fontSize: 11, marginTop: 12 },
});
