'use strict';

const {
  getAppointmentReportByPatient,
} = require('../database/queries/all-queries');

/**
 * Get appointment report for a specific patient within a date range.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
async function getAppointmentReportByPatientController(req, res, next) {
  const { patientId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const result = await getAppointmentReportByPatient(
      patientId,
      startDate,
      endDate,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = getAppointmentReportByPatientController;
