import React from "react";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";

const CalendarPicker = (props) => {
  const { selectedDate, handleSelectDate, children } = props;

  return (
    <CalendarProvider date={selectedDate} onDateChanged={handleSelectDate}>
      <WeekCalendar firstDay={1} onDayPress={handleSelectDate} />
      {children}
    </CalendarProvider>
  );
};

export default CalendarPicker;
