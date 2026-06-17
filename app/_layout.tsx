import { Stack } from "expo-router";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@/app/lib/theme";

if (typeof globalThis.fetch === 'undefined') {
  // @ts-ignore
  globalThis.fetch = fetch;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lot/[code]" options={{ presentation: 'card' }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
