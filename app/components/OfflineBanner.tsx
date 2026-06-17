import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../lib/theme';

export default function OfflineBanner({ online, pendingCount }: { online: boolean; pendingCount: number }) {
  if (online && pendingCount === 0) return null;

  return (
    <View style={[styles.banner, online ? styles.ok : styles.offline]}>
      <Text style={styles.text}>
        {online ? `${pendingCount} actions en attente` : 'Hors ligne'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  offline: {
    backgroundColor: '#fff3cd',
  },
  ok: {
    backgroundColor: colors.primaryLighter,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});
