import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/app/lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: colors.border, height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="lots" options={{ title: 'Lots', tabBarIcon: ({ color, size }) => <Ionicons name="leaf-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="scan" options={{ title: 'Scanner', tabBarIcon: ({ color, size }) => <Ionicons name="qr-code-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="rapport" options={{ title: 'Rapport', tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="demo" options={{ title: 'Capteurs', tabBarIcon: ({ color, size }) => <Ionicons name="hardware-chip-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
