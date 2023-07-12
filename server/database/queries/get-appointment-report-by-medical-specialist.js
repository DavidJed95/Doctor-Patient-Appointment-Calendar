'use strict';
const doQuery = require('../query');

/**
 * Get report of patients for a specific medical specialist within a date range.
 * @param {*} medicalSpecialistId - ID of the medical specialist
 * @param {*} startDate - Start date of the date range
 * @param {*} endDate - End date of the date range
 * @returns { status, message, report }
 */
async function getAppointmentReportByMedicalSpecialist(
  medicalSpecialistId,
  startDate,
  endDate,
) {
  const selectSql =
    'SELECT * FROM Appointments WHERE MedicalSpecialistID = ? AND Date BETWEEN ? AND ?';
  const report = await doQuery(selectSql, [
    medicalSpecialistId,
    startDate,
    endDate,
  ]);

  if (report.length === 0) {
    return {
      status: 'success',
      message:
        'No appointments found for the medical specialist within the specified date range',
      report: [],
    };
  }

  return {
    status: 'success',
    message: 'Daily report fetched successfully',
    report,
  };
}

module.exports = getAppointmentReportByMedicalSpecialist;
