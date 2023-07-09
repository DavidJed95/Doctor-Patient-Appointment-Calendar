'use strict';
const doQuery = require('../query');
const emailService = require('../../services/emailService');
const getUserByID = require('./get-user-by-id')

/**
 * Create an appointment
 * @param {*} appointment 
 * @returns 
 */
async function setAppointment(appointment) {
  const {
    appointmentId,
    patientId,
    medicalSpecialistId,
    treatmentId,
    startTime,
    endTime,
    date,
    paymentSuccessful,
  } = appointment;

  if (!paymentSuccessful) {
    return { status: 'failure', message: 'Payment failed' };
  }

  // Create a new appointment
  const insertSql =
    'INSERT INTO Appointments (ID, PatientID, MedicalSpecialistID, TreatmentID, StartTime, EndingTime, Date, isPayedFor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  await doQuery(insertSql, [
    appointmentId,
    patientId,
    medicalSpecialistId,
    treatmentId,
    startTime,
    endTime,
    date,
    true,
  ]);

  // Fetch the newly created appointment details
  const selectSql = 'SELECT * FROM Appointments WHERE ID = ?';
  const [createdAppointment] = await doQuery(selectSql, [appointmentId]);

  // Fetch the user details of the patient and medical specialist
  const patient = await getUserByID(patientId);
  const specialist = await getUserByID(medicalSpecialistId);

  // Send email with appointment details to the user
  const emailContent = `Appointment details:\nDate: ${createdAppointment.Date}\nTime: ${createdAppointment.StartTime}-${createdAppointment.EndingTime}\nTreatment: ${createdAppointment.TreatmentID}`;

  emailService.sendEmail(
    patient.Email,
    'Appointment Confirmation',
    emailContent,
  );
  emailService.sendEmail(
    specialist.Email,
    'Appointment Confirmation',
    emailContent,
  );

  return { status: 'success', message: 'Appointment set successfully' };
}

module.exports = setAppointment;