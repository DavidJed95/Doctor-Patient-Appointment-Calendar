"use strict";

// 1) Create a new user
const createUser = require("./create-user");

//  Get a user by their ID
const getUserByID = require("./get-user-by-id");

// 2) Login
const login = require("./login");

// 3) Forgot password and Reset Password
const { forgotPassword, updateUserPassword } = require("./forgot-password");

// 4) Update user profile
const updateUserProfile = require("./update-user-profile");

// 5) Medical Specialist Shifts
const {
  createShift,
  updateShift,
  deleteShift,
  getShiftsForSpecialist,
} = require("./medical-specialist-shifts");

// Fetching Treatment details
const { getTreatmentByID } = require("./treatment-queries");

// 6) Set an appointment for a patient
const setAppointment = require("./set-appointment");

// 7) Cancel an existing appointment
const cancelAppointment = require("./cancel-appointment");

// 8) Update an existing appointment
const updateAppointment = require("./update-appointment");

// 9) Get appointments for as specific medical specialist
const getAppointmentsByMedicalSpecialist = require("./get-appointments-by-medical-specialist");

// 10) Get appointments for as specific patient
const getAppointmentsByPatient = require("./get-appointments-by-patient");

module.exports = {
  createUser,
  getUserByID,
  login,
  forgotPassword,
  updateUserPassword,
  updateUserProfile,
  createShift,
  updateShift,
  deleteShift,
  getShiftsForSpecialist,
  getTreatmentByID,
  setAppointment,
  cancelAppointment,
  updateAppointment,
  getAppointmentsByMedicalSpecialist,
  getAppointmentsByPatient,
};
