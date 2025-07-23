import { clsx } from "clsx";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type CalendarPickerProps = {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
};

const CalendarPicker = ({
  selectedDate,
  setSelectedDate,
}: CalendarPickerProps) => {
  // Generate the next 7 days starting from today
  const generateWeekDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const weekDays = generateWeekDays();

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    const weekday = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();

    return { day, month, weekday };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDatePress = (date: Date, index: number) => {
    setSelectedDate(date);
  };

  return (
    <View className="m-4 shadow-sm">
      <View className="flex flex-row overflow-hidden bg-white rounded-xl justify-between p-4">
        {weekDays.map((date, index) => {
          const { day, weekday } = formatDate(date);
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const isTodayDate = isToday(date);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleDatePress(date, index)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={isSelected ? ["#4f46e5", "#7c3aed"] : ["#fff", "#fff"]} // Your desired gradient colors
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: 49,
                  height: 49,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 12,
                }}
              >
                <Text
                  className={clsx(
                    "text-xs",
                    isSelected && "text-white",
                    !isSelected && isTodayDate && "text-red-500",
                  )}
                >
                  {weekday}
                </Text>
                <Text className={clsx("font-bold", isSelected && "text-white")}>
                  {day}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CalendarPicker;
