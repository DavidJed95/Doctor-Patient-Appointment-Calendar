import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimeInput = ({
  selected,
  onChange,
  includeTime,
  includeDate,
  availableDates = [],
  availableTimes = [],
  minDate,
  minTime,
  maxTime,
  availableShifts,
  selectedDate,
}) => {
  /**
   * Function that filters out dates not available in shifts.
   * @param {Date} date
   * @returns {boolean}
   */
  const filterAvailableDates = (date) => {
    const availableDatesList = availableShifts.map((shift) => new Date(shift.ShiftDate));
    return availableDatesList.some(
      (availableDate) =>
        date.getDate() === availableDate.getDate() &&
        date.getMonth() === availableDate.getMonth() &&
        date.getFullYear() === availableDate.getFullYear()
    );
  };

  /**
   * Filter times available within the shift.
   * @param {Date} time
   * @returns {boolean}
   */
  const filterAvailableTimes = (time) => {
    const shift = availableShifts.find((shift) => shift.ShiftDate === selectedDate);
    if (shift) {
      const [startHour, startMinute] = shift.StartTime.split(":").map(Number);
      const [endHour, endMinute] = shift.EndTime.split(":").map(Number);
      const shiftStart = new Date(selectedDate);
      const shiftEnd = new Date(selectedDate);
      shiftStart.setHours(startHour, startMinute);
      shiftEnd.setHours(endHour, endMinute);
      return time >= shiftStart && time <= shiftEnd;
    }
    return false;
  };

  const highlightDates = availableDates.map((date) => new Date(date));

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect={includeTime}
      showTimeSelectOnly={!includeDate && includeTime}
      showDateSelect={includeDate}
      filterDate={filterAvailableDates}
      filterTime={filterAvailableTimes}
      dateFormat={includeDate && includeTime ? "Pp" : includeTime ? "HH:mm" : "P"}
      minDate={minDate}
      minTime={minTime}
      maxTime={maxTime}
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Time"
      highlightDates={highlightDates}
      includeDates={highlightDates}
      includeTimes={availableTimes.map((time) => new Date(time))}
    />
  );
};

export default TimeInput;