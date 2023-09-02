'use strict';
const express = require('express');
const createAppointmentController = require('../controllers/createAppointmentController');
const cancelAppointmentController = require('../controllers/cancelAppointmentController');
const getAppointmentsByMedicalSpecialistController = require('../controllers/getAppointmentsByMedicalSpecialistController');
const getAppointmentsByPatientController = require('../controllers/getAppointmentsByPatientController');

const router = express.Router();

// Connect the controllers to the appointment routes
router.post(
  '/appointment/create',
  createAppointmentController.createAppointment,
);
router.post(
  '/appointment/cancel',
  cancelAppointmentController.cancelAppointmentController,
);
router.get(
  '/appointment/medical-specialist/:medicalSpecialistId',
  getAppointmentsByMedicalSpecialistController.getAppointmentsByMedicalSpecialistController,
);
router.get(
  '/appointment/patient/:patientId',
  getAppointmentsByPatientController.getAppointmentsByPatientController,
);

module.exports = router;
