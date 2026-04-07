import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../constants/theme';
import type { AppNotification, NotificationType } from '../../types/notifications';

const COLOR: Record<NotificationType, string> = {
  market_event: COLORS.warning,
  monthly_report: COLORS.info,
  level_up: COLORS.gold,
  wolf_pack_lead: COLORS.negative,
  debt_warning: COLORS.negative,
  pack_message: COLORS.info,
  achievement: COLORS.gold,
};

export default function NotificationCenterScreen() {
  const [items, setItems] = useState<AppNotification[]>([]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Pressable onPress={() => setItems([])}>
          <Text style={styles.clear}>Clear All</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        ListEmptyComponent={<Text style={styles.empty}>No notifications.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.row, { borderLeftColor: COLOR[item.type] }]}>
            <Text style={styles.notifTitle}>{item.title}</Text>
            <Text style={styles.notifBody}>{item.body}</Text>
            <Text style={styles.notifTime}>{item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '900' },
  clear: { color: COLORS.gold, fontWeight: '700' },
  empty: { color: COLORS.textMuted, textAlign: 'center', marginTop: 40, fontStyle: 'italic' },
  row: { backgroundColor: COLORS.backgroundCard, padding: 14, borderRadius: 10, marginBottom: 8, borderLeftWidth: 4 },
  notifTitle: { color: COLORS.textPrimary, fontWeight: '800' },
  notifBody: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  notifTime: { color: COLORS.textMuted, fontSize: 11, marginTop: 6 },
});
