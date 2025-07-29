import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
    ArrowLeft,
    Bell,
    Calendar,
    Clock,
    MessageCircle,
    Users,
    Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    classUpdates: true,
    promotions: false,
    trainerMessages: true,
    weeklyDigest: true,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const notificationGroups = [
    {
      title: "General Notifications",
      items: [
        {
          key: "pushNotifications",
          title: "Push Notifications",
          subtitle: "Receive notifications on your device",
          icon: <Bell size={20} color="#3b82f6" />,
        },
        {
          key: "emailNotifications",
          title: "Email Notifications",
          subtitle: "Receive notifications via email",
          icon: <MessageCircle size={20} color="#3b82f6" />,
        },
        {
          key: "smsNotifications",
          title: "SMS Notifications",
          subtitle: "Receive notifications via text message",
          icon: <MessageCircle size={20} color="#3b82f6" />,
        },
      ],
    },
    {
      title: "Training & Bookings",
      items: [
        {
          key: "bookingReminders",
          title: "Booking Reminders",
          subtitle: "Get reminded before your training sessions",
          icon: <Calendar size={20} color="#10b981" />,
        },
        {
          key: "classUpdates",
          title: "Class Updates",
          subtitle: "Notifications about class changes or cancellations",
          icon: <Zap size={20} color="#10b981" />,
        },
        {
          key: "trainerMessages",
          title: "Trainer Messages",
          subtitle: "Direct messages from your trainers",
          icon: <Users size={20} color="#10b981" />,
        },
      ],
    },
    {
      title: "Marketing & Updates",
      items: [
        {
          key: "promotions",
          title: "Promotions & Offers",
          subtitle: "Special deals and membership offers",
          icon: <Zap size={20} color="#f59e0b" />,
        },
        {
          key: "weeklyDigest",
          title: "Weekly Digest",
          subtitle: "Summary of your weekly activity",
          icon: <Clock size={20} color="#f59e0b" />,
        },
      ],
    },
    {
      title: "Sound & Vibration",
      items: [
        {
          key: "soundEnabled",
          title: "Sound",
          subtitle: "Play sound for notifications",
          icon: <Bell size={20} color="#7c3aed" />,
        },
        {
          key: "vibrationEnabled",
          title: "Vibration",
          subtitle: "Vibrate for notifications",
          icon: <Zap size={20} color="#7c3aed" />,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#3b82f6", "#60a5fa"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              Manage your notification preferences
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notificationGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.title}</Text>

            <View style={styles.settingsContainer}>
              {group.items.map((item, itemIndex) => (
                <View
                  key={item.key}
                  style={[
                    styles.settingItem,
                    itemIndex === group.items.length - 1 &&
                      styles.lastSettingItem,
                  ]}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconContainer}>{item.icon}</View>
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingSubtitle}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>

                  <Switch
                    value={settings[item.key as keyof typeof settings]}
                    onValueChange={(value) =>
                      handleSettingChange(item.key, value)
                    }
                    trackColor={{ false: "#e2e8f0", true: "#3b82f6" }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#e2e8f0"
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Bell size={24} color="#64748b" />
            <Text style={styles.infoTitle}>Notification Timing</Text>
            <Text style={styles.infoText}>
              Booking reminders are sent 2 hours before your session. You can
              change this timing in your calendar settings.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    gap: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#ffffff",
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 16,
  },
  settingsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    lineHeight: 18,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});
