import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Pressable } from 'react-native';
import type { ChatMessage } from '../../types/clan';

interface Props {
  currentPlayerId: string;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onShareDeal?: () => void;
  onTagEvent?: () => void;
}

export default function PackChat({ currentPlayerId, messages, onSend, onShareDeal, onTagEvent }: Props) {
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => {
          const mine = item.playerId === currentPlayerId;
          return (
            <View style={[styles.row, mine && styles.rowMine]}>
              {!mine && <Text style={styles.author}>{item.playerName}</Text>}
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
                <Text style={mine ? styles.textMine : styles.textOther}>{item.text}</Text>
              </View>
              <Text style={styles.time}>{item.timestamp}</Text>
            </View>
          );
        }}
      />
      <View style={styles.toolbar}>
        <Pressable onPress={onShareDeal}>
          <Text style={styles.tool}>🏠 Deal</Text>
        </Pressable>
        <Pressable onPress={onTagEvent}>
          <Text style={styles.tool}>⚡ Event</Text>
        </Pressable>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Talk strategy with your pack..."
          placeholderTextColor="#555"
        />
        <Pressable onPress={send} style={styles.sendBtn}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  row: { marginVertical: 4, marginHorizontal: 8 },
  rowMine: { alignItems: 'flex-end' },
  author: { color: '#FFD24A', fontSize: 11, marginBottom: 2 },
  bubble: { padding: 10, borderRadius: 12, maxWidth: '80%' },
  bubbleMine: { backgroundColor: '#FFD24A' },
  bubbleOther: { backgroundColor: '#1A1A22' },
  textMine: { color: '#08080C' },
  textOther: { color: '#E6E6E6' },
  time: { color: '#555', fontSize: 10, marginTop: 2 },
  toolbar: { flexDirection: 'row', padding: 8 },
  tool: { color: '#FFD24A', marginRight: 14, fontWeight: '700' },
  inputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: '#1A1A22' },
  input: { flex: 1, backgroundColor: '#101018', color: '#FFFFFF', padding: 10, borderRadius: 10 },
  sendBtn: { backgroundColor: '#FFD24A', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 10, marginLeft: 8 },
  sendText: { color: '#08080C', fontWeight: '900' },
});
