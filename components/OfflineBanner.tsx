import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/app/lib/theme';

export default function OfflineBanner({ online, pendingCount }: { online: boolean; pendingCount: number }) {
  if (online && pendingCount === 0) return null;
  if (!online) {
    return (
      <View style={[styles.bar, { backgroundColor: colors.danger }]}>
        <Ionicons name="cloud-offline-outline" size={16} color="#fff" />
        <Text style={styles.txt}>
          Mode hors-ligne{pendingCount > 0 ? ` — ${pendingCount} action(s) en attente` : ''}
        </Text>
      </View>
    );
  }
  return (
    <View style={[styles.bar, { backgroundColor: colors.warning }]}>
      <Ionicons name="sync-outline" size={16} color="#fff" />
      <Text style={styles.txt}>{pendingCount} action(s) en cours de synchronisation…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 7, gap: 7 },
  txt: { color: '#fff', fontSize: 12.5, fontWeight: '700' },
});
