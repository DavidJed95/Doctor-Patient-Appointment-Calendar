'use strict';
const doQuery = require('../query');
const sendCancellationEmail  = require('../../services/emailService');

/**
 * Cancel an existing appointment.
 * @param {*} appointmentId - ID of the appointment to be canceled
 * @returns { status, message }
 */
async function cancelAppointment(appointmentId) {
  // Check if the appointment exists
  const appointmentCancelQuery =
    'SELECT * FROM appointments WHERE appointmentId = ?';
  const [appointment] = await doQuery(appointmentCancelQuery, [appointmentId]);

  if (!appointment) {
    return { status: 'failure', message: 'Appointment not found' };
  }

  // Check if the appointment can be canceled (at least one day before the appointment)
  const today = new Date();
  const appointmentDate = new Date(appointment.date);
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours
  const differenceInDays = Math.floor(
    (appointmentDate - today) / oneDayInMilliseconds,
  );

  if (differenceInDays < 1) {
    return {
      status: 'failure',
      message: 'Appointment cannot be canceled less than one day before',
    };
  }

  // Fetch the user details of the patient and medical specialist
  const patient = await getUserByID(appointment.PatientId);
  const specialist = await getUserByID(appointment.MedicalSpecialistId);

  // Update the necessary fields to indicate cancellation (e.g., isCanceled flag or canceledDate field)
  const updateQuery =
    'UPDATE appointments SET isCanceled = ? WHERE appointmentId = ?';
  await doQuery(updateQuery, [true, appointmentId]);

  // Send cancellation emails to the patient and medical specialist
  sendCancellationEmail.sendEmail(
    patient.Email,
    'Appointment Cancellation',
    appointment,
  );
  sendCancellationEmail.sendEmail(
    specialist.Email,
    'Appointment Cancellation',
    appointment,
  );

  return { status: 'success', message: 'Appointment canceled successfully' };
}

module.exports = cancelAppointment;