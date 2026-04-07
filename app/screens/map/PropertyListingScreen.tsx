import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import PropertyCard from '../../components/map/PropertyCard';
import { generateListings } from '../../engine/PropertyGenerator';
import { usePlayerStore } from '../../store/playerStore';
import type { NeighborhoodClass, PropertyListing } from '../../types/property';

interface Props {
  route: { params: { neighborhoodClass: NeighborhoodClass } };
  navigation: { navigate: (screen: string, params?: any) => void };
}

const ZONE_NAMES: Record<NeighborhoodClass, string> = {
  A: 'Prestige Hills',
  B: 'Midtown Grove',
  C: 'Riverside District',
  D: 'Eastside',
};

type SortKey = 'price' | 'cashflow' | 'roi' | 'newest';

export default function PropertyListingScreen({ route, navigation }: Props) {
  const { neighborhoodClass } = route.params;
  const player = usePlayerStore((s) => s.player);
  const isAgent = player?.avatar_type === 'agent';

  const [sort, setSort] = useState<SortKey>('cashflow');
  const [listings] = useState<PropertyListing[]>(() =>
    generateListings({ neighborhoodClass, isAgentAvatar: isAgent })
  );

  const sorted = useMemo(() => {
    const arr = [...listings];
    switch (sort) {
      case 'price':
        return arr.sort((a, b) => a.purchase_price - b.purchase_price);
      case 'cashflow':
        return arr.sort((a, b) => b.projected_cashflow - a.projected_cashflow);
      case 'roi':
        return arr.sort((a, b) => b.cash_on_cash_return - a.cash_on_cash_return);
      case 'newest':
        return arr.sort((a, b) => a.days_on_market - b.days_on_market);
    }
  }, [listings, sort]);

  const avgPrice = Math.round(listings.reduce((s, l) => s + l.purchase_price, 0) / listings.length);
  const avgRent = Math.round(listings.reduce((s, l) => s + l.projected_rent, 0) / listings.length);

  return (
    <View style={styles.root}>
      <Text style={styles.header}>{ZONE_NAMES[neighborhoodClass]}</Text>
      <Text style={styles.classBadge}>{neighborhoodClass}-Class</Text>
      <Text style={styles.subStats}>
        Avg Price: ${avgPrice.toLocaleString()} • Avg Rent: ${avgRent.toLocaleString()} • Trend: ↑
      </Text>

      <View style={styles.sortRow}>
        {(['price', 'cashflow', 'roi', 'newest'] as SortKey[]).map((k) => (
          <Pressable
            key={k}
            style={[styles.sortChip, sort === k && styles.sortChipOn]}
            onPress={() => setSort(k)}
          >
            <Text style={[styles.sortText, sort === k && styles.sortTextOn]}>{k}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard
            listing={item}
            onAnalyze={(l) => navigation.navigate('PropertyAnalyze', { listing: l })}
            onBuy={(l) => navigation.navigate('PurchaseFlow', { listing: l })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  classBadge: { color: '#FFD24A', fontWeight: '800', marginTop: 4 },
  subStats: { color: '#A8A8B3', marginTop: 6, fontSize: 12 },
  sortRow: { flexDirection: 'row', marginTop: 14, marginBottom: 12 },
  sortChip: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#101018', borderRadius: 14, marginRight: 8, borderWidth: 1, borderColor: '#222' },
  sortChipOn: { backgroundColor: '#FFD24A', borderColor: '#FFD24A' },
  sortText: { color: '#A8A8B3', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  sortTextOn: { color: '#08080C' },
});
