"use strict";

const { getTreatmentByID } = require("../database/queries/all-queries");
exports.getTreatment = async (req, res, next) => {
  const { treatmentID } = req.params;
  try {
    const treatment = await getTreatmentByID(treatmentID);
    res.status(200).json(treatment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching treatment. Please try again." });
    next(error);
  }
};
