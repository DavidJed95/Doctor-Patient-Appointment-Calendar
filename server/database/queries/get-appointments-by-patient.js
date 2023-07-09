'use strict';
const doQuery = require('../query');

/**
 * Get appointments for a specific patient.
 * @param {*} patientId - ID of the patient
 * @returns { status, message, appointments }
 */
async function getAppointmentsByPatient(patientId) {
  const selectSql = 'SELECT * FROM Appointments WHERE PatientID = ?';
  const appointments = await doQuery(selectSql, [patientId]);

  if (appointments.length === 0) {
    return {
      status: 'success',
      message: 'No appointments found for the patient',
      appointments: [],
    };
  }

  return {
    status: 'success',
    message: 'Appointments fetched successfully',
    appointments,
  };
}

module.exports = getAppointmentsByPatient;