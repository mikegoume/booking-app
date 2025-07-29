import { useApp } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MessagesSquareIcon, Users } from "lucide-react-native";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SlotInfo = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { timeSlots } = useApp();

  const slot = timeSlots.find((slot) => slot.id === id);

  if (!slot) return;

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
        <Text className="text-2xl font-bold">{slot?.description}</Text>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-md text-gray-500">
            {new Date(slot.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Text>
          <View className="flex-row items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Users size={16} color="#64748b" />
            <Text className="text-sm font-semibold text-slate-600">
              {slot.currentBookings}/{slot.maxCapacity}
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
              {slot.trainerName}
            </Text>
          </View>
          <MessagesSquareIcon />
        </View>
        <Text className="text-lg my-4">
          Kickstart your day with a balanced blend of light cardio and deep
          stretching. This session boosts your energy with low-impact movements,
          then shifts into guided flexibility work to improve mobility, release
          tension, and enhance overall well-being. Perfect for all fitness
          levels, it leaves you feeling refreshed, focused, and ready for the
          day ahead.
        </Text>
      </ScrollView>
      <TouchableOpacity className="mb-4">
        <LinearGradient
          colors={["#4f46e5", "#7c3aed"]}
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
          <Text className="text-lg text-white font-bold">Book a slot</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default SlotInfo;
