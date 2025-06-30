import { TimeSlot, useApp } from "@/contexts/AppContext";
import { Clock, Users } from "lucide-react-native";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

type TrainingSlotEventPropTypes = {
  slot: TimeSlot;
};

const TrainingSlotEvent = ({ slot }: TrainingSlotEventPropTypes) => {
  const { user, bookSlot } = useApp();

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

  const isDisabled =
    slot.currentBookings >= slot.maxCapacity ||
    slot.bookedByIds.includes(user?.id ?? "") ||
    (user?.remainingVisits ?? 0) <= 0;

  const buttonLabel = slot.bookedByIds.includes(user?.id ?? "")
    ? "Booked"
    : slot.currentBookings >= slot.maxCapacity
      ? "Full"
      : (user?.remainingVisits ?? 0) <= 0
        ? "No Visits"
        : "Book Now";

  return (
    <View key={slot.id} className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-slate-800 mb-1">
            {new Date(slot.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Text>
          <View className="flex-row items-center space-x-2">
            <Clock size={16} color="#64748b" />
            <Text className="text-sm font-medium text-slate-500">
              {slot.startTime} - {slot.endTime}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Users size={16} color="#64748b" />
          <Text className="text-sm font-semibold text-slate-600">
            {slot.currentBookings}/{slot.maxCapacity}
          </Text>
        </View>
      </View>

      {slot.description && (
        <Text className="text-sm text-slate-500 leading-5 mb-4">
          {slot.description}
        </Text>
      )}

      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-medium text-slate-600">
          with {slot.trainerName}
        </Text>
        {user?.role === "trainee" && (
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${
              isDisabled ? "bg-slate-200" : "bg-[#4f46e5]"
            }`}
            onPress={() => handleBookSlot(slot.id)}
            disabled={isDisabled}
          >
            <Text
              className={`text-sm font-semibold ${
                isDisabled ? "text-slate-400" : "text-white"
              }`}
            >
              {buttonLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TrainingSlotEvent;
