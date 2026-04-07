import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import QRCodeDisplay from './QRCodeDisplay';

interface Scene {
  id: string;
  duration: number; // ms
  render: () => React.ReactNode;
}

interface Props {
  creatorCode: string;
  creatorName: string;
  onExit: () => void;
}

export default function EventDemoPlayer({ creatorCode, creatorName, onExit }: Props) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const scenes: Scene[] = [
    { id: 'intro', duration: 8000, render: SceneIntro },
    { id: 'avatar', duration: 10000, render: SceneAvatar },
    { id: 'map', duration: 8000, render: SceneMap },
    { id: 'purchase', duration: 12000, render: ScenePurchase },
    { id: 'event', duration: 10000, render: SceneEvent },
    { id: 'tax', duration: 15000, render: SceneTax },
    { id: 'wolfpack', duration: 12000, render: SceneWolfPack },
    { id: 'qr', duration: 30000, render: () => <QRCodeDisplay creatorCode={creatorCode} creatorName={creatorName} /> },
  ];

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      setSceneIdx((i) => (i + 1) % scenes.length);
    }, scenes[sceneIdx].duration);
    return () => clearTimeout(t);
  }, [sceneIdx, paused, scenes]);

  return (
    <Pressable style={styles.root} onPress={() => setShowControls((s) => !s)}>
      <View style={styles.scene}>{scenes[sceneIdx].render()}</View>

      {showControls && (
        <View style={styles.controls}>
          <Pressable onPress={() => setSceneIdx(0)}>
            <Text style={styles.ctrl}>⏮ Restart</Text>
          </Pressable>
          <Pressable onPress={() => setPaused((p) => !p)}>
            <Text style={styles.ctrl}>{paused ? '▶ Play' : '⏸ Pause'}</Text>
          </Pressable>
          <Pressable onPress={() => setSceneIdx((i) => (i + 1) % scenes.length)}>
            <Text style={styles.ctrl}>⏭ Skip</Text>
          </Pressable>
          <Pressable onPress={onExit}>
            <Text style={styles.ctrl}>✕ Exit</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

function SceneIntro() {
  return (
    <View style={styles.center}>
      <Text style={styles.logo}>FREEDOM INVESTOR</Text>
      <Text style={styles.tag}>Build Wealth. Offset Taxes. Live Free.</Text>
      <Text style={styles.sub}>The real estate game that trains you how money actually works.</Text>
    </View>
  );
}
function SceneAvatar() {
  return (
    <View style={styles.center}>
      <Text style={styles.h}>First — who are you?</Text>
      <Text style={styles.row}>🏡 Agent  📈 New Investor  💼 W2  🏢 Owner</Text>
      <Text style={styles.sub}>Your avatar determines your starting advantages. Just like real life.</Text>
    </View>
  );
}
function SceneMap() {
  return (
    <View style={styles.center}>
      <Text style={styles.h}>$185,000 Property</Text>
      <Text style={styles.gold}>$340/mo cashflow</Text>
      <Text style={styles.sub}>B-Class. Solid fundamentals. This is where most investors start.</Text>
    </View>
  );
}
function ScenePurchase() {
  return (
    <View style={styles.center}>
      <Text style={styles.h}>Deal Closed. 🔑</Text>
      <Text style={styles.gold}>+$340/mo to your portfolio</Text>
    </View>
  );
}
function SceneEvent() {
  return (
    <View style={styles.center}>
      <Text style={styles.red}>⚡ Fed Raises Rates 0.75%</Text>
      <Text style={styles.sub}>
        Existing properties unaffected. Smart investors already locked in their financing.
      </Text>
    </View>
  );
}
function SceneTax() {
  return (
    <View style={styles.center}>
      <Text style={styles.sub}>W2 Income $120,000</Text>
      <Text style={styles.red}>Tax: $28,400</Text>
      <Text style={styles.sub}>But this year was different.</Text>
      <Text style={styles.gold}>$5,600 SAVED</Text>
      <Text style={styles.sub}>Real math. IRS-legal.</Text>
    </View>
  );
}
function SceneWolfPack() {
  return (
    <View style={styles.center}>
      <Text style={styles.wolf}>🐺</Text>
      <Text style={styles.gold}>WOLF PACK</Text>
      <Text style={styles.sub}>Move your license. Get $250,000 in instant capital.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08080C' },
  scene: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  center: { alignItems: 'center' },
  logo: { color: '#FFD24A', fontSize: 36, fontWeight: '900', letterSpacing: 2 },
  tag: { color: '#FFFFFF', fontSize: 18, marginTop: 16, textAlign: 'center', fontWeight: '800' },
  sub: { color: '#A8A8B3', textAlign: 'center', marginTop: 8 },
  h: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  gold: { color: '#FFD24A', fontSize: 32, fontWeight: '900', marginVertical: 8 },
  red: { color: '#F87171', fontSize: 24, fontWeight: '900', marginVertical: 8 },
  row: { color: '#FFFFFF', fontSize: 18, marginTop: 16 },
  wolf: { fontSize: 90 },
  controls: { position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#101018cc', padding: 12, borderRadius: 10 },
  ctrl: { color: '#FFD24A', fontWeight: '700' },
});
