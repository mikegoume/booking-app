import { useApp } from "@/contexts/AppContext";
import { fetchTimeSlots } from "@/services/timeSlotService";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowLeft,
  Award,
  Calendar as CalendarIcon,
  CreditCard as Edit3,
  MessageCircle,
  Minus,
  Plus,
  TrendingUp,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TraineesScreen() {
  const { user, updateUserVisits, getAllUsers } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<any>(null);
  const [newVisits, setNewVisits] = useState("");

  const { data: timeSlots } = useQuery({
    queryKey: ["timeslots"],
    queryFn: () => fetchTimeSlots(),
  });

  if (user?.role !== "trainer") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          Access denied. Trainer role required.
        </Text>
      </SafeAreaView>
    );
  }

  // Get all trainees who have booked with this trainer
  const allUsers = getAllUsers();
  const trainerSlots = timeSlots?.filter((slot) => slot.trainerId === user.id);
  const trainerBookings = bookings.filter(
    (booking) =>
      trainerSlots.some((slot) => slot.id === booking.slotId) &&
      booking.status === "active",
  );

  // Get unique trainees who have booked with this trainer
  const traineeIds = [
    ...new Set(trainerBookings.map((booking) => booking.userId)),
  ];
  const trainees = allUsers.filter(
    (u) => traineeIds.includes(u.id) && u.role === "trainee",
  );

  const getTraineeStats = (traineeId: string) => {
    const traineeBookings = trainerBookings.filter(
      (booking) => booking.userId === traineeId,
    );
    const upcomingBookings = traineeBookings.filter((booking) => {
      const bookingDate = new Date(booking.slot.date);
      return bookingDate >= new Date();
    });

    return {
      totalBookings: traineeBookings.length,
      upcomingBookings: upcomingBookings.length,
      completedSessions: traineeBookings.length - upcomingBookings.length,
    };
  };

  const handleEditVisits = (trainee: any) => {
    setSelectedTrainee(trainee);
    setNewVisits(trainee.remainingVisits.toString());
    setShowEditModal(true);
  };

  const handleUpdateVisits = () => {
    if (!selectedTrainee) return;

    const visits = parseInt(newVisits);
    if (isNaN(visits) || visits < 0) {
      Alert.alert("Error", "Please enter a valid number of visits");
      return;
    }

    updateUserVisits(selectedTrainee.id, visits);
    setShowEditModal(false);
    setSelectedTrainee(null);
    setNewVisits("");
    Alert.alert("Success", "Trainee visits updated successfully");
  };

  const handleChat = (trainee: any) => {
    router.push({
      pathname: "/chat",
      params: {
        userId: trainee.id,
        userName: trainee.name,
        userRole: trainee.role,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#7c3aed", "#c084fc"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>My Trainees</Text>
              <Text style={styles.headerSubtitle}>
                {trainees.length} active trainee
                {trainees.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => router.push("/chat")}
            >
              <MessageCircle size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.traineesContainer}
        showsVerticalScrollIndicator={false}
      >
        {trainees.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={64} color="#94a3b8" />
            <Text style={styles.emptyStateTitle}>No trainees yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Trainees will appear here once they book your training slots
            </Text>
          </View>
        ) : (
          trainees.map((trainee) => {
            const stats = getTraineeStats(trainee.id);
            return (
              <View key={trainee.id} style={styles.traineeCard}>
                <View style={styles.traineeHeader}>
                  <View style={styles.traineeInfo}>
                    <Text style={styles.traineeName}>{trainee.name}</Text>
                    <Text style={styles.traineeEmail}>{trainee.email}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.chatIconButton}
                    onPress={() => handleChat(trainee)}
                  >
                    <MessageCircle size={20} color="#7c3aed" />
                  </TouchableOpacity>
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <Award size={20} color="#3b82f6" />
                    </View>
                    <Text style={styles.statNumber}>
                      {trainee.remainingVisits}
                    </Text>
                    <Text style={styles.statLabel}>Visits Left</Text>
                  </View>

                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <CalendarIcon size={20} color="#059669" />
                    </View>
                    <Text style={styles.statNumber}>
                      {stats.upcomingBookings}
                    </Text>
                    <Text style={styles.statLabel}>Upcoming</Text>
                  </View>

                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <TrendingUp size={20} color="#dc2626" />
                    </View>
                    <Text style={styles.statNumber}>
                      {stats.completedSessions}
                    </Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                </View>

                <View style={styles.traineeActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditVisits(trainee)}
                  >
                    <Edit3 size={16} color="#7c3aed" />
                    <Text style={styles.editButtonText}>Edit Visits</Text>
                  </TouchableOpacity>

                  <View style={styles.totalBookings}>
                    <Text style={styles.totalBookingsText}>
                      Total Sessions: {stats.totalBookings}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Edit Visits Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Visits</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.traineeModalName}>
                {selectedTrainee?.name}
              </Text>
              <Text style={styles.currentVisitsText}>
                Current visits: {selectedTrainee?.remainingVisits}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New number of visits</Text>
                <View style={styles.visitInputContainer}>
                  <TouchableOpacity
                    style={styles.visitButton}
                    onPress={() => {
                      const current = parseInt(newVisits) || 0;
                      if (current > 0) setNewVisits((current - 1).toString());
                    }}
                  >
                    <Minus size={20} color="#64748b" />
                  </TouchableOpacity>

                  <TextInput
                    style={styles.visitInput}
                    value={newVisits}
                    onChangeText={setNewVisits}
                    keyboardType="numeric"
                    textAlign="center"
                  />

                  <TouchableOpacity
                    style={styles.visitButton}
                    onPress={() => {
                      const current = parseInt(newVisits) || 0;
                      setNewVisits((current + 1).toString());
                    }}
                  >
                    <Plus size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateVisits}
              >
                <Text style={styles.updateButtonText}>Update Visits</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Inter-Medium",
    color: "#ef4444",
    textAlign: "center",
    marginTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
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
  chatButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 12,
  },
  traineesContainer: {
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
  traineeCard: {
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
  traineeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  traineeInfo: {
    flex: 1,
  },
  traineeName: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 4,
  },
  traineeEmail: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
  },
  chatIconButton: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#64748b",
    textAlign: "center",
  },
  traineeActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#7c3aed",
  },
  totalBookings: {
    flex: 1,
    alignItems: "flex-end",
  },
  totalBookingsText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#64748b",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  traineeModalName: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  currentVisitsText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#374151",
    marginBottom: 12,
    textAlign: "center",
  },
  visitInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  visitButton: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
  },
  visitInput: {
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    minWidth: 80,
  },
  updateButton: {
    backgroundColor: "#7c3aed",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
});
