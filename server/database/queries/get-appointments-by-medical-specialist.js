'use strict';
const doQuery = require('../query');

/**
 * Get appointments for a specific medical specialist.
 * @param {*} medicalSpecialistId - ID of the medical specialist
 * @returns { status, message, appointments }
 */
async function getAppointmentsByMedicalSpecialist(medicalSpecialistId) {
  const selectSql = `SELECT 
    P.FirstName AS patientFirstName, 
    P.LastName AS patientLastName,
    MSU.FirstName AS specialistFirstName,
    MSU.LastName AS specialistLastName,
    MS.Specialization,
    A.StartTime,
    A.EndingTime,
    A.Date,
    T.TreatmentName,
    T.TreatmentType
FROM 
    Appointments A
JOIN 
    Users P ON A.PatientID = P.ID
JOIN 
    MedicalSpecialists MS ON A.MedicalSpecialistID = MS.ID
JOIN 
    Users MSU ON MS.ID = MSU.ID
LEFT JOIN 
    Treatments T ON A.TreatmentID = T.TreatmentID
WHERE 
    A.MedicalSpecialistID = ?`;
  const appointments = await doQuery(selectSql, [medicalSpecialistId]);

  if (appointments.length === 0) {
    return {
      status: 'no-data',
      message: 'No appointments found for the medical specialist.',
      appointments: [],
    };
  }

  return {
    status: 'success',
    message: 'Appointments fetched successfully',
    appointments: appointments,
  };
}

module.exports = getAppointmentsByMedicalSpecialist;
