'use strict'
const doQuery = require('../query');

/**
 * This method fetches a treatment from the Treatments table
 * @param {*} treatmentID - the treatment ID to be fetched
 * @returns the treatment by the given treatmentID
 */
async function getTreatmentByID(treatmentID) {
    try {
      const treatmentSQL = `SELECT * FROM Treatments WHERE TreatmentID=?`;
      const result = await doQuery(treatmentSQL, [treatmentID]);
      console.log(`Fetched treatment by id from database in the server query are of type: ${typeof result}.
      and this is the treatment: ${result}`);
      return result;
    } catch (error) {
      console.error('Error fetching treatment: ', error);
      
    }
}

module.exports = { getTreatmentByID };