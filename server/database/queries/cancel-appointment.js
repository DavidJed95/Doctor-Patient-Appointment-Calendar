"use strict";
const doQuery = require("../query");

/**
 * Cancel an existing appointment.
 * @param {*} appointmentId - ID of the appointment to be canceled
 * @returns { status, message }
 */
async function cancelAppointment(appointmentId) {
  // Check if the appointment exists
  const appointmentCancelQuery =
    "SELECT * FROM appointments WHERE AppointmentID = ?";
  const [appointment] = await doQuery(appointmentCancelQuery, [appointmentId]);

  if (!appointment) {
    return { status: "failure", message: "Appointment not found" };
  }

  // Check if the appointment can be canceled (at least one day before the appointment)
  const today = new Date();
  const appointmentDate = new Date(appointment.Date);
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours
  const differenceInDays = Math.floor(
    (appointmentDate - today) / oneDayInMilliseconds
  );

  if (differenceInDays < 1) {
    return {
      status: "failure",
      message: "Appointment cannot be canceled less than one day before",
    };
  }

  // Delete the appointment
  const deleteQuery = "DELETE FROM appointments WHERE AppointmentID = ?";
  await doQuery(deleteQuery, [appointmentId]);

  return {
    status: "success",
    message: "Appointment canceled successfully",
    appointment,
  };
}

module.exports = cancelAppointment;
