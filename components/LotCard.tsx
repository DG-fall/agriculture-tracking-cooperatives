import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/app/lib/theme';
import { fmtDate, shortCode } from '@/app/lib/dakar';
import StatutBadge from './StatutBadge';
import type { Lot } from '@/app/hooks/useLots';

export default function LotCard({ lot, onPress }: { lot: Lot; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Ionicons name="leaf" size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>{lot.culture}</Text>
          <StatutBadge statut={lot.statut} />
        </View>
        <Text style={styles.sub} numberOfLines={1}>
          {lot.variete ? `${lot.variete} · ` : ''}{lot.superficie_ha ? `${lot.superficie_ha} ha` : 'Surface n/c'}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="qr-code-outline" size={13} color={colors.textMuted} />
          <Text style={styles.meta}>{shortCode(lot.code_qr)}</Text>
          <Ionicons name="calendar-outline" size={13} color={colors.textMuted} style={{ marginLeft: 10 }} />
          <Text style={styles.meta}>{fmtDate(lot.date_recolte || lot.created_at)}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.border} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.lg, padding: 14, marginBottom: 12, gap: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  iconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#E6F2EB', alignItems: 'center', justifyContent: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { fontSize: 16, fontWeight: '800', color: colors.text, flex: 1 },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 3 },
  meta: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
});
