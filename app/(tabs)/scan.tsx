import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLots } from '@/app/hooks/useLots';
import { colors, radius } from '@/app/lib/theme';
import { shortCode } from '@/app/lib/dakar';
import LotCard from '@/app/components/LotCard';

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const { lots } = useLots();
  const [q, setQ] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  
  const matches = lots.filter((l) =>
    l.code_qr.toLowerCase().includes(q.toLowerCase()) || l.culture.toLowerCase().includes(q.toLowerCase()));

  const open = (code: string) => {
    const v = code.replace('traceagri://lot/', '').trim();
    if (v) router.push(`/lot/${v}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 8 }}>
      <Text style={styles.title}>Scanner / Tracer un lot</Text>
      
      <View style={styles.scanBox}>
        <Ionicons name="qr-code-outline" size={48} color={colors.primary} />
        <Text style={styles.scanHint}>
          {Platform.OS !== 'web' 
            ? "Scanner un QR code via caméra sera disponible sur l'app mobile. Pour l'instant, utilisez le champ de recherche." 
            : "Scanner un QR code n'est pas disponible sur web. Utilisez le champ de recherche ci-dessous."}
        </Text>
      </View>

      <View style={styles.field}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput placeholder="Code QR, lien ou culture…" placeholderTextColor={colors.textMuted}
          style={styles.input} value={q} onChangeText={setQ} autoCapitalize="none" />
      </View>
      <Pressable style={styles.btn} onPress={() => open(q)}>
        <Ionicons name="search" size={18} color="#fff" />
        <Text style={styles.btnTxt}>Ouvrir l'historique</Text>
      </Pressable>
      <Text style={styles.sub}>Lots correspondants</Text>
      <FlatList
        data={matches}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        renderItem={({ item }) => <LotCard lot={item} onPress={() => router.push(`/lot/${item.code_qr}`)} />}
        ListEmptyComponent={<Text style={styles.empty}>Aucun lot trouvé pour « {q || '…'} »</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '900', color: colors.primaryDark, paddingHorizontal: 16, marginBottom: 10 },
  scanBox: { alignItems: 'center', gap: 8, backgroundColor: colors.card, marginHorizontal: 16, borderRadius: radius.lg, padding: 22, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primaryLight },
  scanHint: { fontSize: 12.5, color: colors.textMuted, textAlign: 'center' },
  field: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.card, marginHorizontal: 16, marginTop: 14, borderRadius: radius.md, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: colors.text },
  btn: { flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, marginHorizontal: 16, marginTop: 10, padding: 15, borderRadius: radius.md },
  btnTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  sub: { fontSize: 15, fontWeight: '800', color: colors.text, paddingHorizontal: 16, marginTop: 18, marginBottom: 8 },
  empty: { color: colors.textMuted, paddingHorizontal: 16, fontSize: 13.5 },
  closeBtn: { position: 'absolute', right: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50, padding: 8 },
  cameraHint: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  cameraHintText: { color: '#fff', fontSize: 16, fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 },
});
