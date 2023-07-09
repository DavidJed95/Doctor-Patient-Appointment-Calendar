'use strict';

// 1) Create a new user
const createUser = require('./create-user');

//  Get a user by their ID
const getUserByID = require('./get-user-by-id');

// 2) Login
const login = require('./login');

// 3) Forgot password
const forgotPassword = require('./forgot-password');

// 4) Update user profile
const updateUserProfile = require('./update-user-profile');

// 5) Set an appointment for a patient
const setAppointment = require('./set-appointment');

// 6) Cancel an existing appointment
const cancelAppointment = require('./cancel-appointment');

// 7) Update an existing appointment
const updateAppointment = require('./update-appointment');

// 8) Get appointments for as specific medical specialist
const getAppointmentsByMedicalSpecialist = require('./get-appointments-by-medical-specialist');

// 9) Get appointments for as specific patient
const getAppointmentsByPatient = require('./get-appointments-by-patient');

// 8.1) Get daily report of patients for a medical specialist
const getDailyReportByMedicalSpecialist = require('./get-daily-report-by-medical-specialist');

// 9.1) Get appointment report for a patient
const getAppointmentReportByPatient = require('./get-appointment-report-by-patient');

module.exports = {
  createUser,
  getUserByID,
  login,
  forgotPassword,
  updateUserProfile,
  setAppointment,
  cancelAppointment,
  updateAppointment,
  getAppointmentsByMedicalSpecialist,
  getAppointmentsByPatient,
  getDailyReportByMedicalSpecialist,
  getAppointmentReportByPatient,
};
