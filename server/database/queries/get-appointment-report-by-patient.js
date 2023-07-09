'use strict';
const doQuery = require('../query');

/**
 * Get appointment report for a specific patient within a date range.
 * @param {*} patientId - ID of the patient
 * @param {*} startDate - Start date of the date range
 * @param {*} endDate - End date of the date range
 * @returns { status, message, report }
 */
async function getAppointmentReportByPatient(patientId, startDate, endDate) {
  const selectSql =
    'SELECT * FROM Appointments WHERE PatientID = ? AND Date BETWEEN ? AND ?';
  const report = await doQuery(selectSql, [patientId, startDate, endDate]);

  if (report.length === 0) {
    return {
      status: 'success',
      message:
        'No appointments found for the patient within the specified date range',
      report: [],
    };
  }

  return {
    status: 'success',
    message: 'Appointment report fetched successfully',
    report,
  };
}

module.exports = getAppointmentReportByPatient;
