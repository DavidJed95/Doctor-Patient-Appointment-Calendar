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
  const selectSql = `
SELECT 
  Users.FirstName as userFirstName, 
  Users.LastName as userLastName, 
  Users.ID as userID,
  MedicalSpecialists.FirstName as specialistFirstName,
  MedicalSpecialists.LastName as specialistLastName,
  MedicalSpecialists.Specialization,
  Appointments.StartTime,
  Appointments.EndingTime,
  Appointments.Date,
  Treatments.TreatmentName,
  Treatments.TreatmentType
FROM 
  Appointments
JOIN 
  Users ON Appointments.PatientID = Users.ID
JOIN 
  MedicalSpecialists ON Appointments.MedicalSpecialistID = MedicalSpecialists.ID
LEFT JOIN
  Treatments ON Appointments.TreatmentID = Treatments.TreatmentID
WHERE 
  Appointments.MedicalSpecialistID = ? AND Appointments.Date BETWEEN ? AND ?`;
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
