import { useApp } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
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

export default function TrainingSlotsScreen() {
  const { user, timeSlots, createTimeSlot, bookSlot } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
    maxCapacity: "4",
    description: "",
  });

  const handleCreateSlot = () => {
    if (!user || user.role !== "trainer") return;

    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    createTimeSlot({
      trainerId: user.id,
      trainerName: user.name,
      date: newSlot.date,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      maxCapacity: parseInt(newSlot.maxCapacity) || 4,
      description: newSlot.description,
    });

    setNewSlot({
      date: "",
      startTime: "",
      endTime: "",
      maxCapacity: "4",
      description: "",
    });
    setShowCreateModal(false);
  };

  const handleBookSlot = (slotId: string) => {
    if (!user || user.role !== "trainee") return;

    if (user.remainingVisits <= 0) {
      Alert.alert(
        "No Visits Remaining",
        "You have no remaining training visits. Please contact your trainer to purchase more sessions.",
      );
      return;
    }

    const success = bookSlot(slotId);
    if (success) {
      Alert.alert(
        "Success",
        "You have successfully booked this training slot!",
      );
    } else {
      Alert.alert(
        "Booking Failed",
        "Unable to book this slot. It may be full or you may have already booked it.",
      );
    }
  };

  const filteredSlots =
    user?.role === "trainer"
      ? timeSlots.filter((slot) => slot.trainerId === user.id)
      : timeSlots;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#4f46e5", "#7c3aed"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {user?.role === "trainer"
              ? "My Training Slots"
              : "Available Training Slots"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {user?.role === "trainer"
              ? "Manage your training sessions"
              : `${user?.remainingVisits || 0} visits remaining`}
          </Text>
          {user?.role === "trainer" && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Plus size={20} color="#4f46e5" />
              <Text style={styles.addButtonText}>Create New Slot</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.slotsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredSlots.length === 0 ? (
          <View style={styles.emptyState}>
            <CalendarIcon size={64} color="#94a3b8" />
            <Text style={styles.emptyStateTitle}>
              {user?.role === "trainer"
                ? "No slots created yet"
                : "No available slots"}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {user?.role === "trainer"
                ? "Create your first training slot to get started"
                : "Check back later for new training opportunities"}
            </Text>
          </View>
        ) : (
          filteredSlots.map((slot) => (
            <View key={slot.id} style={styles.slotCard}>
              <View style={styles.slotHeader}>
                <View style={styles.slotInfo}>
                  <Text style={styles.slotDate}>
                    {new Date(slot.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                  <View style={styles.timeContainer}>
                    <Clock size={16} color="#64748b" />
                    <Text style={styles.slotTime}>
                      {slot.startTime} - {slot.endTime}
                    </Text>
                  </View>
                </View>
                <View style={styles.capacityContainer}>
                  <Users size={16} color="#64748b" />
                  <Text style={styles.capacityText}>
                    {slot.currentBookings}/{slot.maxCapacity}
                  </Text>
                </View>
              </View>

              {slot.description && (
                <Text style={styles.slotDescription}>{slot.description}</Text>
              )}

              <View style={styles.slotFooter}>
                <Text style={styles.trainerName}>with {slot.trainerName}</Text>
                {user?.role === "trainee" && (
                  <TouchableOpacity
                    style={[
                      styles.bookButton,
                      (slot.currentBookings >= slot.maxCapacity ||
                        slot.bookedByIds.includes(user.id) ||
                        user.remainingVisits <= 0) &&
                        styles.bookButtonDisabled,
                    ]}
                    onPress={() => handleBookSlot(slot.id)}
                    disabled={
                      slot.currentBookings >= slot.maxCapacity ||
                      slot.bookedByIds.includes(user.id) ||
                      user.remainingVisits <= 0
                    }
                  >
                    <Text
                      style={[
                        styles.bookButtonText,
                        (slot.currentBookings >= slot.maxCapacity ||
                          slot.bookedByIds.includes(user.id) ||
                          user.remainingVisits <= 0) &&
                          styles.bookButtonTextDisabled,
                      ]}
                    >
                      {slot.bookedByIds.includes(user.id)
                        ? "Booked"
                        : slot.currentBookings >= slot.maxCapacity
                          ? "Full"
                          : user.remainingVisits <= 0
                            ? "No Visits"
                            : "Book Now"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Slot Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Training Slot</Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={newSlot.date}
                onChangeText={(text) => setNewSlot({ ...newSlot, date: text })}
                placeholder="2024-12-30"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Start Time</Text>
                <TextInput
                  style={styles.input}
                  value={newSlot.startTime}
                  onChangeText={(text) =>
                    setNewSlot({ ...newSlot, startTime: text })
                  }
                  placeholder="09:00"
                />
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>End Time</Text>
                <TextInput
                  style={styles.input}
                  value={newSlot.endTime}
                  onChangeText={(text) =>
                    setNewSlot({ ...newSlot, endTime: text })
                  }
                  placeholder="10:00"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Max Capacity</Text>
              <TextInput
                style={styles.input}
                value={newSlot.maxCapacity}
                onChangeText={(text) =>
                  setNewSlot({ ...newSlot, maxCapacity: text })
                }
                placeholder="4"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newSlot.description}
                onChangeText={(text) =>
                  setNewSlot({ ...newSlot, description: text })
                }
                placeholder="Describe your training session..."
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateSlot}
            >
              <Text style={styles.createButtonText}>Create Training Slot</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#4f46e5",
  },
  slotsContainer: {
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
  slotCard: {
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
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  slotInfo: {
    flex: 1,
  },
  slotDate: {
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
  slotTime: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#64748b",
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
  slotDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  slotFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trainerName: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#475569",
  },
  bookButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonDisabled: {
    backgroundColor: "#e2e8f0",
  },
  bookButtonText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  bookButtonTextDisabled: {
    color: "#94a3b8",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  inputGroupHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    backgroundColor: "#ffffff",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  createButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
});
