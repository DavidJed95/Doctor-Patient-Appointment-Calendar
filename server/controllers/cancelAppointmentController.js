'use strict';

const { cancelAppointment } = require('../database/queries/all-queries');

/**
 * Cancel an existing appointment.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
async function cancelAppointmentController(req, res, next) {
  const { appointmentId } = req.body;

  try {
    const result = await cancelAppointment(appointmentId);

    if (result.status === 'success') {
      return res
        .status(200)
        .json({ message: 'Appointment canceled successfully' });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
   next(error)
  }
}

module.exports = cancelAppointmentController;
