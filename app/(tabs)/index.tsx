import CalendarPicker from "@/components/molecules/CalendarPicker";
import TrainingSlotEvent from "@/components/molecules/TrainingSlotEvent";
import { useApp } from "@/contexts/AppContext";
import { FlashList } from "@shopify/flash-list";
import { CalendarIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Text, View } from "react-native";

export default function TrainingSlotsScreen() {
  const { user, timeSlots } = useApp();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredSlotsByDate = timeSlots.filter(
    (slot) =>
      new Date(slot.date).toDateString() === selectedDate.toDateString(),
  );

  const filteredSlots =
    user?.role === "trainer"
      ? filteredSlotsByDate.filter((slot) => slot.trainerId === user.id)
      : filteredSlotsByDate;

  return (
    <View className="flex-1 flex flex-col">
      <CalendarPicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <FlashList
        ListEmptyComponent={() => (
          <View className="flex flex-col justify-center items-center pt-60">
            <CalendarIcon size={64} color="#94a3b8" />
            <Text className="text-2xl font-bold">
              {user?.role === "trainer"
                ? "No slots created yet"
                : "No available slots"}
            </Text>
            <Text className="text-lg font-semibold text-gray-500">
              {user?.role === "trainer"
                ? "Create your first training slot to get started"
                : "Check back later for new training opportunities"}
            </Text>
          </View>
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
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
