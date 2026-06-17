import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/app/contexts/AuthContext';
import { colors, radius, spacing } from '@/app/lib/theme';

type Mode = 'login' | 'create' | 'join';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_WEB = Platform.OS === 'web';
const HERO_IMG = require('../assets/images/farm-hero.png');

export default function Login() {
  const { signIn, signUpCreateCoop, signUpJoinCoop } = useAuth();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('login');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [coopNom, setCoopNom] = useState('');
  const [ville, setVille] = useState('');
  const [telephone, setTelephone] = useState('');
  const [code, setCode] = useState('');

  const submit = async () => {
    setErr(''); setBusy(true);
    try {
      if (mode === 'login') await signIn(email, password);
      else if (mode === 'create') await signUpCreateCoop({ email, password, nom, coopNom, ville, telephone });
      else await signUpJoinCoop({ email, password, nom, code_coop: code, telephone });
      router.replace('/(tabs)');
    } catch (e: any) {
      setErr(e?.message || 'Une erreur est survenue');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {IS_WEB && SCREEN_WIDTH > 900 ? (
            <View style={styles.webWrapper}>
              <View style={styles.webLeft}>
                <View style={styles.webLeftContent}>
                  <Logo />
                  <View style={styles.webSlogan}>
                    <Text style={styles.webTitle}>Building trust from farm to <Text style={{ color: colors.accent }}>the world.</Text></Text>
                    <Text style={styles.webSubtitle}>The agricultural traceability platform connecting African farmers to global markets with transparency.</Text>
                  </View>
                  <View style={styles.heroCard}>
                    <Image source={HERO_IMG} style={styles.heroImage} contentFit="cover" />
                    <View style={styles.heroOverlay}>
                      <FeatureItem icon="shield-checkmark-outline" title="End-to-end Traceability" description="Track your products from farm to final destination" />
                      <FeatureItem icon="globe-outline" title="Global Market Access" description="Connect with verified buyers worldwide" />
                      <FeatureItem icon="bar-chart-outline" title="Data-Driven Insights" description="Make informed decisions with real-time data" />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.webRight}>
                <LoginForm mode={mode} setMode={setMode} busy={busy} err={err} email={email} setEmail={setEmail} password={password} setPassword={setPassword} nom={nom} setNom={setNom} coopNom={coopNom} setCoopNom={setCoopNom} ville={ville} setVille={setVille} telephone={telephone} setTelephone={setTelephone} code={code} setCode={setCode} submit={submit} />
              </View>
            </View>
          ) : (
            <View style={styles.mobileWrapper}>
              <View style={{ paddingTop: insets.top + spacing.lg }}>
                <View style={styles.mobileHeader}>
                  <Logo />
                </View>
                <View style={styles.mobileHeroCard}>
                  <Image source={HERO_IMG} style={styles.mobileHero} contentFit="cover" />
                  <View style={styles.mobileHeroOverlay}>
                    <Text style={styles.mobileHeroText}>Building trust from farm to <Text style={{ color: '#F2C5A8' }}>the world.</Text></Text>
                  </View>
                </View>
                <LoginForm mode={mode} setMode={setMode} busy={busy} err={err} email={email} setEmail={setEmail} password={password} setPassword={setPassword} nom={nom} setNom={setNom} coopNom={coopNom} setCoopNom={setCoopNom} ville={ville} setVille={setVille} telephone={telephone} setTelephone={setTelephone} code={code} setCode={setCode} submit={submit} />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function Logo() {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoIcon}>
        <Ionicons name="leaf" size={32} color="#ffffff" />
      </View>
      <Text style={styles.logoText}>TraceAgri</Text>
      <Text style={styles.logoTagline}>TRACE TODAY, TRUST TOMORROW</Text>
    </View>
  );
}

function FeatureItem({ icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={28} color="#ffffff" />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </View>
  );
}

function LoginForm({ mode, setMode, busy, err, email, setEmail, password, setPassword, nom, setNom, coopNom, setCoopNom, ville, setVille, telephone, setTelephone, code, setCode, submit }: any) {
  return (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.welcomeTitle}>Welcome back</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.tabs}>
        <Tab label="Connexion" active={mode === 'login'} onPress={() => setMode('login')} />
        <Tab label="Créer coop." active={mode === 'create'} onPress={() => setMode('create')} />
        <Tab label="Rejoindre" active={mode === 'join'} onPress={() => setMode('join')} />
      </View>

      <View style={styles.formCard}>
        {mode !== 'login' && (
          <Field icon="person-outline" placeholder="Votre nom complet" value={nom} onChangeText={setNom} />
        )}
        {mode === 'create' && (
          <>
            <Field icon="business-outline" placeholder="Nom de la coopérative" value={coopNom} onChangeText={setCoopNom} />
            <Field icon="location-outline" placeholder="Ville" value={ville} onChangeText={setVille} />
          </>
        )}
        {mode === 'join' && (
          <Field icon="key-outline" placeholder="Code coopérative (6 car.)" value={code} onChangeText={setCode} autoCapitalize="characters" />
        )}
        {mode !== 'login' && (
          <Field icon="call-outline" placeholder="Téléphone" value={telephone} onChangeText={setTelephone} keyboardType="phone-pad" />
        )}
        <Field icon="mail-outline" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Field icon="lock-closed-outline" placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />

        {!!err && <Text style={styles.err}>{err}</Text>}

        <Pressable style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]} onPress={submit} disabled={busy}>
          {busy ? <ActivityIndicator color="#fff" size="small" /> : (
            <Text style={styles.btnTxt}>
              {mode === 'login' ? 'Se connecter' : mode === 'create' ? 'Créer la coopérative' : 'Rejoindre la coopérative'}
            </Text>
          )}
        </Pressable>

        <View style={styles.registerPrompt}>
          <Text style={styles.registerText}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </Text>
          <Pressable onPress={() => setMode(mode === 'login' ? 'create' : 'login')}>
            <Text style={styles.registerLink}>{mode === 'login' ? 'Register' : 'Sign in'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Tab({ label, active, onPress }: any) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabTxt, active && styles.tabTxtActive]}>{label}</Text>
    </Pressable>
  );
}

