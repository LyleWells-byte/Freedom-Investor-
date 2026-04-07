import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import AssetClassTile from '../../components/academy/AssetClassTile';
import ProgressRoadmap from '../../components/academy/ProgressRoadmap';
import { ASSET_CLASSES, getAssetClass } from '../../data/assetClasses';
import { EDUCATION_CARDS } from '../../data/educationCards';
import { isAssetClassAvailable, purchaseEarlyUnlock } from '../../engine/UnlockEngine';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  navigation: { navigate: (s: string, p?: any) => void };
}

const RECESSION_PLAYBOOK = [
  { id: 'survive_crash', title: 'Survive the Crash', icon: '🛟' },
  { id: 'buy_dip', title: 'Buy the Dip', icon: '📉' },
  { id: 'rate_trap', title: 'The Rate Trap', icon: '⚠️' },
];

const TAX_STRATEGY = [
  { id: 'depreciation_explained', title: 'Depreciation' },
  { id: 'reps_explained', title: 'REPS' },
  { id: 'cost_seg_explained', title: 'Cost Seg' },
  { id: '1031_exchange', title: '1031 Exchange' },
];

export default function FreedomAcademyScreen({ navigation }: Props) {
  const player = usePlayerStore((s) => s.player);
  const playerLevel = player?.level ?? 1;
  const isAgent = player?.avatar_type === 'agent';
  const [completed] = useState<string[]>([]);
  const [purchased, setPurchased] = useState<string[]>([]);
  const [modalAsset, setModalAsset] = useState<string | null>(null);

  const totalCards = EDUCATION_CARDS.length;
  const completedCount = completed.length;

  const onUnlockTap = (assetId: string) => {
    const a = getAssetClass(assetId);
    if (a?.isFreeOrPaid === 'paid_unlock') {
      setModalAsset(assetId);
    }
  };

  const confirmPurchase = async () => {
    if (!modalAsset || !player) return;
    const ok = await purchaseEarlyUnlock(modalAsset, player.id);
    if (ok) setPurchased((p) => [...p, modalAsset]);
    setModalAsset(null);
  };

  const modalAssetObj = modalAsset ? getAssetClass(modalAsset) : null;

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.header}>Freedom Academy</Text>
      <Text style={styles.sub}>The knowledge that builds the wealth.</Text>
      <Text style={styles.stats}>
        {completedCount} of {totalCards} cards completed • {player?.xp ?? 0} XP earned
      </Text>

      <Text style={styles.section}>Progress Roadmap</Text>
      <ProgressRoadmap playerLevel={playerLevel} completedCardIds={completed} />

      <Text style={styles.section}>Asset Classes</Text>
      <View style={styles.grid}>
        {ASSET_CLASSES.map((a) => {
          const available = isAssetClassAvailable(a.id, playerLevel, purchased);
          const completedHere = a.educationCardIds.filter((id) => completed.includes(id)).length;
          return (
            <AssetClassTile
              key={a.id}
              assetClass={a}
              isLocked={!available}
              cardsCompleted={completedHere}
              totalCards={a.educationCardIds.length}
              onPress={() =>
                navigation.navigate('EducationCard', { cardId: a.educationCardIds[0] })
              }
              onUnlock={() => onUnlockTap(a.id)}
            />
          );
        })}
      </View>

      <Text style={styles.section}>Recession Playbook</Text>
      <Text style={styles.subSection}>What to do when the market turns.</Text>
      {RECESSION_PLAYBOOK.map((s) => (
        <Pressable key={s.id} style={styles.row}>
          <Text style={styles.rowIcon}>{s.icon}</Text>
          <Text style={styles.rowTitle}>{s.title}</Text>
        </Pressable>
      ))}

      <Text style={styles.section}>Tax Strategy</Text>
      <Text style={styles.subSection}>The highest-value cards in the academy.</Text>
      {TAX_STRATEGY.map((s) => (
        <Pressable
          key={s.id}
          style={styles.row}
          onPress={() => navigation.navigate('EducationCard', { cardId: s.id })}
        >
          <Text style={styles.rowIcon}>📘</Text>
          <Text style={styles.rowTitle}>{s.title}</Text>
        </Pressable>
      ))}

      {isAgent && (
        <>
          <Text style={styles.section}>Agent Path</Text>
          <Text style={styles.subSection}>Exclusive content for licensed agents.</Text>
          {[
            'Using your commission to fund deals',
            'REPS via agent status',
            'MLS access advantage',
            'Building a team under you',
          ].map((title) => (
            <View key={title} style={styles.row}>
              <Text style={styles.rowIcon}>🏡</Text>
              <Text style={styles.rowTitle}>{title}</Text>
            </View>
          ))}
        </>
      )}

      <Modal visible={!!modalAsset} transparent animationType="fade">
        <View style={styles.modalRoot}>
          <View style={styles.modalCard}>
            {modalAssetObj && (
              <>
                <Text style={styles.modalTitle}>Skip to {modalAssetObj.name}</Text>
                <Text style={styles.modalText}>
                  Get early access before Level {modalAssetObj.unlockLevel}.{'\n'}$
                  {modalAssetObj.earlyUnlockPrice} one-time unlock.{'\n'}Includes all{' '}
                  {modalAssetObj.educationCardIds.length} education cards.
                </Text>
                <Pressable style={styles.modalBtn} onPress={confirmPurchase}>
                  <Text style={styles.modalBtnText}>
                    Confirm — ${modalAssetObj.earlyUnlockPrice}
                  </Text>
                </Pressable>
                <Pressable onPress={() => setModalAsset(null)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C', paddingTop: 50, paddingHorizontal: 16 },
  header: { color: '#FFFFFF', fontSize: 28, fontWeight: '900' },
  sub: { color: '#A8A8B3', marginTop: 4 },
  stats: { color: '#FFD24A', marginTop: 8, fontSize: 12, fontWeight: '700' },
  section: { color: '#FFD24A', fontSize: 18, fontWeight: '900', marginTop: 24, marginBottom: 4 },
  subSection: { color: '#A8A8B3', fontSize: 12, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101018', padding: 14, borderRadius: 10, marginBottom: 8 },
  rowIcon: { fontSize: 22, marginRight: 12 },
  rowTitle: { color: '#FFFFFF', fontWeight: '700' },
  modalRoot: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#101018', padding: 24, borderRadius: 16 },
  modalTitle: { color: '#FFD24A', fontWeight: '900', fontSize: 20, marginBottom: 12 },
  modalText: { color: '#E6E6E6', fontSize: 14, lineHeight: 22 },
  modalBtn: { backgroundColor: '#FFD24A', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  modalBtnText: { color: '#08080C', fontWeight: '900' },
  modalCancel: { color: '#A8A8B3', textAlign: 'center', marginTop: 12 },
});
