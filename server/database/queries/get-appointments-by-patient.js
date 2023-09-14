'use strict';
const doQuery = require('../query');

/**
 * Get appointments for a specific patient.
 * @param {*} patientId - ID of the patient
 * @returns { status, message, appointments }
 */
async function getAppointmentsByPatient(patientId) {
  const selectSql = `SELECT 
    U.FirstName AS userFirstName, 
    U.LastName AS userLastName,
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
    Users U ON A.PatientID = U.ID
JOIN 
    MedicalSpecialists MS ON A.MedicalSpecialistID = MS.ID
JOIN 
    Users MSU ON MS.ID = MSU.ID
LEFT JOIN 
    Treatments T ON A.TreatmentID = T.TreatmentID
WHERE 
    A.PatientID = ?`;
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
