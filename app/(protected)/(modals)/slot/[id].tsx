import {
  bookSlot,
  fetchBookingsOfUserForSlot,
} from "@/services/slotBookingService";
import { fetchTimeSlotById } from "@/services/timeSlotService";
import { fetchUserById } from "@/services/userService";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MessagesSquareIcon, Users } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

const SlotInfo = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userId } = useAuth();
  const { id } = useLocalSearchParams();

  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(userId as string),
  });

  const { data: slot } = useQuery({
    queryKey: ["slot", id],
    queryFn: () => fetchTimeSlotById(parseInt(id as string)),
  });

  const { data: trainer } = useQuery({
    queryKey: ["trainer", slot?.user_id],
    queryFn: () => fetchUserById(slot?.user_id as string),
    enabled: slot?.user_id != null,
  });

  const { data: slotBookingForUser } = useQuery({
    queryKey: ["bookingsforslot", slot?.id, userId],
    queryFn: () => fetchBookingsOfUserForSlot(slot.id, userId as string),
    enabled: !!slot?.id && !!userId,
  });

  const bookSlotMutation = useMutation({
    mutationKey: ["bookMutation"],
    mutationFn: (slotId: number) => bookSlot(slotId, userId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "bookingsforslot",
          "user",
          "slot",
          "trainer",
          slot.id,
          userId,
        ],
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
    slot?.current_bookings >= slot?.max_capacity ||
    (user && user?.remaining_visits <= 0);

  const renderButtonText = () => {
    if (slotBookingForUser && slotBookingForUser?.length > 0) {
      return "Already Booked";
    } else if (slot?.current_bookings >= slot?.max_capacity) {
      return "Out of space";
    } else if (user && user?.remaining_visits <= 0) {
      return "Out of visits";
    } else {
      return "Book a slot";
    }
  };

  if (!slot)
    return (
      <View className="flex flex-col flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <View className="flex-1 p-4">
      <Pressable onPress={() => router.back()}>
        <ChevronLeft />
      </Pressable>
      <ScrollView>
        <Image
          source={require("../../../../assets/images/workout.png")}
          style={{ width: 200, height: 200, alignSelf: "center" }}
        />
        <Text className="text-2xl font-bold">{slot?.title}</Text>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-md text-gray-500">
            {new Date(slot.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Text>
          <View className="flex-row items-center space-x-2 border border-slate-500 px-3 py-1.5 rounded-lg">
            <Users size={16} color="#64748b" />
            <Text className="text-sm font-semibold text-slate-600">
              {slot.current_bookings}/{slot.max_capacity}
            </Text>
          </View>
        </View>
        <View className="border border-gray-300 rounded-lg p-4 my-4 flex flex-row gap-4 justify-between items-center">
          <Image
            source={require("../../../../assets/images/profile.jpg")}
            className="size-12 bg-yellow-900 rounded-full"
          />
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-500">Trainer</Text>
            <Text className="text-md font-medium text-black">
              {trainer?.name}
            </Text>
          </View>
          <MessagesSquareIcon />
        </View>
        <Text className="text-lg my-4">{slot.description}</Text>
      </ScrollView>
      <TouchableOpacity
        className="mb-4"
        disabled={isDisabled}
        onPress={() => bookSlotMutation.mutate(slot.id)}
      >
        <LinearGradient
          colors={isDisabled ? ["#c0c0c0", "#c9c9c9"] : ["#4f46e5", "#7c3aed"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 16,
            gap: 8,
            borderRadius: 12,
          }}
        >
          <Text className="text-lg text-white font-bold">
            {renderButtonText()}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default SlotInfo;
