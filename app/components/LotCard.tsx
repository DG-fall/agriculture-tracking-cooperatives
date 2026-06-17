import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../lib/theme';
import { statutMeta } from '../lib/theme';

type Lot = { id: string; code_qr: string; culture: string; statut: string; variete?: string };

export default function LotCard({ lot, onPress }: { lot: Lot; onPress?: () => void }) {
  const meta = statutMeta[lot.statut] || { label: 'Inconnu', color: '#64748b', bg: '#f1f5f9' };
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.top}>
        <View>
          <Text style={styles.culture}>{lot.culture}</Text>
          {lot.variete && <Text style={styles.variete}>{lot.variete}</Text>}
          <Text style={styles.code}>{lot.code_qr}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: meta.bg }]}>
          <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  culture: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  variete: {
    fontSize: 13,
    color: colors.textMuted,
  },
  code: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
