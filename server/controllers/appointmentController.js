"use strict";
const {
  getUserByID,
  setAppointment,
  cancelAppointment,
  updateAppointment,
  getAppointmentsByPatient: appointmentsForPatient,
} = require("../database/queries/all-queries");
const paypalServices = require("../services/paypalServices");
const emailService = require("../services/emailService");

/**
 * Create PayPal order and initiate appointment
 */
exports.createOrder = async (req, res, next) => {
  try {
    // const { amount, description } = req.body;
    const { amount } = req.body;
    console.log(
      "Amount received from client:",
      amount,
      "amount type:",
      typeof amount
    );
    // const { jsonResponse, httpStatusCode } = await paypalServices.createOrder(
    //   amount,
    //   description
    // );
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const { jsonResponse, httpStatusCode } = await paypalServices.createOrder(
      amount
    );
    console.log("Created PayPal order:", jsonResponse);
    return res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res
      .status(500)
      .json({ error: error.message || error || "Failed to initiate payment" });
    next(error);
  }
};

/**
 * Capture payment and save the appointment
 */
exports.captureOrderAndSaveAppointment = async (req, res, next) => {
  try {
    const { orderId, appointmentDetails } = req.body;
    const { jsonResponse, httpStatusCode } =
      await paypalServices.capturePayment(orderId);

    // Validating the httpStatusCode
    const statusCode = httpStatusCode || 200;
    if (statusCode < 100 || statusCode > 599) {
      console.error(`Invalid status code: ${statusCode}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const captureId = jsonResponse.purchase_units[0].payments.captures[0].id;

    appointmentDetails.AppointmentID = captureId;
    appointmentDetails.isPayedFor = true;
    console.log(
      `appointmentDetails.AppointmentID = ${appointmentDetails.AppointmentID}`
    );
    console.log(
      `Appointment Details: AppointmentID: ${appointmentDetails.AppointmentID}, Appointment Date: ${appointmentDetails.Date}, Appointment StartTime ${appointmentDetails.StartTime}, Appointment EndTime ${appointmentDetails.EndTime}`
    );
    const result = await setAppointment(appointmentDetails);

    const patient = await getUserByID(appointmentDetails.PatientID);
    const specialist = await getUserByID(
      appointmentDetails.MedicalSpecialistID
    );

    if (result.status === "success") {
      emailService.sendEmail(
        patient.Email,
        "Appointment Confirmation",
        `Your appointment on ${appointmentDetails.Date} with Dr. ${specialist.FirstName} ${specialist.LastName} is confirmed.`
      );

      emailService.sendEmail(
        specialist.Email,
        "New Appointment Scheduled",
        `You have a new appointment with ${patient.FirstName} ${patient.LastName} on ${appointmentDetails.Date}.`
      );

      return res.status(statusCode).json({
        message: result.message || "Appointment created successfully.",
        appointmentId: captureId,
      });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error(
      error.message || "Error capturing payment or saving appointment:",
      error
    );
    next(error);
  }
};

/**
 * Cancel an appointment with refund
 */
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await cancelAppointment(id);

    // return {
    //   status: "success",
    //   message: "Appointment canceled successfully",
    //   appointment,
    // };
    if (result.status === "success") {
      const { jsonResponse, httpStatusCode } =
        await paypalServices.refundPayment(orderId);

      const patient = await getUserByID(result.appointment.PatientID);
      const specialist = await getUserByID(
        result.appointment.MedicalSpecialistID
      );

      // Send Cancellation Emails
      emailService.sendEmail(
        patient.Email,
        "Appointment Cancellation",
        `Your appointment on ${result.appointment.Date} has been canceled.`
      );
      emailService.sendEmail(
        specialist.Email,
        "Appointment Cancellation",
        `An appointment with patient ${patient.FirstName} ${patient.LastName} has been canceled.`
      );

      return res.status(httpStatusCode).json({
        message:
          result.message || "Appointment canceled and refunded successfully",
        jsonResponse,
      });
    }

    res.status(400).json({ message: result.message });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ message: error.message || "Refund failed" });
    next(error);
  }
};

/**
 * Update an existing appointment.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
exports.updateAppointment = async (req, res, next) => {
  const { appointmentId, appointmentDetails } = req.body;

  try {
    const result = await updateAppointment(appointmentId, appointmentDetails);

    if (result.status === "success") {
      // const updatedAppointment = await getUserByID()
      const patient = await getUserByID(appointmentDetails.PatientID);
      const specialist = await getUserByID(
        appointmentDetails.MedicalSpecialistID
      );

      // Patient email content
      let emailContent = `<p>Dear ${
        patient.FirstName + " " + patient.LastName
      },\n you'r updated appointment details for DR. ${
        specialist.FirstName + " " + specialist.LastName
      }:\nDate: ${appointmentDetails.Date}\nTime: ${
        appointmentDetails.StartTime
      }-${appointmentDetails.EndTime}\nTreatment: ${
        appointmentDetails.TreatmentID
      }</p>`;
      emailService.sendEmail(patient.Email, "Appointment Update", emailContent);

      emailContent = `<p>Dear DR. ${
        specialist.FirstName + " " + specialist.LastName
      },\n you'r appointment details for patient ${
        patient.FirstName + " " + patient.LastName
      } got updated:\nDate: ${appointmentDetails.Date}\nTime: ${
        appointmentDetails.StartTime
      }-${appointmentDetails.EndTime}\nTreatment: ${
        appointmentDetails.TreatmentID
      }</p>`;
      emailService.sendEmail(
        specialist.Email,
        "Appointment Update",
        emailContent
      );

      return res
        .status(200)
        .json({ message: result.message, appointment: result.appointment });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get appointments of a specific patient with patientId.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
exports.getAppointmentsByPatient = async (req, res, next) => {
  const { patientID } = req.query;
  console.log(
    `patientID for getting the appointments of the patient: ${patientID}`
  );
  try {
    const result = await appointmentsForPatient(patientID);

    if (result.status === "success") {
      console.log(`Appointments: ${result}`);
      return res
        .status(200)
        .json({ appointments: result.appointments, message: result.message });
    } else if (result.status === "no-data") {
      return res
        .status(204)
        .json({ appointments: [], message: result.message });
    }
  } catch (error) {
    console.log("There was error fetching appointments:", error);
    next(error);
  }
};
