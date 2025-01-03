"use strict";
const {
  setAppointment,
  getUserByID,
} = require("../database/queries/all-queries");
const createPaymentMiddleware = require("../paypal/createPaymentMiddleware");
const executePaymentMiddleware = require("../paypal/executePaymentMiddleware");
const emailService = require("../services/emailService");

exports.createAppointment = async (req, res, next) => {
  const appointmentData = req.body;

  // Start the payment process
  createPaymentMiddleware(req, res, async () => {
    try {
      const approvalUrl = req.payment.links.find(
        (link) => link.rel === "approval_url"
      ).href;
      res.json({ approvalUrl,appointmentData });
    } catch (error) {
      next(error);
    }
  });
};

exports.executePayment = async (req, res, next) => {
  executePaymentMiddleware(req, res, async () => {
    try {
      if (req.executedPayment.state === "approved") {
        const appointmentData = req.body;
        const captureId = req.captureId;
        const result = await setAppointment({ ...appointmentData, AppointmentID: captureId }, true);

        if (result.status === "success") {
          const patient = await getUserByID(appointmentData.PatientID);
          const specialist = await getUserByID(
            appointmentData.MedicalSpecialistID
          );

          // Send email notifications to the patient and medical specialist
          emailService.sendEmail(
            patient.Email,
            "Appointment Creation Confirmation",
            `<p>Appointment details:\nDate: ${appointmentData.Date}\nTime: ${appointmentData.StartTime}-${appointmentData.EndTime}\nTreatment id: ${appointmentData.TreatmentID}</p>
            <p>Best regards,<br>Doctor Patient Appointment Calendar</p>`
          );

          emailService.sendEmail(
            specialist.Email,
            "Appointment Creation Confirmation",
            `<p>Appointment details:\nDate: ${appointmentData.Date}\nTime: ${appointmentData.StartTime}-${appointmentData.EndTime}\nTreatment id: ${appointmentData.TreatmentID}</p>
            <p>Best regards,<br>Doctor Patient Appointment Calendar</p>`
          );

          res.status(200).json({ message: "Appointment created successfully" });
        } else {
          res.status(400).json({ message: result.message });
        }
      } else {
        res
          .status(400)
          .json({ message: "Payment execution failed. Please try again" });
      }
    } catch (error) {
      next(error);
    }
  });
};
