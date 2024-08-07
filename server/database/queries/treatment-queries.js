"use strict";
const doQuery = require("../query");
/**
 * This method fetches all treatments from the Treatments table
 * @returns the treatments
 */
async function getTreatments() {
  try {
    const treatmentSQL = `SELECT * FROM Treatments`;
    const result = await doQuery(treatmentSQL);
    console.log("Fetched treatments from database: ", result);
    return result;
  } catch (error) {
    console.error("Error fetching treatments: ", error);
    throw error;
  }
}

module.exports = { getTreatments };