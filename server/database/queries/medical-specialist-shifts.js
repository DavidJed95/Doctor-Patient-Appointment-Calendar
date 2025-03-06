"use strict";
const doQuery = require("../query");

const { format, parseISO } = require("date-fns");

// Additional functions
function getDayOfWeek(dateString) {
  const dayName = format(parseISO(dateString), "EEEE"); // 'Monday', 'Tuesday', ...
  return dayName;
}
/**
 * Method creates a new shift
 * @param {*} shift - shift parameter which is created
 * @returns
 */
async function createShift(shift) {
  try {
    const dayOfWeek = getDayOfWeek(shift.ShiftDate);
    const shiftSql = `INSERT INTO SpecialistHours (MedicalSpecialistID, DayOfWeek, StartTime, EndTime, Type, ShiftDate) VALUES (?, ?, ?, ?, ?, ?)`;
    const shiftDetails = [
      shift.MedicalSpecialistID,
      dayOfWeek,
      shift.StartTime,
      shift.EndTime,
      shift.Type,
      shift.ShiftDate,
    ];
    const newShift = await doQuery(shiftSql, shiftDetails);
    return newShift;
  } catch (error) {
    console.error("Error creating shift:", error);
    return { error: "Error creating shift." };
  }
}

/**
 * Method updates/ modifies the shift which already exists
 * @param {*} shiftID - the id of the shift which being modified
 * @param {*} shift - the whole parameters of the shift to modify
 * @returns a modified shift
 */
async function updateShift(shiftID, shift) {
  try {
    const dayOfWeek = getDayOfWeek(shift.ShiftDate);
    const sql = `UPDATE SpecialistHours SET DayOfWeek=?, StartTime=?, EndTime=?, Type=?, ShiftDate=? WHERE SpecialistHourID=?`;
    const shiftDetails = [
      dayOfWeek,
      shift.StartTime,
      shift.EndTime,
      shift.Type,
      shift.ShiftDate,
      shiftID,
    ];
    const updatedShift = await doQuery(sql, shiftDetails);
    return updatedShift;
  } catch (error) {
    console.error("Error updating shift:", error);
    return { error: "Error updating shift." };
  }
}

/**
 * Method deletes a shift which already exists
 * @param {*} shiftID the id of the shift to delete
 */
async function deleteShift(shiftID) {
  try {
    const sql = `DELETE FROM SpecialistHours WHERE SpecialistHourID=?`;
    const result = await doQuery(sql, [shiftID]);
    return result;
  } catch (error) {
    console.error("Error deleting shift:", error);
    return { error: "Error deleting shift." };
  }
}

/**
 * Method fetches all the shifts of the medical specialist with his id
 * @param {*} medicalSpecialistID id of the specialist
 * @param {*} fromDate the date to fetch from
 * @returns all the shift of the medical specialist with his uniq ID
 */
async function getShiftsForSpecialist(medicalSpecialistID, fromDate) {
  try {
    const sql = `SELECT * FROM SpecialistHours WHERE MedicalSpecialistID=? AND ShiftDate >= ? ORDER BY ShiftDate ASC`;
    const shiftsToGet = [medicalSpecialistID, fromDate];
    const result = await doQuery(sql, shiftsToGet);
    // console.log(`Fetched events from database in the server query are of type: ${typeof result}.
    // and this is these are the shifts: ${result}`);
    return result; // This should be an array if doQuery is implemented correctly.
  } catch (error) {
    console.error("Error fetching shifts for specialist:", error);
    return { error: "Error fetching shifts for specialist." };
  }
}

// TODO: I might need medical specialist ID for this procedure
/**
 * Get available specialists
 * @returns { status, message, specialists }
 */
async function getAvailableSpecialists(treatmentName) {
  try {
    const selectSql = `
    SELECT MS.ID, U.FirstName, U.LastName, MS.Specialization, SH.ShiftDate, SH.StartTime, SH.EndTime
    FROM MedicalSpecialists MS
    JOIN Users U ON MS.ID = U.ID
    JOIN SpecialistHours SH ON MS.ID = SH.MedicalSpecialistID
    WHERE MS.Specialization = ? 
    AND SH.ShiftDate >= CURDATE()
    AND SH.Type = 'Working Hour'
    ORDER BY SH.ShiftDate ASC
  `;

    const specialists = await doQuery(selectSql, treatmentName);
    if (specialists.length === 0) {
      return {
        status: "no-data",
        message: "No available specialists found.",
        specialists: [],
      };
    }

    return {
      status: "success",
      message: "Available specialists fetched successfully",
      specialists: specialists,
    };
  } catch (error) {
    console.error("Error fetching available specialists:", error);
    return { error: "Error fetching available specialists." };
  }
}

module.exports = {
  createShift,
  updateShift,
  deleteShift,
  getShiftsForSpecialist,
  getAvailableSpecialists,
};
