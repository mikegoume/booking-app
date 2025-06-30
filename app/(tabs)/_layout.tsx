import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { Calendar, MessageCircle, User, UserCheck } from "lucide-react-native";
import { TouchableWithoutFeedback, View } from "react-native";

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
              <TouchableWithoutFeedback>
                <MessageCircle size={20} color={"white"} />
              </TouchableWithoutFeedback>
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
        name="bookings"
        options={{
          title: "My Bookings",
          tabBarIcon: ({ size, color }) => (
            <UserCheck size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
