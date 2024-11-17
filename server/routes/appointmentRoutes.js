"use strict";
const express = require("express");
const createAppointmentController = require("../controllers/createAppointmentController");
const cancelAppointmentController = require("../controllers/cancelAppointmentController");
const updateAppointmentController = require("../controllers/updateAppointmentController");
// const getAppointmentsByMedicalSpecialistController = require('../controllers/getAppointmentsByMedicalSpecialistController');
const getAppointmentsByPatientController = require("../controllers/getAppointmentsByPatientController");
const treatmentController = require("../controllers/treatmentController");
const {
  getAvailableSpecialists,
  getShiftsForSpecialist,
} = require("../controllers/shiftController");
const router = express.Router();

router.post(
  "/create-appointment",
  createAppointmentController.createAppointment
);
router.post("/execute-payment", createAppointmentController.executePayment);
router.get('/refund/:AppointmentID', cancelAppointmentController.cancelAppointment)
router.put(
  "/update-appointment/:id",
  updateAppointmentController.updateAppointments
);
router.delete("/:id", cancelAppointmentController.cancelAppointment);
router.get("/", getAppointmentsByPatientController);
router.get("/treatments", treatmentController.getTreatments);
// router.get("/shifts", getShiftsForSpecialist); // TODO: in appointmentAPI the path for this starts with http://localhost:8000/appointment/shifts/... which is http://BASE_URL/...
router.get("/available-specialists", getAvailableSpecialists);

module.exports = router;
