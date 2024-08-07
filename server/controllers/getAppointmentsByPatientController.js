'use strict';

const {
  getAppointmentsByPatient,
} = require('../database/queries/all-queries');

/**
 * Get appointments of a specific patient with patientId.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
async function getAppointmentsByPatientController(req, res, next) {
  const { patientId } = req.params;

  try {
    const result = await getAppointmentsByPatient(patientId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = getAppointmentsByPatientController;
