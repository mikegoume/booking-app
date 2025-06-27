import { useApp } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar as CalendarIcon, Clock, Users, X } from "lucide-react-native";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingsScreen() {
  const { user, bookings, cancelBooking } = useApp();

  const userBookings = bookings.filter(
    (booking) => booking.userId === user?.id && booking.status === "active",
  );

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking? You will get your visit back.",
      [
        { text: "Keep Booking", style: "cancel" },
        {
          text: "Cancel Booking",
          style: "destructive",
          onPress: () => {
            cancelBooking(bookingId);
            Alert.alert(
              "Booking Cancelled",
              "Your booking has been cancelled and your visit has been refunded.",
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#059669", "#0d9488"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>
            {userBookings.length} active booking
            {userBookings.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.bookingsContainer}
        showsVerticalScrollIndicator={false}
      >
        {userBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <CalendarIcon size={64} color="#94a3b8" />
            <Text style={styles.emptyStateTitle}>No bookings yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Browse available training slots to make your first booking
            </Text>
          </View>
        ) : (
          userBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingDate}>
                    {new Date(booking.slot.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                  <View style={styles.timeContainer}>
                    <Clock size={16} color="#64748b" />
                    <Text style={styles.bookingTime}>
                      {booking.slot.startTime} - {booking.slot.endTime}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(booking.id)}
                >
                  <X size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>

              {booking.slot.description && (
                <Text style={styles.bookingDescription}>
                  {booking.slot.description}
                </Text>
              )}

              <View style={styles.bookingFooter}>
                <Text style={styles.trainerName}>
                  with {booking.slot.trainerName}
                </Text>
                <View style={styles.capacityContainer}>
                  <Users size={16} color="#64748b" />
                  <Text style={styles.capacityText}>
                    {booking.slot.currentBookings}/{booking.slot.maxCapacity}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingMeta}>
                <Text style={styles.bookedAt}>
                  Booked on {new Date(booking.bookedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
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
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#ffffff",
    opacity: 0.9,
  },
  bookingsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },
  bookingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingDate: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 6,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bookingTime: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#64748b",
  },
  cancelButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fef2f2",
  },
  bookingDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  trainerName: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#475569",
  },
  capacityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  capacityText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#475569",
  },
  bookingMeta: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  bookedAt: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#94a3b8",
  },
});
