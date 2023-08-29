'use strict';

const {
  getDailyReportByMedicalSpecialist,
} = require('../database/queries/all-queries');

/**
 * Get daily report of patients for a specific medical specialist within a date range.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
async function getDailyReportByMedicalSpecialistController(req, res, next) {
  const { medicalSpecialistId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const result = await getDailyReportByMedicalSpecialist(
      medicalSpecialistId,
      startDate,
      endDate,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = getDailyReportByMedicalSpecialistController;
