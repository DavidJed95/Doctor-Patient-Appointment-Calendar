"use strict";
const doQuery = require("../query");

/**
 * Get appointments for a specific patient.
 * @param {*} patientID - ID of the patient
 * @returns { status, message, appointments }
 */
async function getAppointmentsByPatient(patientID) {
  console.log("getAppointmentsByPatient ");
  const selectSql = `SELECT 
    A.AppointmentID,
    U.FirstName AS userFirstName, 
    U.LastName AS userLastName,
    MSU.FirstName AS specialistFirstName,
    MSU.LastName AS specialistLastName,
    MS.Specialization,
    A.StartTime,
    A.EndTime,
    A.Date,
    T.TreatmentName,
    T.TreatmentType,
    A.MedicalSpecialistID
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
    A.PatientID = ?
    AND A.Date >= CURDATE()`;
  const appointments = await doQuery(selectSql, [patientID]);

  if (appointments.length === 0) {
    return {
      status: "no-data",
      message: "No appointments found for the patient.",
      appointments: [],
    };
  }

  return {
    status: "success",
    message: "Appointments fetched successfully",
    appointments: appointments,
  };
}

module.exports = getAppointmentsByPatient;
