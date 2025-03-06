"use strict";
const doQuery = require("../query");

/**
 * Create an appointment in the database
 * @param {*} appointment - The appointment details to create
 * @param {*} paymentSuccessful - a boolean indicating whether the appointment was successful
 * @returns status of the appointment creation and a feedback to the user
 */
async function setAppointment(appointment) {
  if (!appointment.isPayedFor) {
    return { status: "failure", message: "Payment failed" };
  }

  const insertAppointmentToDB = `
    INSERT INTO Appointments 
    (AppointmentID, PatientID, MedicalSpecialistID, TreatmentID, StartTime, EndTime, Date, isPayedFor) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    await doQuery(insertAppointmentToDB, [
      appointment.AppointmentID,
      appointment.PatientID,
      appointment.MedicalSpecialistID,
      appointment.TreatmentID,
      appointment.StartTime,
      appointment.EndTime,
      appointment.Date,
      appointment.isPayedFor,
    ]);
    return { status: "success", message: "Appointment created successfully" };
  } catch (error) {
    console.error("Error saving appointment to DB:", error);
    return {
      status: "failure",
      message: "Error saving appointment to database",
    };
  }
}
module.exports = setAppointment;
