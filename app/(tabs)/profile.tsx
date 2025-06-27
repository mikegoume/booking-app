import { useApp } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import {
  Award,
  Calendar,
  LogOut,
  Settings,
  User,
  UserCheck,
} from "lucide-react-native";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, setUser, bookings, timeSlots, logout } = useApp();

  const userBookings = bookings.filter(
    (booking) => booking.userId === user?.id && booking.status === "active",
  );

  const userSlots = timeSlots.filter((slot) => slot.trainerId === user?.id);

  const handleRoleSwitch = () => {
    if (!user) return;

    Alert.alert(
      "Switch Role",
      `Switch to ${user.role === "trainer" ? "Trainee" : "Trainer"} mode?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch",
          onPress: () => {
            const newRole = user.role === "trainer" ? "trainee" : "trainer";
            setUser({
              ...user,
              role: newRole,
              // Reset visits when switching to trainee, keep 0 for trainer
              remainingVisits: newRole === "trainee" ? 10 : 0,
            });
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const getRoleColor = () => {
    return user?.role === "trainer" ? "#7c3aed" : "#3b82f6";
  };

  const getRoleGradient = () => {
    return user?.role === "trainer"
      ? ["#7c3aed", "#c084fc"]
      : ["#3b82f6", "#60a5fa"];
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No user data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={getRoleGradient()} style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#ffffff" />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.roleContainer}>
            {user.role === "trainer" ? (
              <UserCheck size={16} color="#ffffff" />
            ) : (
              <User size={16} color="#ffffff" />
            )}
            <Text style={styles.roleText}>
              {user.role === "trainer" ? "Trainer" : "Trainee"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        {user.role === "trainee" ? (
          <>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Award size={24} color={getRoleColor()} />
              </View>
              <Text style={styles.statNumber}>{user.remainingVisits}</Text>
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
              <Text style={styles.statNumber}>{userSlots.length}</Text>
              <Text style={styles.statLabel}>Training Slots</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <UserCheck size={24} color={getRoleColor()} />
              </View>
              <Text style={styles.statNumber}>
                {userSlots.reduce((acc, slot) => acc + slot.currentBookings, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleRoleSwitch}>
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <Settings size={20} color={getRoleColor()} />
            </View>
            <Text style={styles.menuItemText}>
              Switch to {user.role === "trainer" ? "Trainee" : "Trainer"} Mode
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <View
              style={[styles.menuIconContainer, styles.logoutIconContainer]}
            >
              <LogOut size={20} color="#ef4444" />
            </View>
            <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    minHeight: "40%",
  },
  profileSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  roleText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -15,
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
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 12,
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
  infoContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#3b82f6",
    lineHeight: 20,
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    lineHeight: 20,
  },
});
