import { TimeSlot } from "@/contexts/AppContext";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { CalendarPlus, Clock, Plus } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type TrainingSlotEventPropTypes = {
  slot: TimeSlot;
};

const TrainingSlotEvent = ({ slot }: TrainingSlotEventPropTypes) => {
  const { user } = useUser();

  const handleBookSlot = (slotId: number) => {
    // if (success) {
    //   Alert.alert(
    //     "Success",
    //     "You have successfully booked this training slot!",
    //   );
    // } else {
    //   Alert.alert(
    //     "Booking Failed",
    //     "Unable to book this slot. It may be full or you may have already booked it.",
    //   );
    // }
  };

  const isDisabled =
    slot.current_bookings >= slot.max_capacity ||
    (user?.remaining_visits ?? 0) <= 0;

  return (
    <View
      key={slot.id}
      className="bg-white rounded-2xl p-4 shadow-sm flex flex-row gap-4 justify-between items-center mb-4"
    >
      <View className="flex-row justify-between items-start flex-1">
        <View className="flex-1">
          <Link asChild href={`./(modals)/slot/${slot.id}`}>
            <Text className="text-lg font-semibold text-slate-800 mb-1">
              {slot.description}
            </Text>
          </Link>
          <View className="flex-row items-center space-x-2 gap-2">
            <Clock size={16} color="#64748b" />
            <Text className="text-sm font-medium text-slate-500">
              {`${slot.start_time.split(":")[0]}:${slot.start_time.split(":")[1]}`}
              {" - "}
              {`${slot.end_time.split(":")[0]}:${slot.end_time.split(":")[1]}`}
            </Text>
          </View>
        </View>
      </View>

      {user?.role === "trainee" && (
        <TouchableOpacity
          onPress={() => handleBookSlot(slot.id)}
          disabled={isDisabled}
        >
          <LinearGradient
            colors={["#4f46e5", "#7c3aed"]} // Your desired gradient colors
            style={{
              display: "flex",
              flexDirection: "column",
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
            }}
          >
            {isDisabled ? (
              <CalendarPlus size={14} color={"white"} />
            ) : (
              <Plus size={14} color={"white"} />
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TrainingSlotEvent;
