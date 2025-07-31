import { LinearGradient } from "expo-linear-gradient";
import { Link, Tabs } from "expo-router";
import { Calendar, MessageCircle, UserCheck } from "lucide-react-native";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Inter-Medium",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          headerRight: () => (
            <View className="pr-4">
              <Link href={"./(chat)/index"}>
                <MessageCircle size={20} color={"white"} />
              </Link>
            </View>
          ),
          headerBackground: () => (
            <LinearGradient
              colors={["#4f46e5", "#7c3aed"]} // Your desired gradient colors
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
          title: "Training Slots",
          headerTintColor: "#ffffff",
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings/index"
        options={{
          headerShown: true,
          title: "My Bookings",
          headerTintColor: "#ffffff",
          headerBackground: () => (
            <LinearGradient
              colors={["#059669", "#0d9488"]} // Your desired gradient colors
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
          tabBarIcon: ({ size, color }) => (
            <UserCheck size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <UserCheck size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
