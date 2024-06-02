'use strict'
const doQuery = require('../query');

/**
 * This method fetches a treatments from the Treatments table
 * @returns the treatment by the given treatmentID
 */
async function getTreatments() {
    try {
      const treatmentSQL = `SELECT * FROM Treatments`;
      const result = await doQuery(treatmentSQL);
      console.log(`Fetched treatment by id from database in the server query are of type: ${typeof result}.
      and this is the treatment: ${result}`);
      return result;
    } catch (error) {
      console.error('Error fetching treatment: ', error);
      
    }
}

module.exports = { getTreatments };