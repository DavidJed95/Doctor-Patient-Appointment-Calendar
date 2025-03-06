import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimeInput = ({ selected, onChange, availableTimes, availableDates }) => {
  const mappedAvailableDates = availableDates
    .map((date) => new Date(date))
    .filter((date) => date instanceof Date && !isNaN(date));

  const mappedAvailableTimes = availableTimes
    .map((time) => new Date(time))
    .filter((time) => time instanceof Date && !isNaN(time));
  return (
    <DatePicker
      showIcon
      selected={selected instanceof Date && !isNaN(selected) ? selected : null}
      onChange={onChange} // TODO: start date to change like setting different
      showTimeSelect
      includeDates={mappedAvailableDates}
      includeTimes={mappedAvailableTimes}
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="dd/MM/yyyy HH:mm"
      className="time-picker"
    />
  );
};

export default TimeInput;
