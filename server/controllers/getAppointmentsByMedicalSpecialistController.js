'use strict';

const {
  getAppointmentsByMedicalSpecialist,
} = require('../database/queries/all-queries');

/**
 * Get appointments for a specific medical specialist.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
async function getAppointmentsByMedicalSpecialistController(req, res, next) {
  const { medicalSpecialistId } = req.params;

  try {
    const result = await getAppointmentsByMedicalSpecialist(
      medicalSpecialistId,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
}

module.exports = getAppointmentsByMedicalSpecialistController;
