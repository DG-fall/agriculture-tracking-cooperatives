import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/app/contexts/AuthContext';
import { useLots } from '@/app/hooks/useLots';
import { colors, radius, spacing } from '@/app/lib/theme';
import OfflineBanner from '@/app/components/OfflineBanner';

export default function Dashboard() {
  const { coop, membre, isAdmin, signOut } = useAuth();
  const { lots, online, pendingCount, refresh, loading } = useLots();
  const insets = useSafeAreaInsets();

  const counts = lots.reduce((acc, l) => { acc[l.statut] = (acc[l.statut] ?? 0) + 1; return acc; }, {} as Record<string, number>);
  const totalHa = lots.reduce((s, l) => s + Number(l.superficie_ha ?? 0), 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top }} />
      <OfflineBanner online={online} pendingCount={pendingCount} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{membre?.nom?.charAt(0).toUpperCase() || 'U'}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Bonjour, {membre?.nom?.split(' ')[0] || 'Membre'}</Text>
              <Text style={styles.coopName}>{coop?.nom}</Text>
            </View>
          </View>
          <Pressable onPress={signOut} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconWrap}>
              <Ionicons name="cube-outline" size={28} color="#ffffff" />
            </View>
            <View>
              <Text style={[styles.statValue, styles.statValueWhite]}>{lots.length}</Text>
              <Text style={[styles.statLabel, styles.statLabelWhite]}>Total Lots</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, styles.statIconWrapLight]}>
              <Ionicons name="checkmark-done-outline" size={28} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.statValue}>{counts['en_stock'] ?? 0}</Text>
              <Text style={styles.statLabel}>En Stock</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <Pressable style={styles.viewAllBtn} onPress={() => router.push('/(tabs)/lots')}>
              <Text style={styles.viewAllText}>Voir tout</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary} />
            </Pressable>
          </View>
          <View style={styles.actionsGrid}>
            <Action icon="add-circle-outline" label="Nouveau lot" color={colors.primary} bg={colors.primaryLighter} onPress={() => router.push('/(tabs)/lots')} />
            <Action icon="qr-code-outline" label="Scanner QR" color={colors.primary} bg={colors.primaryLighter} onPress={() => router.push('/(tabs)/scan')} />
            <Action icon="document-text-outline" label="Rapport" color={colors.blue} bg={colors.blueLight} onPress={() => router.push('/(tabs)/rapport')} />
            {isAdmin && (
              <Action icon="people-outline" label="Membres" color={colors.primary} bg={colors.primaryLighter} onPress={() => router.push('/members')} />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récapitulatif</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Ionicons name="leaf-outline" size={20} color={colors.primary} />
              <Text style={styles.summaryLabel}>Surface totale</Text>
              <Text style={styles.summaryValue}>{Math.round(totalHa * 100) / 100} ha</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="business-outline" size={20} color={colors.primary} />
              <Text style={styles.summaryLabel}>Coopérative</Text>
              <Text style={styles.summaryValue}>{coop?.code_coop || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Action({ icon, label, color, bg, onPress }: { icon: any; label: string; color: string; bg: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.8 }]} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  greeting: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 3,
  },
  coopName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  logoutBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  statCardPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statIconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconWrapLight: {
    backgroundColor: colors.primaryLighter,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
  },
  statValueWhite: {
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '700',
  },
  statLabelWhite: {
    color: '#e0ffe5',
  },

  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionBtn: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },

  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
  },
});
