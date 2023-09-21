'use strict';

const { updateAppointment } = require('../database/queries/all-queries');

/**
 * Update an existing appointment.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
 exports.updateAppointments = async (req, res, next) => {
  const { appointmentId, updates } = req.body;

  try {
    const result = await updateAppointment(appointmentId, updates);

    if (result.status === 'success') {
      return res
        .status(200)
        .json({ message: 'Appointment updated successfully' });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
}


