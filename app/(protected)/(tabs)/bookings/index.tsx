"use client";

import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
} from "react-native-calendars";

interface Event {
  title: string;
  data: {
    id: string;
    title: string;
    time: string;
    color: string;
    description?: string;
  }[];
}

const SAMPLE_EVENTS: Event[] = [
  {
    title: "2024-12-25",
    data: [
      {
        id: "1",
        title: "Christmas Day",
        time: "All Day",
        color: "#ff6b6b",
        description: "Celebrate Christmas with family",
      },
    ],
  },
  {
    title: "2024-12-31",
    data: [
      {
        id: "2",
        title: "New Year's Eve Party",
        time: "8:00 PM",
        color: "#4ecdc4",
        description: "Ring in the new year!",
      },
    ],
  },
  {
    title: "2025-01-01",
    data: [
      {
        id: "3",
        title: "New Year's Day",
        time: "All Day",
        color: "#45b7d1",
        description: "Happy New Year!",
      },
    ],
  },
  {
    title: "2025-01-15",
    data: [
      {
        id: "4",
        title: "Team Meeting",
        time: "10:00 AM",
        color: "#96ceb4",
        description: "Weekly team sync",
      },
      {
        id: "5",
        title: "Lunch with Client",
        time: "12:30 PM",
        color: "#feca57",
        description: "Business lunch at downtown restaurant",
      },
    ],
  },
  {
    title: "2025-01-20",
    data: [
      {
        id: "6",
        title: "Doctor Appointment",
        time: "2:00 PM",
        color: "#ff9ff3",
        description: "Annual checkup",
      },
    ],
  },
  {
    title: "2025-01-25",
    data: [
      {
        id: "7",
        title: "Project Deadline",
        time: "5:00 PM",
        color: "#ff6b6b",
        description: "Submit final project deliverables",
      },
    ],
  },
];

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  // Create marked dates object for the calendar
  const markedDates = React.useMemo(() => {
    const marked: any = {};
    SAMPLE_EVENTS.forEach((section) => {
      const date = section.title;
      marked[date] = {
        marked: true,
        dots: section.data.map((event) => ({ color: event.color })),
      };
    });
    return marked;
  }, []);

  const renderItem = useCallback(({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() =>
          Alert.alert(item.title, item.description || "No description")
        }
      >
        <View style={[styles.eventColorBar, { backgroundColor: item.color }]} />
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventTime}>{item.time}</Text>
          {item.description && (
            <Text style={styles.eventDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderEmptyDate = useCallback(() => {
    return (
      <View style={styles.emptyDate}>
        <Text style={styles.emptyDateText}>No events scheduled</Text>
        <Text style={styles.emptyDateSubtext}>
          Tap &quot;Add Event&quot; to create one
        </Text>
      </View>
    );
  }, []);

  const renderSectionHeader = useCallback(({ section }: { section: any }) => {
    const date = new Date(section?.title);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{formattedDate}</Text>
        <View style={styles.sectionHeaderLine} />
      </View>
    );
  }, []);

  const addEvent = () => {
    Alert.alert("Add Event", `Add event for ${selectedDate}`);
  };

  const onDateChanged = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Calendar</Text>
        <TouchableOpacity style={styles.addButton} onPress={addEvent}>
          <Text style={styles.addButtonText}>+ Add Event</Text>
        </TouchableOpacity>
      </View>

      <CalendarProvider date={selectedDate} onDateChanged={onDateChanged}>
        <ExpandableCalendar
          firstDay={1}
          markedDates={markedDates}
          markingType="multi-dot"
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#007AFF",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#007AFF",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: "#00adf5",
            selectedDotColor: "#ffffff",
            arrowColor: "#007AFF",
            disabledArrowColor: "#d9e1e8",
            monthTextColor: "#2d4150",
            indicatorColor: "#007AFF",
            textDayFontFamily: "System",
            textMonthFontFamily: "System",
            textDayHeaderFontFamily: "System",
            textDayFontWeight: "400",
            textMonthFontWeight: "600",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />

        <AgendaList
          sections={SAMPLE_EVENTS}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          sectionStyle={styles.section}
          dayFormat="yyyy-MM-dd"
          showClosingKnob={true}
          scrollToNextEvent={true}
          avoidDateUpdates={false}
          renderEmptyData={renderEmptyDate}
        />
      </CalendarProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2d4150",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  section: {
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d4150",
    marginRight: 12,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e9ecef",
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventColorBar: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d4150",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 14,
    color: "#6c757d",
    lineHeight: 20,
  },
  emptyDate: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyDateText: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 4,
  },
  emptyDateSubtext: {
    fontSize: 14,
    color: "#adb5bd",
  },
});
