"use strict";
const express = require("express");
//TODO: LATER TO ADD: const getAppointmentsByMedicalSpecialistController = require('../controllers/getAppointmentsByMedicalSpecialistController');
const {
  createOrder,
  captureOrderAndSaveAppointment,
  cancelAppointment,
  updateAppointment,
  getAppointmentsByPatient,
} = require("../controllers/appointmentController");
const treatmentController = require("../controllers/treatmentController");
const { getAvailableSpecialists } = require("../controllers/shiftController");

const router = express.Router();

router.post("/create-order", createOrder);

router.post("/capture-payment", captureOrderAndSaveAppointment);

router.delete("/cancel/:AppointmentID", cancelAppointment);

router.put(
  "/update-appointment/:AppointmentID", //TODO: TO TRY: /:id
  updateAppointment
);

// router.get("/:patientId", getAppointmentsByPatientController);
router.get("/treatments", treatmentController.getTreatments);
router.get("/available-specialists", getAvailableSpecialists);
router.get("/patient", getAppointmentsByPatient); // Get all patient appointments
module.exports = router;
