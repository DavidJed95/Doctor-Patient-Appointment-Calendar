const doQuery = require('../query');

async function createShift(shift) {
  try {
    const sql = `INSERT INTO SpecialistHours (MedicalSpecialistID, DayOfWeek, StartTime, EndTime, Type, ShiftDate) VALUES (?, ?, ?, ?, ?, ?)`;
    return await doQuery(sql, [
      shift.MedicalSpecialistID,
      shift.DayOfWeek,
      shift.StartTime,
      shift.EndTime,
      shift.Type,
      shift.ShiftDate,
    ]);
  } catch (error) {
    console.error('Error creating shift:', error);
    throw error;
  }
}

async function updateShift(shiftID, shift) {
  try {
    const sql = `UPDATE SpecialistHours SET DayOfWeek=?, StartTime=?, EndTime=?, Type=?, ShiftDate=? WHERE SpecialistHourID=?`;
    return await doQuery(sql, [
      shift.DayOfWeek,
      shift.StartTime,
      shift.EndTime,
      shift.Type,
      shift.ShiftDate,
      shiftID,
    ]);
  } catch (error) {
    console.error('Error updating shift:', error);
    throw error;
  }
}

async function deleteShift(shiftID) {
  try {
    const sql = `DELETE FROM SpecialistHours WHERE SpecialistHourID=?`;
    return await doQuery(sql, [shiftID]);
  } catch (error) {
    console.error('Error deleting shift:', error);
    throw error;
  }
}

async function getShiftsForSpecialist(medicalSpecialistID) {
  try {
    const sql = `SELECT * FROM SpecialistHours WHERE MedicalSpecialistID=?`;
    return await doQuery(sql, [medicalSpecialistID]);
  } catch (error) {
    console.error('Error fetching shifts for specialist:', error);
    throw error;
  }
}

module.exports = {
  createShift,
  updateShift,
  deleteShift,
  getShiftsForSpecialist,
};
