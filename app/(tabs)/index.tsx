import CalendarPicker from "@/components/molecules/CalendarPicker";
import TrainingSlotEvent from "@/components/molecules/TrainingSlotEvent";
import { useApp } from "@/contexts/AppContext";
import { FlashList } from "@shopify/flash-list";
import { CalendarIcon } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TrainingSlotsScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { user, timeSlots, createTimeSlot } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
    maxCapacity: "4",
    description: "",
  });

  const handleSelectDate = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  // const handleCreateSlot = () => {
  //   if (!user || user.role !== "trainer") return;

  //   if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
  //     Alert.alert("Error", "Please fill in all required fields");
  //     return;
  //   }

  //   createTimeSlot({
  //     trainerId: user.id,
  //     trainerName: user.name,
  //     date: newSlot.date,
  //     startTime: newSlot.startTime,
  //     endTime: newSlot.endTime,
  //     maxCapacity: parseInt(newSlot.maxCapacity) || 4,
  //     description: newSlot.description,
  //   });

  //   setNewSlot({
  //     date: "",
  //     startTime: "",
  //     endTime: "",
  //     maxCapacity: "4",
  //     description: "",
  //   });
  //   setShowCreateModal(false);
  // };

  const filteredSlots =
    user?.role === "trainer"
      ? timeSlots.filter((slot) => slot.trainerId === user.id)
      : timeSlots;

  console.log("selectedDate: ", selectedDate);

  return (
    <View className="flex-1 flex flex-col">
      <CalendarPicker />
      <FlashList
        ListEmptyComponent={() => (
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
        )}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        data={filteredSlots}
        renderItem={({ item }) => <TrainingSlotEvent slot={item} />}
        estimatedItemSize={37}
        showsVerticalScrollIndicator={false}
      />
      {/* <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
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
              // onPress={handleCreateSlot}
            >
              <Text style={styles.createButtonText}>Create Training Slot</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
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
