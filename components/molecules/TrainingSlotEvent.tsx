import { TimeSlot, User } from "@/contexts/AppContext";
import {
  bookSlot,
  fetchBookingsOfUserForSlot,
} from "@/services/slotBookingService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { BookCheck, Clock, Plus } from "lucide-react-native";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

type TrainingSlotEventPropTypes = {
  slot: TimeSlot;
  user: User;
};

const TrainingSlotEvent = ({ slot, user }: TrainingSlotEventPropTypes) => {
  const queryClient = useQueryClient();

  const { data: slotBookingForUser } = useQuery({
    queryKey: ["bookingsforslot", slot?.id, user?.id],
    queryFn: () => fetchBookingsOfUserForSlot(slot.id, user.id),
    enabled: !!slot.id && !!user.id,
  });

  const bookSlotMutation = useMutation({
    mutationKey: ["bookMutation"],
    mutationFn: (slotId: number) => bookSlot(slotId, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookingsforslot", slot.id, user.id],
      });
      Alert.alert(
        "Success",
        "You have successfully booked this training slot!",
      );
    },
    onError: () => {
      Alert.alert(
        "Booking Failed",
        "Unable to book this slot. It may be full or you may have already booked it.",
      );
    },
  });

  const isDisabled =
    (slotBookingForUser && slotBookingForUser?.length > 0) ||
    slot.current_bookings >= slot.max_capacity ||
    user?.remaining_visits <= 0;

  return (
    <View
      key={slot.id}
      className="bg-white rounded-2xl p-4 shadow-sm flex flex-row gap-4 justify-between items-center mb-4"
    >
      <View className="flex-row justify-between items-start flex-1">
        <View className="flex-1">
          <Link asChild href={`./(modals)/slot/${slot.id}`}>
            <Text className="text-lg font-semibold text-slate-800 mb-1">
              {slot.title}
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
          onPress={() => bookSlotMutation.mutate(slot.id)}
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
              <BookCheck size={14} color={"white"} />
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
