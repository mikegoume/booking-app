import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CalendarPicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.weekContainer}
    >
      {weekDays.map((date, index) => {
        const { day, month, weekday } = formatDate(date);
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const isTodayDate = isToday(date);

        return (
          <TouchableOpacity
            key={index}
            style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
            onPress={() => setSelectedDate(date)}
          >
            <Text
              style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}
            >
              {day}
            </Text>
            <View style={{ display: "flex", flexDirection: "column" }}>
              {isSelected && (
                <Text
                  style={[
                    styles.dayWeekday,
                    isSelected && styles.dayWeekdaySelected,
                    isTodayDate && !isSelected && styles.dayWeekdayToday,
                  ]}
                >
                  {weekday}
                </Text>
              )}
              <Text
                style={[styles.dayMonth, isSelected && styles.dayMonthSelected]}
              >
                {month}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  weekContainer: {
    maxHeight: 100,
    padding: 16,
    paddingBottom: 0,
  },
  dayButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    gap: 8,
    padding: 8,
  },
  dayButtonSelected: {
    padding: 16,
    backgroundColor: "#1e293b",
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#64748b",
  },
  dayNumberSelected: {
    fontSize: 32,
    color: "#ffffff",
  },
  dayWeekday: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#64748b",
  },
  dayWeekdaySelected: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
  dayWeekdayToday: {
    color: "#ef4444",
  },
  dayMonth: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#94a3b8",
  },
  dayMonthSelected: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default CalendarPicker;
