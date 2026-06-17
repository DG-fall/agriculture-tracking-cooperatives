import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLots } from '@/app/hooks/useLots';
import { useAuth } from '@/app/contexts/AuthContext';
import { colors, radius, statutMeta } from '@/app/lib/theme';
import { fmtDateTime, shortCode } from '@/app/lib/dakar';

export default function RapportScreen() {
  const insets = useSafeAreaInsets();
  const { lots } = useLots();
  const { coop, membre } = useAuth();
  const [gen, setGen] = useState(false);
  const counts = lots.reduce((a, l) => { a[l.statut] = (a[l.statut] ?? 0) + 1; return a; }, {} as Record<string, number>);
  const totalHa = Math.round(lots.reduce((s, l) => s + Number(l.superficie_ha ?? 0), 0) * 100) / 100;

  const text = () => {
    let t = `*RAPPORT DE STOCK — ${coop?.nom}*\n`;
    t += `Généré le ${fmtDateTime(new Date().toISOString())} par ${membre?.nom}\n\n`;
    t += `Total lots: ${lots.length} | Surface: ${totalHa} ha\n`;
    Object.keys(statutMeta).forEach((k) => { t += `${statutMeta[k].label}: ${counts[k] ?? 0}\n`; });
    t += `\n--- LOTS ---\n`;
    lots.forEach((l) => { t += `• ${l.culture}${l.variete ? ' (' + l.variete + ')' : ''} — ${statutMeta[l.statut]?.label} — ${l.superficie_ha ?? 0}ha — #${shortCode(l.code_qr)}\n`; });
    return t;
  };

  const share = () => {
    setGen(true);
    const msg = encodeURIComponent(text());
    const url = `https://wa.me/?text=${msg}`;
    Linking.openURL(url).catch(() => {});
    setTimeout(() => setGen(false), 800);
  };

  const printPdf = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(`<pre style="font-family:system-ui;padding:24px;white-space:pre-wrap">${text().replace(/\*/g, '')}</pre>`);
        w.document.close(); w.focus(); w.print();
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 8 }}>
      <Text style={styles.title}>Rapport de stock</Text>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.coop}>{coop?.nom}</Text>
          <Text style={styles.muted}>{fmtDateTime(new Date().toISOString())}</Text>
          <View style={styles.row2}>
            <View style={styles.box}><Text style={styles.boxNum}>{lots.length}</Text><Text style={styles.boxLbl}>Lots</Text></View>
            <View style={styles.box}><Text style={styles.boxNum}>{totalHa}</Text><Text style={styles.boxLbl}>Hectares</Text></View>
          </View>
          {Object.keys(statutMeta).map((k) => (
            <View key={k} style={styles.line}>
              <Text style={styles.lineLbl}>{statutMeta[k].label}</Text>
              <Text style={[styles.lineVal, { color: statutMeta[k].color }]}>{counts[k] ?? 0}</Text>
            </View>
          ))}
        </View>
        <Pressable style={[styles.btn, { backgroundColor: '#25D366' }]} onPress={share} disabled={gen}>
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.btnTxt}>Partager via WhatsApp</Text>
        </Pressable>
        <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={printPdf}>
          <Ionicons name="document-text-outline" size={20} color="#fff" />
          <Text style={styles.btnTxt}>Exporter / Imprimer PDF</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '900', color: colors.primaryDark, paddingHorizontal: 16, marginBottom: 6 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 18, borderWidth: 1, borderColor: colors.border },
  coop: { fontSize: 19, fontWeight: '900', color: colors.text },
  muted: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  row2: { flexDirection: 'row', gap: 12, marginVertical: 14 },
  box: { flex: 1, backgroundColor: '#E6F2EB', borderRadius: radius.md, padding: 14, alignItems: 'center' },
  boxNum: { fontSize: 26, fontWeight: '900', color: colors.primaryDark },
  boxLbl: { fontSize: 12.5, color: colors.textMuted, fontWeight: '600' },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
  lineLbl: { fontSize: 14, color: colors.text, fontWeight: '600' },
  lineVal: { fontSize: 16, fontWeight: '900' },
  btn: { flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: radius.md, marginTop: 14 },
  btnTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
