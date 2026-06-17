import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Modal, TextInput, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLots } from '@/app/hooks/useLots';
import { useAuth } from '@/app/contexts/AuthContext';
import { colors, radius } from '@/app/lib/theme';
import OfflineBanner from '@/app/components/OfflineBanner';
import LotCard from '@/app/components/LotCard';

export default function LotsScreen() {
  const { lots, loading, online, pendingCount, refresh, createLot } = useLots();
  const { isAdmin } = useAuth();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState<any>({ culture: '', variete: '', date_semis: '', date_recolte: '', superficie_ha: '', localisation: '', latitude: '', longitude: '' });

  const save = async () => {
    if (!f.culture) return;
    setBusy(true);
    try {
      await createLot({ 
        ...f, 
        superficie_ha: f.superficie_ha ? parseFloat(f.superficie_ha) : undefined,
        latitude: f.latitude ? parseFloat(f.latitude) : undefined,
        longitude: f.longitude ? parseFloat(f.longitude) : undefined,
      });
      setOpen(false);
      setF({ culture: '', variete: '', date_semis: '', date_recolte: '', superficie_ha: '', localisation: '', latitude: '', longitude: '' });
    } catch (e) {} finally { setBusy(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top }} />
      <OfflineBanner online={online} pendingCount={pendingCount} />
      <View style={styles.head}>
        <Text style={styles.title}>Lots agricoles</Text>
        <Pressable style={styles.addBtn} onPress={() => setOpen(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addTxt}>Nouveau</Text>
        </Pressable>
      </View>
      <FlatList
        data={lots}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
        renderItem={({ item }) => <LotCard lot={item} onPress={() => router.push(`/lot/${item.code_qr}`)} />}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="leaf-outline" size={40} color={colors.border} /><Text style={styles.emptyTxt}>Aucun lot. Créez votre premier lot.</Text></View>}
      />

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>Nouveau lot</Text>
              <Pressable onPress={() => setOpen(false)}><Ionicons name="close" size={24} color={colors.textMuted} /></Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {[
                { k: 'culture', p: 'Culture (ex: Arachide) *' },
                { k: 'variete', p: 'Variété' },
                { k: 'date_semis', p: 'Date semis (AAAA-MM-JJ)' },
                { k: 'date_recolte', p: 'Date récolte (AAAA-MM-JJ)' },
                { k: 'superficie_ha', p: 'Superficie (ha)' },
                { k: 'localisation', p: 'Localisation / GPS' },
                { k: 'latitude', p: 'Latitude' },
                { k: 'longitude', p: 'Longitude' },
              ].map((it) => (
                <TextInput key={it.k} placeholder={it.p} placeholderTextColor={colors.textMuted}
                  style={styles.input} value={f[it.k]} onChangeText={(v) => setF((s: any) => ({ ...s, [it.k]: v }))}
                  keyboardType={['superficie_ha', 'latitude', 'longitude'].includes(it.k) ? 'decimal-pad' : 'default'} />
              ))}
              <Pressable style={styles.saveBtn} onPress={save} disabled={busy}>
                {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>Créer le lot + QR code</Text>}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 22, fontWeight: '900', color: colors.primaryDark },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.md },
  addTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
  empty: { alignItems: 'center', paddingTop: 70, gap: 12 },
  emptyTxt: { color: colors.textMuted, fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, maxHeight: '88%' },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 19, fontWeight: '900', color: colors.text },
  input: { backgroundColor: colors.card, borderRadius: radius.md, padding: 14, fontSize: 15, color: colors.text, marginBottom: 11, borderWidth: 1, borderColor: colors.border },
  saveBtn: { backgroundColor: colors.primary, borderRadius: radius.md, padding: 15, alignItems: 'center', marginTop: 4 },
  saveTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
