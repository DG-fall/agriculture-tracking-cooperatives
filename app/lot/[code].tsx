import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/app/lib/supabase';
import { useLots } from '@/app/hooks/useLots';
import { useAuth } from '@/app/contexts/AuthContext';
import { colors, radius, statutMeta } from '@/app/lib/theme';
import { fmtDate, fmtDateTime } from '@/app/lib/dakar';
import StatutBadge from '@/app/components/StatutBadge';
import QRGenerator from '@/app/components/QRGenerator';

export default function LotDetail() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const insets = useSafeAreaInsets();
  const { lots, updateStatus } = useLots();
  const { isAdmin } = useAuth();
  const [hist, setHist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const lot = lots.find((l) => l.code_qr === code);

  const loadHist = useCallback(async () => {
    if (!lot) { setLoading(false); return; }
    try {
      const { data } = await supabase.from('historique_lots').select('*').eq('lot_id', lot.id).order('date_action', { ascending: false });
      setHist(data || []);
    } catch {} finally { setLoading(false); }
  }, [lot]);
  useEffect(() => { loadHist(); }, [loadHist]);

  const printLabel = () => {
    if (!lot) return;
    const labelContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; display: flex; justify-content: center; }
            .label { border: 2px solid #000; padding: 20px; width: 300px; text-align: center; }
            .title { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
            .info { font-size: 16px; margin: 5px 0; }
            img { margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="title">Lot : ${lot.code_qr}</div>
            <div class="info">Culture : ${lot.culture}</div>
            <div class="info">Variété : ${lot.variete || 'Non renseignée'}</div>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=10&data=${encodeURIComponent(`traceagri://lot/${lot.code_qr}`)}" alt="QR Code" />
          </div>
        </body>
      </html>
    `;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(labelContent);
        w.document.close();
        w.focus();
        w.print();
      }
    }
  };

  if (!lot) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.border} />
        <Text style={styles.muted}>Lot introuvable pour ce code.</Text>
        <Pressable onPress={() => router.back()}><Text style={styles.link}>Retour</Text></Pressable>
      </View>
    );
  }

  const change = async (s: string) => { await updateStatus(lot, s); await loadHist(); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.topbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()}><Ionicons name="chevron-back" size={26} color={colors.primaryDark} /></Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>{lot.culture}</Text>
        <View style={{ width: 26 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.qrCard}><QRGenerator code={lot.code_qr} /></View>
        <Pressable style={styles.printBtn} onPress={printLabel}>
          <Ionicons name="print-outline" size={20} color="#fff" />
          <Text style={styles.printBtnTxt}>Imprimer / Télécharger étiquette</Text>
        </Pressable>
        <View style={styles.card}>
          <View style={styles.rowTop}>
            <Text style={styles.cult}>{lot.culture}</Text>
            <StatutBadge statut={lot.statut} />
          </View>
          <Info label="Variété" value={lot.variete || '—'} />
          <Info label="Superficie" value={lot.superficie_ha ? `${lot.superficie_ha} ha` : '—'} />
          <Info label="Semis" value={lot.date_semis ? fmtDate(lot.date_semis) : '—'} />
          <Info label="Récolte" value={lot.date_recolte ? fmtDate(lot.date_recolte) : '—'} />
          <Info label="Localisation" value={lot.localisation || '—'} />
          <Info label="Latitude" value={lot.latitude ? lot.latitude.toString() : '—'} />
          <Info label="Longitude" value={lot.longitude ? lot.longitude.toString() : '—'} />
        </View>
        {lot.latitude && lot.longitude && Platform.OS === 'web' && typeof window !== 'undefined' && (
          <View style={styles.mapContainer}>
            <Text style={styles.section}>Emplacement de la parcelle</Text>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lot.longitude - 0.01}%2C${lot.latitude - 0.01}%2C${lot.longitude + 0.01}%2C${lot.latitude + 0.01}&layer=mapnik&marker=${lot.latitude}%2C${lot.longitude}`}
              style={styles.map}
              loading="lazy"
            />
          </View>
        )}

        {isAdmin && (
          <>
            <Text style={styles.section}>Changer le statut</Text>
            <View style={styles.statRow}>
              {Object.keys(statutMeta).map((k) => (
                <Pressable key={k} onPress={() => change(k)} style={[styles.statBtn, lot.statut === k && { backgroundColor: statutMeta[k].bg, borderColor: statutMeta[k].color }]}>
                  <Text style={[styles.statBtnTxt, lot.statut === k && { color: statutMeta[k].color }]}>{statutMeta[k].label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Text style={styles.section}>Historique de traçabilité</Text>
        {loading ? <ActivityIndicator color={colors.primary} /> : hist.length === 0 ? (
          <Text style={styles.muted}>Aucun événement enregistré.</Text>
        ) : hist.map((h) => (
          <View key={h.id} style={styles.histItem}>
            <View style={styles.dot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.histTitle}>{h.description || h.type_action}</Text>
              <Text style={styles.histMeta}>{fmtDateTime(h.date_action)}{h.auteur_nom ? ` · ${h.auteur_nom}` : ''}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLbl}>{label}</Text>
      <Text style={styles.infoVal}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: colors.bg },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  topTitle: { fontSize: 17, fontWeight: '900', color: colors.primaryDark, flex: 1, textAlign: 'center' },
  qrCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  printBtn: { flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, padding: 14, borderRadius: radius.md, marginBottom: 16 },
  printBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cult: { fontSize: 20, fontWeight: '900', color: colors.text },
  info: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
  infoLbl: { fontSize: 13.5, color: colors.textMuted, fontWeight: '600' },
  infoVal: { fontSize: 14, color: colors.text, fontWeight: '700' },
  section: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 18, marginBottom: 10 },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  statBtnTxt: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  histItem: { flexDirection: 'row', gap: 12, paddingVertical: 10, alignItems: 'flex-start' },
  dot: { width: 10, height: 10, borderRadius: 6, backgroundColor: colors.primary, marginTop: 4 },
  histTitle: { fontSize: 14.5, fontWeight: '700', color: colors.text },
  histMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  muted: { color: colors.textMuted, fontSize: 13.5 },
  link: { color: colors.primary, fontWeight: '800', marginTop: 8 },
  mapContainer: { marginTop: 18 },
  map: { width: '100%', height: 300, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
});
