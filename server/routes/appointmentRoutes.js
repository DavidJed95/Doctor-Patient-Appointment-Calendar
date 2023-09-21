'use strict';
const express = require('express');
const createAppointmentController = require('../controllers/createAppointmentController');
const cancelAppointmentController = require('../controllers/cancelAppointmentController');
const updateAppointmentController = require('../controllers/updateAppointmentController')
// const getAppointmentsByMedicalSpecialistController = require('../controllers/getAppointmentsByMedicalSpecialistController');
// const getAppointmentsByPatientController = require('../controllers/getAppointmentsByPatientController');

const router = express.Router();


router.post('/create-appointment', createAppointmentController.createAppointment)
router.put('/update-appointment:id', updateAppointmentController.updateAppointments);
router.delete('/:id', cancelAppointmentController.cancelAppointments);
// router.get(
//   '/appointment/patient/:patientId',
//   getAppointmentsByPatientController.getAppointmentsByPatientController,
// );

module.exports = router;
