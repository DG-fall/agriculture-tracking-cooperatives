import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { storage, K, getPending, pushPending, setPending, PendingAction } from '../lib/storage';
import { useAuth } from '../contexts/AuthContext';
import { useOnline } from '../lib/network';

export type Lot = {
  id: string;
  cooperative_id: string;
  code_qr: string;
  culture: string;
  variete?: string;
  date_semis?: string;
  date_recolte?: string;
  superficie_ha?: number;
  localisation?: string;
  latitude?: number;
  longitude?: number;
  statut: string;
  created_at: string;
  updated_at?: string;
};

function uid() {
  return 'x' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useLots() {
  const { coop, membre } = useAuth();
  const online = useOnline();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(getPending().length);

  const loadCache = useCallback(() => {
    if (!coop) return;
    setLots(storage.getJSON<Lot[]>(K.lots(coop.id), []));
  }, [coop]);

  const fetchRemote = useCallback(async () => {
    if (!coop) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lots')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLots(data as Lot[]);
      storage.setJSON(K.lots(coop.id), data);
    } catch {
      loadCache(); // fall back to cache when offline
    } finally {
      setLoading(false);
    }
  }, [coop, loadCache]);

  // Replay queued offline actions
  const syncPending = useCallback(async () => {
    let queue = getPending();
    if (queue.length === 0) return;
    const remaining: PendingAction[] = [];
    for (const a of queue) {
      try {
        if (a.kind === 'create_lot') {
          await supabase.from('lots').insert(a.payload);
        } else if (a.kind === 'update_status') {
          await supabase.from('lots').update({ statut: a.payload.statut, updated_at: a.ts }).eq('id', a.payload.lot_id);
          await supabase.from('historique_lots').insert({
            lot_id: a.payload.lot_id, type_action: 'changement_statut',
            description: `Statut : ${a.payload.old_statut} → ${a.payload.statut}`,
            auteur_nom: a.payload.auteur_nom, date_action: a.ts,
            old_statut: a.payload.old_statut, new_statut: a.payload.statut,
          });
        } else if (a.kind === 'add_history') {
          await supabase.from('historique_lots').insert(a.payload);
        }
      } catch {
        remaining.push(a); // keep failed ones
      }
    }
    setPending(remaining);
    setPendingCount(remaining.length);
  }, []);

  useEffect(() => { loadCache(); }, [loadCache]);
  useEffect(() => {
    if (online && coop) { syncPending().then(fetchRemote); }
  }, [online, coop, syncPending, fetchRemote]);

  const refresh = useCallback(async () => {
    if (online) { await syncPending(); await fetchRemote(); }
    else loadCache();
  }, [online, syncPending, fetchRemote, loadCache]);

  const createLot = useCallback(async (input: Partial<Lot>) => {
    if (!coop) throw new Error('Aucune coopérative');
    const row = {
      cooperative_id: coop.id,
      culture: input.culture,
      variete: input.variete,
      date_semis: input.date_semis || null,
      date_recolte: input.date_recolte || null,
      superficie_ha: input.superficie_ha ?? null,
      localisation: input.localisation || null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      statut: 'en_stock',
    };
    if (online) {
      const { data, error } = await supabase.from('lots').insert(row).select().single();
      if (error) throw error;
      // history entry
      await supabase.from('historique_lots').insert({
        lot_id: data.id, type_action: 'creation', description: `Lot créé: ${data.culture}`,
        auteur_nom: membre?.nom,
      });
      await fetchRemote();
      return data as Lot;
    } else {
      // offline: create optimistic lot with temp uuid-like code
      const temp: Lot = {
        ...(row as any),
        id: uid(),
        code_qr: uid() + '-offline',
        created_at: new Date().toISOString(),
      };
      const next = [temp, ...lots];
      setLots(next);
      storage.setJSON(K.lots(coop.id), next);
      pushPending({ id: uid(), kind: 'create_lot', payload: row, ts: new Date().toISOString() });
      setPendingCount(getPending().length);
      return temp;
    }
  }, [coop, online, lots, membre, fetchRemote]);

  const updateStatus = useCallback(async (lot: Lot, statut: string) => {
    const ts = new Date().toISOString();
    const oldStatut = lot.statut;
    // optimistic
    const next = lots.map((l) => (l.id === lot.id ? { ...l, statut } : l));
    setLots(next);
    if (coop) storage.setJSON(K.lots(coop.id), next);
    if (online) {
      const { error } = await supabase.from('lots').update({ statut, updated_at: ts }).eq('id', lot.id);
      if (error) throw error;
      await supabase.from('historique_lots').insert({
        lot_id: lot.id, type_action: 'changement_statut',
        description: `Statut : ${oldStatut} → ${statut}`,
        auteur_nom: membre?.nom,
        date_action: ts,
        old_statut: oldStatut,
        new_statut: statut,
      });
      await fetchRemote();
    } else {
      pushPending({ id: uid(), kind: 'update_status', ts, payload: { lot_id: lot.id, statut, old_statut: oldStatut, auteur_nom: membre?.nom } });
      setPendingCount(getPending().length);
    }
  }, [lots, coop, online, membre, fetchRemote]);

  return { lots, loading, online, pendingCount, refresh, createLot, updateStatus, syncPending };
}
