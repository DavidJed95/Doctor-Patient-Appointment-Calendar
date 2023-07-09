'use strict';

const {
  getDailyReportByMedicalSpecialist,
} = require('../database/queries/all-queries');

/**
 * Get daily report of patients for a specific medical specialist within a date range.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
async function getDailyReportByMedicalSpecialistController(req, res) {
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
    console.error(error);
    return res
      .status(500)
      .json({ message: 'An error occurred while fetching the daily report' });
  }
}

module.exports = getDailyReportByMedicalSpecialistController;
