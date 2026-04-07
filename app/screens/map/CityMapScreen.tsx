import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NeighborhoodZone from '../../components/map/NeighborhoodZone';
import MarketTickerBanner from '../../components/map/MarketTickerBanner';
import { initializeMarketState } from '../../engine/MarketEngine';
import { generateListings } from '../../engine/PropertyGenerator';
import { usePlayerStore } from '../../store/playerStore';
import type { NeighborhoodClass } from '../../types/property';

interface Props {
  navigation: { navigate: (screen: string, params?: any) => void };
}

export default function CityMapScreen({ navigation }: Props) {
  const player = usePlayerStore((s) => s.player);
  const [marketState] = useState(() => initializeMarketState());

  const isAgent = player?.avatar_type === 'agent';
  const counts = useMemo(() => {
    return {
      A: generateListings({ neighborhoodClass: 'A', isAgentAvatar: isAgent }).length,
      B: generateListings({ neighborhoodClass: 'B', isAgentAvatar: isAgent }).length,
      C: generateListings({ neighborhoodClass: 'C', isAgentAvatar: isAgent }).length,
      D: generateListings({ neighborhoodClass: 'D', isAgentAvatar: isAgent }).length,
    };
  }, [isAgent]);

  const level = player?.level ?? 1;
  const dLocked = level < 10;

  const goTo = (cls: NeighborhoodClass) => {
    navigation.navigate('PropertyListing', { neighborhoodClass: cls });
  };

  return (
    <View style={styles.root}>
      <MarketTickerBanner marketState={marketState} monthlyCashflow={0} lastEventName={null} />

      <View style={styles.grid}>
        <View style={styles.row}>
          <NeighborhoodZone
            neighborhoodClass="A"
            isLocked={false}
            availableCount={counts.A}
            currentPriceIndex={marketState.price_index.A}
            currentVacancyRate={marketState.vacancy.A}
            trendDirection="up"
            onPress={() => goTo('A')}
          />
          <NeighborhoodZone
            neighborhoodClass="B"
            isLocked={false}
            availableCount={counts.B}
            currentPriceIndex={marketState.price_index.B}
            currentVacancyRate={marketState.vacancy.B}
            trendDirection="up"
            onPress={() => goTo('B')}
          />
        </View>
        <View style={styles.row}>
          <NeighborhoodZone
            neighborhoodClass="C"
            isLocked={false}
            availableCount={counts.C}
            currentPriceIndex={marketState.price_index.C}
            currentVacancyRate={marketState.vacancy.C}
            trendDirection="flat"
            onPress={() => goTo('C')}
          />
          <NeighborhoodZone
            neighborhoodClass="D"
            isLocked={dLocked}
            availableCount={counts.D}
            currentPriceIndex={marketState.price_index.D}
            currentVacancyRate={marketState.vacancy.D}
            trendDirection="down"
            onPress={() => goTo('D')}
          />
        </View>
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statText}>Cash: ${(player?.cash_balance ?? 0).toLocaleString()}</Text>
        <Text style={styles.statText}>CF: $0</Text>
        <Text style={styles.statText}>Net Worth: ${(player?.cash_balance ?? 0).toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C' },
  grid: { flex: 1, padding: 8 },
  row: { flex: 1, flexDirection: 'row' },
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, backgroundColor: '#0A0A10', borderTopWidth: 1, borderTopColor: '#1A1A22' },
  statText: { color: '#FFD24A', fontWeight: '800', fontSize: 12 },
});
