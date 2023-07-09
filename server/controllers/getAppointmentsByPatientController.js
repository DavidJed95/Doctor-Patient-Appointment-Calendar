'use strict';

const { getAppointmentsByPatient } = require('../database/queries/all-queries');

/**
 * Get appointments for a specific patient.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
async function getAppointmentsByPatientController(req, res) {
  const { patientId } = req.params;

  try {
    const result = await getAppointmentsByPatient(patientId);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'An error occurred while fetching appointments' });
  }
}

module.exports = getAppointmentsByPatientController;
