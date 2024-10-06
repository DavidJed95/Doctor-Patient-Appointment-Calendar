import { format } from "date-fns";

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

/**
 * Extract available times from a list of shifts for a selected date.
 * @param {Array} shifts - Array of shifts.
 * @param {Date} selectedDate - The selected date.
 * @returns {Array} Available start and end times.
 */
export const extractAvailableTimes = (shifts, selectedDate) => {
  const times = shifts
    .filter((shift) => shift.ShiftDate === format(selectedDate, "yyyy-MM-dd"))
    .map((shift) => ({ startTime: shift.StartTime, endTime: shift.EndTime }));
  return times;
};
