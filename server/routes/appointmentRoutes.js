"use strict";
const express = require("express");
const createAppointmentController = require("../controllers/createAppointmentController");
const cancelAppointmentController = require("../controllers/cancelAppointmentController");
const updateAppointmentController = require("../controllers/updateAppointmentController");
// const getAppointmentsByMedicalSpecialistController = require('../controllers/getAppointmentsByMedicalSpecialistController');
const getAppointmentsByPatientController = require("../controllers/getAppointmentsByPatientController");
const treatmentController = require("../controllers/treatmentController");
const shiftController = require("../controllers/shiftController");
const router = express.Router();

router.post("/execute-payment", createAppointmentController.executePayment);
router.post(
  "/create-appointment",
  createAppointmentController.createAppointment
);
router.put(
  "/update-appointment:id",
  updateAppointmentController.updateAppointments
);
router.delete("/:id", cancelAppointmentController.cancelAppointments);
router.get("/", getAppointmentsByPatientController);
router.get("/treatments", treatmentController.getTreatments);
router.get('/available-specialists', shiftController.getAvailableSpecialists)


module.exports = router;
