import React from 'react';
import UnlockCelebration from '../../components/academy/UnlockCelebration';
import { getAssetClass } from '../../data/assetClasses';
import { View, Text } from 'react-native';

interface Props {
  route: { params: { assetClassId: string } };
  navigation: { navigate: (s: string, p?: any) => void; goBack: () => void };
}

export default function AssetClassUnlockScreen({ route, navigation }: Props) {
  const { assetClassId } = route.params;
  const a = getAssetClass(assetClassId);

  if (!a) {
    return (
      <View style={{ flex: 1, backgroundColor: '#08080C', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#F87171' }}>Asset class not found.</Text>
      </View>
    );
  }

  return (
    <UnlockCelebration
      assetClass={a}
      onStart={() => navigation.navigate('FreedomAcademy', { focusAssetClass: a.id })}
      onLater={() => navigation.goBack()}
    />
  );
}
