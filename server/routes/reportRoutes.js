'use strict';
const express = require('express');
const getDailyReportsByMedicalSpecialistController = require('../controllers/getDailyReportByMedicalSpecialistController');
const getDailyReportsByPatientController = require('../controllers/getDailyReportByPatientController');

const router = express.Router();

// Connecting the controllers to the report routes
router.get(
  '/report/medical-specialist',
  getDailyReportsByMedicalSpecialistController.getDailyReportByMedicalSpecialistController,
);

router.get(
  '/report/patient',
  getDailyReportsByPatientController.getAppointmentReportByPatientController,
);

module.exports = router;
