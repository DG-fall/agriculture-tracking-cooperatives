import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, statutMeta, radius } from '@/app/lib/theme';

export default function StatutBadge({ statut }: { statut: string }) {
  const meta = statutMeta[statut] || { label: statut, color: colors.textMuted, bg: colors.card };
  return (
    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
      <Text style={[styles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
  },
});
