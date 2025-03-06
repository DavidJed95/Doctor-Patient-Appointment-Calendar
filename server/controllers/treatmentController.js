"use strict";

const { getTreatments } = require('../database/queries/treatment-queries');
/**
 * This method fetches a treatments from the Treatments table
 * @param {*} req - the request for treatments
 * @param {*} res - response with treatments
 * @param {*} next - passes down the log of failed request to fetch treatments
 */
exports.getTreatments = async (req, res, next) => {
  try {
    const treatments = await getTreatments();
    return res.status(200).json(treatments);
  } catch (error) {
    next(error)
    res.status(500).json({ message: "Error fetching treatment. Please try again." });
  }
};