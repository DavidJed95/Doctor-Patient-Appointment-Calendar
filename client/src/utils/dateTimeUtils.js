/**
 * Converts HH:MM:SS to total minutes.
 * @param {string} duration - The duration in HH:MM:SS format.
 * @returns {number} The total duration in minutes.
 */
export const durationToMinutes = (duration) => {
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return hours * 60 + minutes + Math.floor(seconds / 60);
};

/**
 * Adds minutes to a date object.
 * @param {Date} date - The original date.
 * @param {number} minutes - Minutes to add.
 * @returns {Date} A new date with the added minutes.
 */
export const addMinutesToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

/**
 * Formats a date object to HH:MM:SS string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted time string.
 */
export const formatToHHMMSS = (date) => {
  return date.toTimeString().split(" ")[0];
};

/**
 * Extract available dates from a list of shifts.
 * @param {Array} shifts - Array of shifts.
 * @returns {Array} Unique available dates.
 */
export const extractAvailableDates = (shifts) => {
  const dates = shifts.map((shift) => shift.ShiftDate);
  return [...new Set(dates)];
};

// Function to convert time strings (HH:MM:SS) into date objects
const createTimeObj = (dateStr, timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  const date = new Date(dateStr);
  date.setHours(hours, minutes, seconds || 0);
  return date;
};

/**
 * Extract available times from a list of shifts for a selected date.
 * Returns individual `Date` objects for each available time slot.
 *
 * @param {Array} shifts - Array of shifts.
 * @param {Date} selectedDate - The selected date.
 * @returns {Array} Available times as Date objects.
 */
export const extractAvailableTimes = (shifts, selectedDate) => {
  const workingShifts = shifts.filter((shift) => shift.Type === "Working Hour");
  const breakShifts = shifts.filter((shift) => shift.Type === "Break");
  const availableTimes = [];

  workingShifts.forEach((shift) => {
    let currentStart = createTimeObj(shift.ShiftDate, shift.StartTime);
    const workEndTime = createTimeObj(shift.ShiftDate, shift.EndTime);

    // If the shift is on the selected date, process times
    if (currentStart.toDateString() === new Date(selectedDate).toDateString()) {
      breakShifts.forEach((breakShift) => {
        const breakStartTime = createTimeObj(
          breakShift.ShiftDate,
          breakShift.StartTime
        );
        const breakEndTime = createTimeObj(
          breakShift.ShiftDate,
          breakShift.EndTime
        );

        // If break is within current working shift, push times up to break start
        while (currentStart < workEndTime && currentStart < breakStartTime) {
          availableTimes.push(new Date(currentStart));
          currentStart = addMinutesToDate(currentStart, 15); // Add 15-minute intervals
        }

        // Skip the break period by setting currentStart to breakEndTime
        if (breakStartTime >= currentStart && breakEndTime <= workEndTime) {
          currentStart = breakEndTime;
        }
      });

      // Add remaining working time after breaks
      while (currentStart < workEndTime) {
        availableTimes.push(new Date(currentStart));
        currentStart = addMinutesToDate(currentStart, 15);
      }
    }
  });

  return availableTimes;
};
