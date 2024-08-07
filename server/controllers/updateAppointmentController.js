'use strict';

const { updateAppointment, getUserByID } = require('../database/queries/all-queries');
const emailServices = require('../services/emailService')

/**
 * Update an existing appointment.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
 exports.updateAppointments = async (req, res, next) => {
  const { appointmentId, appointmentDetails } = req.body;

  try {
    const result = await updateAppointment(appointmentId, appointmentDetails);

    if (result.status === 'success') {
      // const updatedAppointment = await getUserByID()
      const patient = await getUserByID(appointmentDetails.PatientID);
      const specialist = await getUserByID(appointmentDetails.MedicalSpecialistID);

      // Patient email content
      let emailContent = `<p>Dear ${patient.FirstName +' '+patient.LastName},\n you'r updated appointment details for DR. ${specialist.FirstName +' '+specialist.LastName}:\nDate: ${appointmentDetails.Date}\nTime: ${appointmentDetails.StartTime}-${appointmentDetails.EndTime}\nTreatment: ${appointmentDetails.TreatmentID}</p>`
      emailServices.sendEmail(patient.Email, 'Appointment Update', emailContent)

      emailContent = `<p>Dear DR. ${specialist.FirstName +' '+specialist.LastName},\n you'r appointment details for patient ${patient.FirstName +' '+patient.LastName} got updated:\nDate: ${appointmentDetails.Date}\nTime: ${appointmentDetails.StartTime}-${appointmentDetails.EndTime}\nTreatment: ${appointmentDetails.TreatmentID}</p>`
      emailServices.sendEmail(specialist.Email, 'Appointment Update', emailContent)

      return res
        .status(200)
        .json({ message: result.message, appointment: result.appointment });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
}
