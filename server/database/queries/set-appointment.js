'use strict';
const doQuery = require('../query');

/**
 * Create an appointment in the database
 * @param {*} appointment - The appointment details to create
 * @param {*} paymentSuccessful - a boolean indicating whether the appointment was successful
 * @returns status of the appointment creation and a feedback to the user
 */
async function setAppointment(appointment, paymentSuccessful = false) {
  const {
    appointmentId,
    patientId,
    medicalSpecialistId,
    treatmentId,
    startTime,
    endTime,
    date,
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
    paymentSuccessful,
  ]);

  return { status: 'success', message: 'Appointment created successfully' };
}

module.exports = setAppointment;