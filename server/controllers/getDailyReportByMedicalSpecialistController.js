'use strict';

const {
  getDailyReportByMedicalSpecialist,
} = require('../database/queries/all-queries');
const generatePDF = require('../utils/generatePDF');

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

    // If there's no report data, just return the result as JSON
    if (result.status === 'success' && result.report.length === 0) {
      return res.status(200).json(result);
    }

    const pdfStream = generatePDF(
      result.report,
      "Medical Specialist's Daily Schedule",
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=${medicalSpecialistId}_daily_schedule.pdf`,
    );

    pdfStream.pipe(res);

  } catch (error) {
    next(error);
  }
}

module.exports = getDailyReportByMedicalSpecialistController;