function Field({ icon, ...props }: any) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={20} color={colors.textMuted} style={styles.fieldIcon} />
      <TextInput placeholderTextColor={colors.textLight} style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    flexDirection: 'row',
    minHeight: '100%',
    width: '100%',
  },
  webLeft: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    paddingHorizontal: 80,
    position: 'relative',
  },
  webLeftContent: {
    maxWidth: 520,
  },
  webRight: {
    flex: 1,
    backgroundColor: colors.bgAlt,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  mobileWrapper: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  mobileHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: spacing.sm,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  logoTagline: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1.8,
  },

  webSlogan: {
    marginBottom: spacing.xl,
  },
  webTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 52,
    letterSpacing: -1.2,
    marginBottom: spacing.sm,
  },
  webSubtitle: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 26,
  },

  heroCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.primaryDark,
    shadowColor: '#0E2A1E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  heroOverlay: {
    backgroundColor: colors.primaryDark,
    padding: spacing.lg,
    gap: spacing.md,
  },
  mobileHeroCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  mobileHero: {
    width: '100%',
    height: 170,
  },
  mobileHeroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(14,42,30,0.78)',
  },
  mobileHeroText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  featureItem: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },

  formContainer: {
    width: '100%',
    maxWidth: 440,
  },
  formHeader: {
    marginBottom: spacing.md,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.borderLight,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: { flex: 1, paddingVertical: 11, borderRadius: radius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: '#ffffff', shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  tabTxt: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  tabTxtActive: { color: colors.primary },

  formCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  fieldIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15.5,
    color: colors.text,
    paddingVertical: 4,
  },
  err: {
    color: colors.danger,
    fontSize: 13.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  btnTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },

  registerPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  registerText: {
    color: colors.textMuted,
    fontSize: 14.5,
    fontWeight: '500',
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14.5,
    fontWeight: '800',
  },
});
