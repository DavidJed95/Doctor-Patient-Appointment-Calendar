'use strict';
const doQuery = require('../query');

/**
 * Get appointments for a specific medical specialist.
 * @param {*} medicalSpecialistId - ID of the medical specialist
 * @returns { status, message, appointments }
 */
async function getAppointmentsByMedicalSpecialist(medicalSpecialistId) {
  const selectSql = 'SELECT * FROM Appointments WHERE MedicalSpecialistID = ?';
  const appointments = await doQuery(selectSql, [medicalSpecialistId]);

  if (appointments.length === 0) {
    return {
      status: 'success',
      message: 'No appointments found for the medical specialist',
      appointments: [],
    };
  }

  return {
    status: 'success',
    message: 'Appointments fetched successfully',
    appointments,
  };
}

module.exports = getAppointmentsByMedicalSpecialist;
