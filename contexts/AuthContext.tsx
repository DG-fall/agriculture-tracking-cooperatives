import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';

export type Membre = { id: string; nom: string; role: 'admin' | 'membre'; cooperative_id: string; telephone?: string };
export type Cooperative = { id: string; nom: string; ville?: string; code_coop: string; telephone?: string };

type AuthState = {
  loading: boolean;
  userId: string | null;
  email: string | null;
  membre: Membre | null;
  coop: Cooperative | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUpCreateCoop: (p: { email: string; password: string; nom: string; coopNom: string; ville: string; telephone: string }) => Promise<void>;
  signUpJoinCoop: (p: { email: string; password: string; nom: string; code_coop: string; telephone: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [membre, setMembre] = useState<Membre | null>(null);
  const [coop, setCoop] = useState<Cooperative | null>(null);

  const loadProfile = useCallback(async (uid: string) => {
    const { data: m } = await supabase.from('membres').select('*').eq('user_id', uid).maybeSingle();
    if (m) {
      setMembre(m as Membre);
      const { data: c } = await supabase.from('cooperatives').select('*').eq('id', (m as Membre).cooperative_id).maybeSingle();
      if (c) setCoop(c as Cooperative);
    } else {
      setMembre(null);
      setCoop(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const s = data.session;
    if (s?.user) {
      setUserId(s.user.id);
      setEmail(s.user.email ?? null);
      await loadProfile(s.user.id);
    } else {
      setUserId(null); setEmail(null); setMembre(null); setCoop(null);
    }
  }, [loadProfile]);

  useEffect(() => {
    (async () => { await refresh(); setLoading(false); })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setEmail(session.user.email ?? null);
        await loadProfile(session.user.id);
      } else {
        setUserId(null); setEmail(null); setMembre(null); setCoop(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh, loadProfile]);

  const signIn = useCallback(async (em: string, pw: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: em.trim(), password: pw });
    if (error) throw error;
    await refresh();
  }, [refresh]);

  const signUpCreateCoop = useCallback(async (p: any) => {
    const { data: signUp, error } = await supabase.auth.signUp({ email: p.email.trim(), password: p.password });
    if (error) throw error;
    let uid = signUp.user?.id;
    if (!signUp.session) {
      const { data: si, error: e2 } = await supabase.auth.signInWithPassword({ email: p.email.trim(), password: p.password });
      if (e2) throw e2;
      uid = si.user?.id;
    }
    if (!uid) throw new Error('Création de compte impossible');
    const { data: c, error: e3 } = await supabase.from('cooperatives')
      .insert({ nom: p.coopNom, ville: p.ville, telephone: p.telephone, admin_id: uid })
      .select().single();
    if (e3) throw e3;
    const { error: e4 } = await supabase.from('membres')
      .insert({ user_id: uid, cooperative_id: c.id, nom: p.nom, telephone: p.telephone, role: 'admin' });
    if (e4) throw e4;
    await refresh();
  }, [refresh]);

  const signUpJoinCoop = useCallback(async (p: any) => {
    // find coop by code via security-definer RPC (works before membership exists)
    const { data: coopId, error: ec } = await supabase.rpc('find_coop_id_by_code', { p_code: p.code_coop.trim() });
    if (ec || !coopId) throw new Error('Code coopérative introuvable');
    const { data: signUp, error } = await supabase.auth.signUp({ email: p.email.trim(), password: p.password });
    if (error) throw error;
    let uid = signUp.user?.id;
    if (!signUp.session) {
      const { data: si, error: e2 } = await supabase.auth.signInWithPassword({ email: p.email.trim(), password: p.password });
      if (e2) throw e2;
      uid = si.user?.id;
    }
    if (!uid) throw new Error('Création de compte impossible');
    const { error: e4 } = await supabase.from('membres')
      .insert({ user_id: uid, cooperative_id: coopId, nom: p.nom, telephone: p.telephone, role: 'membre' });
    if (e4) throw e4;
    await refresh();
  }, [refresh]);


  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUserId(null); setEmail(null); setMembre(null); setCoop(null);
  }, []);

  return (
    <Ctx.Provider value={{
      loading, userId, email, membre, coop,
      isAdmin: membre?.role === 'admin',
      signIn, signUpCreateCoop, signUpJoinCoop, signOut, refresh,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
