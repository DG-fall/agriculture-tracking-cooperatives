import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Modal, TextInput, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/app/contexts/AuthContext';
import { colors, radius } from '@/app/lib/theme';
import { supabase } from '@/app/lib/supabase';

type Member = {
  id: string;
  user_id: string;
  cooperative_id: string;
  nom: string;
  telephone?: string;
  role: 'admin' | 'membre';
  created_at: string;
};

export default function MembersScreen() {
  const { coop, isAdmin, membre } = useAuth();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState({ nom: '', telephone: '', role: 'membre' as const });

  const loadMembers = useCallback(async () => {
    if (!coop?.id) return;
    setLoading(true);
    try {
      const { data } = await supabase.from('membres').select('*').eq('cooperative_id', coop.id).order('created_at', { ascending: false });
      setMembers(data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [coop?.id]);

  useEffect(() => {
    if (isAdmin) loadMembers();
  }, [isAdmin, loadMembers]);

  const saveMember = async () => {
    if (!coop?.id || !form.nom) return;
    if (editingMember) {
      // Update existing member
      const { error } = await supabase.from('membres').update({ nom: form.nom, telephone: form.telephone, role: form.role }).eq('id', editingMember.id);
      if (!error) {
        await loadMembers();
      }
    } else {
      // Note: This just adds a member profile without a linked auth user for demo purposes
      // Real implementation would use Supabase Auth Admin API or invite flow
      const { data: newMember, error } = await supabase.from('membres').insert({
        cooperative_id: coop.id,
        nom: form.nom,
        telephone: form.telephone,
        role: form.role,
        user_id: 'demo-' + Date.now(), // placeholder
      }).select().single();
      if (!error && newMember) {
        await loadMembers();
      }
    }
    setShowModal(false);
    setEditingMember(null);
    setForm({ nom: '', telephone: '', role: 'membre' });
  };

  const deleteMember = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;
    const { error } = await supabase.from('membres').delete().eq('id', memberId);
    if (!error) await loadMembers();
  };

  if (!isAdmin) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, padding: 20 }}>
        <Text style={{ color: colors.textMuted, textAlign: 'center' }}>Seul l'administrateur peut gérer les membres.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top }} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colors.primaryDark} />
        </Pressable>
        <Text style={styles.title}>Gestion des membres</Text>
        <Pressable style={styles.addBtn} onPress={() => { setEditingMember(null); setForm({ nom: '', telephone: '', role: 'membre' }); setShowModal(true); }}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnTxt}>Ajouter</Text>
        </Pressable>
      </View>
      <FlatList
        data={members}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMembers} tintColor={colors.primary} />}
        ListEmptyComponent={<View style={{ alignItems: 'center', paddingTop: 60, gap: 12 }}><Ionicons name="people-outline" size={48} color={colors.border} /><Text style={{ color: colors.textMuted }}>Aucun membre pour l'instant</Text></View>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>{item.nom}</Text>
              <Text style={styles.memberRole}>{item.role === 'admin' ? 'Administrateur' : 'Membre'}{item.telephone ? ` · ${item.telephone}` : ''}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={() => { setEditingMember(item); setForm({ nom: item.nom, telephone: item.telephone || '', role: item.role }); setShowModal(true); }}>
                <Ionicons name="create-outline" size={20} color={colors.primary} />
              </Pressable>
              {item.id !== membre?.id && (
                <Pressable onPress={() => deleteMember(item.id)}>
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </Pressable>
              )}
            </View>
          </View>
        )}
      />
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingMember ? 'Modifier le membre' : 'Ajouter un membre'}</Text>
              <Pressable onPress={() => setShowModal(false)}><Ionicons name="close" size={24} color={colors.textMuted} /></Pressable>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                placeholder="Nom complet"
                value={form.nom}
                onChangeText={(t) => setForm({ ...form, nom: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Téléphone"
                value={form.telephone}
                onChangeText={(t) => setForm({ ...form, telephone: t })}
                keyboardType="phone-pad"
              />
              <Text style={styles.label}>Rôle :</Text>
              <View style={styles.roleOptions}>
                {(['membre', 'admin'] as const).map((r) => (
                  <Pressable
                    key={r}
                    style={[styles.roleOption, form.role === r && styles.roleOptionActive]}
                    onPress={() => setForm({ ...form, role: r })}
                  >
                    <Text style={[styles.roleOptionText, form.role === r && styles.roleOptionTextActive]}>
                      {r === 'admin' ? 'Administrateur' : 'Membre'}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.saveBtn} onPress={saveMember}>
                <Text style={styles.saveBtnTxt}>{editingMember ? 'Enregistrer' : 'Ajouter'}</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 20, fontWeight: '900', color: colors.primaryDark },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.md },
  addBtnTxt: { color: '#fff', fontWeight: '800' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  memberName: { fontSize: 16, fontWeight: '800', color: colors.text },
  memberRole: { fontSize: 13, color: colors.textMuted, marginTop: 3 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  input: { backgroundColor: colors.bg, borderRadius: radius.md, padding: 14, fontSize: 15, color: colors.text, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 8 },
  roleOptions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  roleOption: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  roleOptionActive: { backgroundColor: '#E6F2EB', borderColor: colors.primary },
  roleOptionText: { fontSize: 14, fontWeight: '700', color: colors.text },
  roleOptionTextActive: { color: colors.primary },
  saveBtn: { backgroundColor: colors.primary, borderRadius: radius.md, padding: 15, alignItems: 'center' },
  saveBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
});