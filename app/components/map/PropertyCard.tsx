import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { CardRarity, PropertyListing } from '../../types/property';

interface Props {
  listing: PropertyListing;
  onAnalyze: (l: PropertyListing) => void;
  onBuy: (l: PropertyListing) => void;
}

const RARITY_COLOR: Record<CardRarity, string> = {
  standard: '#FFFFFF',
  good: '#4A90E2',
  great: '#FFD24A',
  trophy: '#A855F7',
};

const ASSET_ICON: Record<string, string> = {
  sfr: '🏠',
  flip: '🔨',
  brrrr: '🛠️',
  str: '🏖️',
  rent_by_room: '🛏️',
  small_mf: '🏘️',
  storage: '📦',
  lease_arbitrage: '📑',
  large_mf: '🏢',
  commercial: '🏬',
  car_wash: '🚗',
  hotel: '🏨',
};

export default function PropertyCard({ listing, onAnalyze, onBuy }: Props) {
  const stars = '★'.repeat(listing.condition_rating) + '☆'.repeat(5 - listing.condition_rating);
  const border = RARITY_COLOR[listing.card_rarity];

  return (
    <View style={[styles.card, { borderColor: border }]}>
      <View style={styles.row}>
        <Text style={styles.icon}>{ASSET_ICON[listing.asset_class] ?? '🏠'}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{listing.asset_class.toUpperCase()}</Text>
        </View>
        <View style={[styles.classBadge, { backgroundColor: border }]}>
          <Text style={styles.classBadgeText}>{listing.neighborhood_class}</Text>
        </View>
      </View>

      <Text style={styles.address}>{listing.address}</Text>
      <Text style={styles.price}>${listing.purchase_price.toLocaleString()}</Text>
      <Text style={styles.stars}>{stars}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Rent</Text>
          <Text style={styles.statValue}>${listing.projected_rent.toLocaleString()}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>CF/mo</Text>
          <Text style={styles.statValue}>${listing.projected_cashflow.toLocaleString()}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>CoC</Text>
          <Text style={styles.statValue}>{listing.cash_on_cash_return}%</Text>
        </View>
      </View>

      <Text style={styles.dom}>Days on market: {listing.days_on_market}</Text>

      <View style={styles.buttons}>
        <Pressable style={styles.analyze} onPress={() => onAnalyze(listing)}>
          <Text style={styles.analyzeText}>Analyze</Text>
        </Pressable>
        <Pressable style={styles.buy} onPress={() => onBuy(listing)}>
          <Text style={styles.buyText}>Buy Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101018', borderWidth: 2, borderRadius: 14, padding: 14, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 26, marginRight: 8 },
  badge: { backgroundColor: '#1A1A22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 8 },
  badgeText: { color: '#FFD24A', fontSize: 11, fontWeight: '800' },
  classBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginLeft: 'auto' },
  classBadgeText: { color: '#08080C', fontSize: 12, fontWeight: '900' },
  address: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 8 },
  price: { color: '#FFD24A', fontSize: 24, fontWeight: '900', marginTop: 4 },
  stars: { color: '#FFD24A', fontSize: 14, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: 10 },
  stat: { flex: 1 },
  statLabel: { color: '#777', fontSize: 11 },
  statValue: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  dom: { color: '#777', fontSize: 11, marginTop: 8 },
  buttons: { flexDirection: 'row', marginTop: 12 },
  analyze: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#444', borderRadius: 10, alignItems: 'center', marginRight: 8 },
  analyzeText: { color: '#E6E6E6', fontWeight: '700' },
  buy: { flex: 1, paddingVertical: 12, backgroundColor: '#FFD24A', borderRadius: 10, alignItems: 'center' },
  buyText: { color: '#08080C', fontWeight: '900' },
});
