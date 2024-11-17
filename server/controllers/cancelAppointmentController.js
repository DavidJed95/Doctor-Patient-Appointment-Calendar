"use strict";

const {
  cancelAppointment,
  getUserByID,
} = require("../database/queries/all-queries");
const paypal = require("../paypal/paypal");
const emailService = require("../services/emailService");

exports.cancelAppointment = async (req, res, next) => {
  const { appointmentId, paymentId, price } = req.body;

  try {
    const result = await cancelAppointment(appointmentId);

    if (result.status === "success") {
      const refund = await paypal.sale.refund(paymentId, {
        amount: {
          total: price,
          currency: "ILS",
        },
      });

      const patient = await getUserByID(result.appointment.PatientID);
      const specialist = await getUserByID(
        result.appointment.MedicalSpecialistID
      );

      // Email content for patient
      let emailContent = `<p>Your appointment on ${result.appointment.Date} with DR. ${specialist.FirstName} ${specialist.LastName} has been canceled.
          Please check your paypal account for more information./p>
        <p>Best regards,<br>Doctor Patient Appointment Calendar</p>`;

      emailService.sendEmail(
        patient.Email,
        "Appointment Cancellation",
        emailContent
      );

      // Email content for specialist
      emailContent = `<p>An appointment on ${result.appointment.Date} with patient: ${patient.FirstName} ${patient.LastName} has been canceled.</p>
        <p>Best regards,<br>Doctor Patient Appointment Calendar</p>`;

      emailService.sendEmail(
        specialist.Email,
        "Appointment Cancellation",
        emailContent
      );

      return res
        .status(200)
        .json({ message: "Appointment canceled and refunded successfully" });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
};
