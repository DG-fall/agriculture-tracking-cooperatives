import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/app/lib/supabase';
import { colors, radius } from '@/app/lib/theme';
import { fmtDateTime } from '@/app/lib/dakar';

export default function DemoScreen() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: d } = await supabase.from('capteurs_demo').select('*').order('timestamp', { ascending: false }).limit(50);
      setData(d || []);
    } catch {} finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 8 }}>
      <Text style={styles.title}>Capteurs ESP32 (Démo)</Text>
      <View style={styles.note}>
        <Ionicons name="information-circle-outline" size={18} color={colors.blue} />
        <Text style={styles.noteTxt}>Données IoT reçues via l'endpoint iot_ingest (hors workflow principal).</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconWrap}><Ionicons name="hardware-chip" size={20} color={colors.blue} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nom || item.capteur_id}</Text>
              <Text style={styles.meta}>{item.type} · {fmtDateTime(item.timestamp)}</Text>
            </View>
            <Text style={styles.val}>{item.valeur}{item.unite}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune donnée capteur. L'ESP32 enverra des relevés toutes les 30 min.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '900', color: colors.primaryDark, paddingHorizontal: 16 },
  note: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.blueLight, marginHorizontal: 16, marginTop: 10, padding: 12, borderRadius: radius.md },
  noteTxt: { flex: 1, fontSize: 12.5, color: colors.blue, fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.md, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '800', color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  val: { fontSize: 18, fontWeight: '900', color: colors.blue },
  empty: { color: colors.textMuted, paddingHorizontal: 16, paddingTop: 30, textAlign: 'center', fontSize: 13.5 },
});
