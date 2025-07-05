import React, { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CalendarPicker = () => {
  const scrollViewRef = useRef<ScrollView & { measure: any }>(null);
  const itemRefs = useRef<(View | null)[]>([]);

  const [scrollX, setScrollX] = useState(0);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
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

  // Scroll to element if out of view
  const scrollToIndex = (index: number) => {
    const scrollRef = scrollViewRef.current;
    const selectedRef = itemRefs.current[index];

    if (!scrollRef || !selectedRef) return;

    selectedRef.measureLayout(
      // Measure relative to ScrollView
      scrollRef,
      (left: number, top: number, width: number, height: number) => {
        const visibleStart = scrollX;
        const visibleEnd = scrollX + scrollViewWidth;

        const elementStart = left;
        const elementEnd = left + width;

        if (elementStart < visibleStart) {
          // Scroll left to show element start
          scrollRef.scrollTo({ x: elementStart - 16, animated: true });
        } else if (elementEnd > visibleEnd) {
          // Scroll right to show element end
          scrollRef.scrollTo({
            x: elementEnd - scrollViewWidth + 16,
            animated: true,
          });
        }
      },
      (error: unknown) => {
        console.warn("measureLayout error:", error);
      },
    );
  };

  const handleDatePress = (date: Date, index: number) => {
    setSelectedDate(date);
    scrollToIndex(index);
  };

  return (
    <ScrollView
      horizontal
      ref={scrollViewRef}
      showsHorizontalScrollIndicator={false}
      style={styles.weekContainer}
      onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
        setScrollX(e.nativeEvent.contentOffset.x)
      }
      onLayout={(e) => setScrollViewWidth(e.nativeEvent.layout.width)}
      scrollEventThrottle={16}
    >
      {weekDays.map((date, index) => {
        const { day, month, weekday } = formatDate(date);
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const isTodayDate = isToday(date);

        return (
          <TouchableOpacity
            key={index}
            style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
            onPress={() => handleDatePress(date, index)}
            ref={(ref) => (itemRefs.current[index] = ref)}
            activeOpacity={0.7}
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
    paddingTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
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
