import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimeInput = ({
  selected,
  onChange,
  includeTime,
  includeDate,
  minDate,
  minTime,
  maxTime,
  availableDates,
}) => {
  const isDateAvailable = (date) => {
    return availableDates.some(
      (availableDate) =>
        new Date(availableDate).toDateString() === date.toDateString()
    );
  };
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect={includeTime}
      showTimeSelectOnly={!includeDate && includeTime}
      showDateSelect={includeDate}
      dateFormat={
        includeDate && includeTime ? "Pp" : includeTime ? "HH:mm" : "P"
      }
      minDate={minDate}
      minTime={minTime}
      maxTime={maxTime}
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Time"
      highlightDates={availableDates}
      filterDate={isDateAvailable}
    />
  );
};

export default TimeInput;
