import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { Settings } from "lucide-react-native";
import { TouchableWithoutFeedback, View } from "react-native";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Profile",
          headerTitle: "",
          headerTintColor: "#fff",
          headerBackground: () => (
            <LinearGradient
              colors={["#3b82f6", "#60a5fa"]} // Your desired gradient colors
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
          headerRight: () => (
            <View className="pr-4">
              <TouchableWithoutFeedback
                onPress={() =>
                  router.push("./(tabs)/profile/(settings)/profile-details")
                }
              >
                <Settings size={20} color="#fff" />
              </TouchableWithoutFeedback>
            </View>
          ),
        }}
      />
      <Stack.Screen name="(settings)" />
    </Stack>
  );
}
