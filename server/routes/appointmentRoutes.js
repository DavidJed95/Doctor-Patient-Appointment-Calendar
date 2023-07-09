'use strict';
const express = require('express');
const createAppointmentController = require('../controllers/createAppointmentController');
const cancelAppointmentController =
  require('../controllers/cancelAppointmentController').cancelAppointmentController;
const getAppointmentsByMedicalSpecialistController =
  require('../controllers/getAppointmentsByMedicalSpecialistController').getAppointmentsByMedicalSpecialistController;
const getAppointmentsByPatientController =
  require('../controllers/getAppointmentsByPatientController').getAppointmentsByPatientController;

const router = express.Router();

// Connect the controllers to the appointment routes
router.post(
  '/appointment/create',
  createAppointmentController.createAppointment,
);
router.post('/appointment/cancel', cancelAppointmentController);
router.get(
  '/appointment/medical-specialist/:medicalSpecialistId',
  getAppointmentsByMedicalSpecialistController,
);
router.get(
  '/appointment/patient/:patientId',
  getAppointmentsByPatientController,
);

module.exports = router;
