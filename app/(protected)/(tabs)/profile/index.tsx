import { fetchTimeSlotByUserId } from "@/services/timeSlotService";
import { fetchUserById } from "@/services/userService";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Award,
  Bell,
  Calendar,
  ChevronRight,
  CreditCard,
  Crown,
  LogOut,
  User,
  UserCheck,
  Users,
} from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { userId, signOut } = useAuth();

  const { data: user } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserById(userId as string),
    enabled: !!userId,
  });

  const { data: timeSlots } = useQuery({
    queryKey: ["timeSlots", userId],
    queryFn: () => fetchTimeSlotByUserId(userId as string),
    enabled: !!userId,
  });

  // const userBookings = bookings.filter(
  //   (booking) => booking.userId === user?.id && booking.status === "active",
  // );

  // const userSlots = timeSlots.filter((slot) => slot.trainerId === user?.id);

  // const handleLogout = () => {
  //   Alert.alert("Logout", "Are you sure you want to logout?", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Logout",
  //       style: "destructive",
  //       onPress: logout,
  //     },
  //   ]);
  // };

  const getRoleColor = () => {
    return user?.role === "trainer" ? "#7c3aed" : "#3b82f6";
  };

  const getRoleGradient = () => {
    return ["#3b82f6", "#60a5fa"] as const;
  };

  if (!userId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No user data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {user && (
        <LinearGradient
          colors={getRoleGradient()}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View className="items-center gap-4">
            <Image
              source={{ uri: user.image_url }}
              className="size-20 rounded-full"
            />
            <View className="items-center gap-1">
              <Text className="font-semibold text-xl text-white">
                {user.name}
              </Text>
              <Text className="font-semibold text-md text-white">
                {user.email}
              </Text>
            </View>
            <View className="flex flex-row gap-2 px-4 py-2 bg-slate-50/30 rounded-full">
              {user.role === "trainer" ? (
                <UserCheck size={16} color="#ffffff" />
              ) : (
                <User size={16} color="#ffffff" />
              )}
              <Text className="text-sm text-white font-semibold">
                {user.role === "trainer" ? "Trainer" : "Trainee"}
              </Text>
            </View>
          </View>
        </LinearGradient>
      )}

      <ScrollView
        contentContainerClassName="p-5 flex flex-col gap-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        {user && (
          <View className="flex flex-row gap-5">
            {user.role === "trainee" ? (
              <>
                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Award size={24} color={getRoleColor()} />
                  </View>
                  <Text style={styles.statNumber}>{user.remaining_visits}</Text>
                  <Text style={styles.statLabel}>Visits Remaining</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Calendar size={24} color={getRoleColor()} />
                  </View>
                  <Text style={styles.statNumber}>{userBookings.length}</Text>
                  <Text style={styles.statLabel}>Active Bookings</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Calendar size={24} color={getRoleColor()} />
                  </View>
                  <Text style={styles.statNumber}>{timeSlots?.length}</Text>
                  <Text style={styles.statLabel}>Training Slots</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <UserCheck size={24} color={getRoleColor()} />
                  </View>
                  <Text style={styles.statNumber}>
                    {timeSlots?.reduce(
                      (acc, slot) => acc + slot.currentBookings,
                      0,
                    )}
                  </Text>
                  <Text style={styles.statLabel}>Total Bookings</Text>
                </View>
              </>
            )}
          </View>
        )}

        {/* Trainee-specific options */}
        {user && user?.role === "trainee" ? (
          <View className="flex flex-col gap-5">
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                router.push("./(tabs)/profile/(settings)/subscriptions")
              }
            >
              <View style={styles.optionLeft}>
                <LinearGradient
                  colors={["#7c3aed", "#c084fc"]}
                  style={styles.optionIconContainer}
                >
                  <Crown size={24} color="#ffffff" />
                </LinearGradient>
                <View>
                  <Text style={styles.optionTitle}>Subscriptions</Text>
                  <Text style={styles.optionSubtitle}>
                    Manage your training plans
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/profile/my-cards")}
            >
              <View style={styles.optionLeft}>
                <LinearGradient
                  colors={["#10b981", "#34d399"]}
                  style={styles.optionIconContainer}
                >
                  <CreditCard size={24} color="#ffffff" />
                </LinearGradient>
                <View>
                  <Text style={styles.optionTitle}>My Cards</Text>
                  <Text style={styles.optionSubtitle}>
                    Payment methods & billing
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/profile/notifications")}
            >
              <View style={styles.optionLeft}>
                <LinearGradient
                  colors={["#3b82f6", "#60a5fa"]}
                  style={styles.optionIconContainer}
                >
                  <Bell size={24} color="#ffffff" />
                </LinearGradient>
                <View>
                  <Text style={styles.optionTitle}>Settings</Text>
                  <Text style={styles.optionSubtitle}>
                    Notifications, theme & more
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex flex-col gap-5">
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/profile/trainees")}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Users size={20} color={getRoleColor()} />
                </View>
                <Text style={styles.menuItemText}>My Trainees</Text>
              </View>
              <ChevronRight size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        )}

        {/* Menu Options */}
        <TouchableOpacity style={styles.menuItem} onPress={() => signOut()}>
          <View style={styles.menuItemLeft}>
            <View
              style={[styles.menuIconContainer, styles.logoutIconContainer]}
            >
              <LogOut size={20} color="#ef4444" />
            </View>
            <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
          </View>
          <ChevronRight size={20} color="#ef4444" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingBottom: 40,
  },

  userName: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#ffffff",
    opacity: 0.9,
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 6,
  },
  roleText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  chatButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  content: {
    padding: 20,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#64748b",
    textAlign: "center",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
  },
  menuItem: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIconContainer: {
    backgroundColor: "#fef2f2",
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
  },
  logoutText: {
    color: "#ef4444",
  },
});
