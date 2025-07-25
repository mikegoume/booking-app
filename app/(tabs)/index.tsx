import CalendarPicker from "@/components/molecules/CalendarPicker";
import TrainingSlotEvent from "@/components/molecules/TrainingSlotEvent";
import { useApp } from "@/contexts/AppContext";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { CalendarIcon, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function TrainingSlotsScreen() {
  const router = useRouter();
  const { user, timeSlots } = useApp();

  const isTrainee = user?.role === "trainee";

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
      {!isTrainee && (
        <TouchableOpacity
          onPress={() => router.push("/(modals)/slot/manage/create")}
          className="absolute bottom-4 right-4"
        >
          <LinearGradient
            colors={["#4f46e5", "#7c3aed"]} // Your desired gradient colors
            style={{
              display: "flex",
              flexDirection: "column",
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 25,
            }}
          >
            <Plus size={20} color={"white"} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}
