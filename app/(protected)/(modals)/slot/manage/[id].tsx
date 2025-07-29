import { useApp } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { TextInput } from "react-native-paper";

const ManageSlot = () => {
  const { id } = useLocalSearchParams();
  const { timeSlots } = useApp();

  const selectedSlot = id;

  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
    maxCapacity: "",
    description: "",
    title: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  return (
    <SafeAreaView className="flex flex-col flex-1 bg-white">
      <ScrollView contentContainerClassName="p-4 gap-4">
        <TextInput
          style={{ backgroundColor: "white" }}
          label={"Title"}
          mode="outlined"
          value={newSlot.title}
          onChangeText={(text) => setNewSlot({ ...newSlot, title: text })}
          placeholder="Slot Title"
        />
        <TextInput
          style={{ backgroundColor: "white" }}
          label={"Select Date"}
          mode="outlined"
          value={newSlot.date}
          onFocus={() => setShowDatePicker(true)}
        />
        <DatePicker
          modal
          open={showDatePicker}
          date={new Date()}
          onConfirm={(date) => {
            setNewSlot((prevSlot) => ({
              ...prevSlot,
              date: date.toLocaleDateString(),
            }));
            setShowDatePicker(false);
          }}
          onCancel={() => {
            setShowDatePicker(false);
          }}
          mode="date"
        />
        <View className="flex flex-row justify-between">
          <TextInput
            style={{ width: "47.5%", backgroundColor: "transparent" }}
            label={"Start Time"}
            mode="outlined"
            value={newSlot.startTime}
            onFocus={() => setShowStartTimePicker(true)}
          />
          <DatePicker
            modal
            open={showStartTimePicker}
            date={new Date()}
            onConfirm={(date) => {
              setNewSlot((prevSlot) => ({
                ...prevSlot,
                startTime: date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }),
              }));
              setShowStartTimePicker(false);
            }}
            onCancel={() => {
              setShowStartTimePicker(false);
            }}
            mode="time"
          />
          <TextInput
            style={{ width: "47.5%", backgroundColor: "white" }}
            label={"End Time"}
            mode="outlined"
            value={newSlot.endTime}
            onFocus={() => setShowEndTimePicker(true)}
          />
          <DatePicker
            modal
            open={showEndTimePicker}
            date={new Date()}
            onConfirm={(date) => {
              setNewSlot((prevSlot) => ({
                ...prevSlot,
                endTime: date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }),
              }));
              setShowEndTimePicker(false);
            }}
            onCancel={() => {
              setShowEndTimePicker(false);
            }}
            mode="time"
          />
        </View>
        <TextInput
          style={{ backgroundColor: "white" }}
          label={"Max Capacity"}
          mode="outlined"
          value={newSlot.maxCapacity}
          onChangeText={(text) => setNewSlot({ ...newSlot, maxCapacity: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={{ backgroundColor: "white" }}
          label={"Description"}
          mode="outlined"
          value={newSlot.description}
          onChangeText={(text) => setNewSlot({ ...newSlot, description: text })}
          placeholder="Describe your training session..."
          multiline
          numberOfLines={3}
        />
      </ScrollView>
      <TouchableOpacity className="items-center mx-4">
        <LinearGradient
          colors={["#4f46e5", "#7c3aed"]}
          style={{
            width: "100%",
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
          }}
        >
          <Text className="text-white">Create Training Slot</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ManageSlot;
