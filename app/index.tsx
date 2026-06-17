import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/app/contexts/AuthContext";
import { colors } from "@/app/lib/theme";

export default function Index() {
  const { loading, userId, membre } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (userId && membre) return <Redirect href="/(tabs)" />;
  return <Redirect href="/login" />;
}
