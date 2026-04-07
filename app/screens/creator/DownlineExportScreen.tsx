import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share, Alert } from 'react-native';
import { exportDownlineCSV } from '../../engine/CreatorEngine';
import type { RecruitFilters } from '../../types/creator';

export default function DownlineExportScreen() {
  const [filters] = useState<RecruitFilters>({});
  const [count] = useState(0); // TODO: live count from filtered query
  const [exporting, setExporting] = useState(false);

  const onExport = async () => {
    setExporting(true);
    try {
      const csv = await exportDownlineCSV('lyle', filters);
      await Share.share({ message: csv, title: 'Freedom Investor Downline' });
    } catch (e) {
      Alert.alert('Export failed', String(e));
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Export Downline</Text>
      <Text style={styles.sub}>Filter your downline and export to CSV.</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Avatar Type</Text>
        <Text style={styles.placeholder}>All</Text>

        <Text style={styles.label}>Level Range</Text>
        <Text style={styles.placeholder}>1 — 20+</Text>

        <Text style={styles.label}>Last Active</Text>
        <Text style={styles.placeholder}>All</Text>

        <Text style={styles.label}>Wolf Pack Status</Text>
        <Text style={styles.placeholder}>All</Text>

        <Text style={styles.label}>Min Engagement Score</Text>
        <Text style={styles.placeholder}>0</Text>
      </View>

      <Text style={styles.preview}>{count} players match your filters</Text>

      <Pressable style={styles.cta} onPress={onExport} disabled={exporting}>
        <Text style={styles.ctaText}>{exporting ? 'Exporting…' : 'Export CSV'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  sub: { color: '#A8A8B3', marginVertical: 8 },
  box: { backgroundColor: '#101018', padding: 16, borderRadius: 12, marginVertical: 12 },
  label: { color: '#FFD24A', fontSize: 12, marginTop: 8 },
  placeholder: { color: '#E6E6E6', fontSize: 14, marginTop: 2 },
  preview: { color: '#FFD24A', textAlign: 'center', fontWeight: '800', marginVertical: 16 },
  cta: { backgroundColor: '#FFD24A', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  ctaText: { color: '#08080C', fontWeight: '900' },
});
