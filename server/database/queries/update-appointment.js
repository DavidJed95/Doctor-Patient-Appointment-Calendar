'use strict';
const doQuery = require('../query');
const emailService = require('../../services/emailService');

/**
 * Updates current appointment
 * @param {*} appointmentId appointment to update
 * @param {*} updates - fields to update at the appointment details
 * @returns updated appointment or
 */
async function updateAppointment(appointmentId, updates) {
  // Check if the appointment is at least one day before the appointment
  const appointment = await getAppointmentById(appointmentId);
  const appointmentDate = new Date(appointment.date);
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
  updateQuery += ' WHERE appointmentId = ?';
  updateFields.push(appointmentId);

  // Execute the update query
  await doQuery(updateQuery, updateFields);

  // Fetch the updated appointment details
  const selectSql = 'SELECT * FROM appointments WHERE appointmentId = ?';
  const [updatedAppointment] = await doQuery(selectSql, [appointmentId]);

  // Fetch the user details of the patient and medical specialist
  const patient = await getUserByID(updatedAppointment.PatientId);
  const specialist = await getUserByID(updatedAppointment.MedicalSpecialistId);

  // Send email notifications to the patient and medical specialist
  const emailContent = `Updated appointment details:\nDate: ${updatedAppointment.date}\nTime: ${updatedAppointment.time}\nTreatment: ${updatedAppointment.treatment}`;

  emailService.sendEmail(patient.Email, 'Appointment Update', emailContent);
  emailService.sendEmail(specialist.Email, 'Appointment Update', emailContent);

  return { status: 'success', message: 'Appointment updated successfully' };
}

module.exports = updateAppointment;
