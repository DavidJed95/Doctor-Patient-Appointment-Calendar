'use strict';
const doQuery = require('../query');

/**
 * Updates current appointment
 * @param {*} appointmentId appointment to update
 * @param {*} appointmentDetailsToUpdate - fields to update at the appointment details
 * @returns updated appointment or
 */
async function updateAppointment(appointmentID, appointmentDetailsToUpdate) {
  // Check if the appointment is at least one day before the appointment
  const appointmentToFetchSQL = `SELECT * FROM appointments WHERE AppointmentID=?` 
  const appointment = await doQuery(appointmentToFetchSQL ,appointmentID);
  const appointmentDate = new Date(appointment.Date);
  const currentDate = new Date();
  const oneDayInMillis = 24 * 60 * 60 * 1000; // One day in milliseconds

  if (appointmentDate - currentDate < oneDayInMillis) {
    return {
      status: 'failure',
      message: 'Cannot update appointment within 24 hours of the appointment',
    };
  }

  // Update the appointment details
  const updateFields = [];
  let updateQuery = 'UPDATE appointments SET ';

  for (const [key, value] of Object.entries(updates)) {
    updateQuery += `${key} = ?, `;
    updateFields.push(value);
  }

  // Remove the trailing comma and space
  updateQuery = updateQuery.slice(0, -2);

  // Add the WHERE clause
  updateQuery += ' WHERE AppointmentID = ?';
  updateFields.push(appointmentID);

  // Execute the update query
  await doQuery(updateQuery, updateFields);

  // Fetch the updated appointment details
  const selectSql = 'SELECT * FROM appointments WHERE AppointmentID = ?';
  const updatedAppointment = await doQuery(selectSql, [appointmentID]);


  return { status: 'success', message: 'Appointment updated successfully', appointment: updatedAppointment };
}

module.exports = updateAppointment;
