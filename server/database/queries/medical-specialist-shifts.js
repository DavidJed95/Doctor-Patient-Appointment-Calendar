const doQuery = require('../query');

async function createShift(shift) {
  const sql = `INSERT INTO SpecialistHours (MedicalSpecialistID, DayOfWeek, StartTime, EndTime, Type, ShiftDate) VALUES (?, ?, ?, ?, ?, ?)`;
  return await doQuery(sql, [
    shift.MedicalSpecialistID,
    shift.DayOfWeek,
    shift.StartTime,
    shift.EndTime,
    shift.Type,
    shift.ShiftDate,
  ]);
}

async function updateShift(shiftID, shift) {
  const sql = `UPDATE SpecialistHours SET DayOfWeek=?, StartTime=?, EndTime=?, Type=?, ShiftDate=? WHERE SpecialistHourID=?`;
  return await doQuery(sql, [
    shift.DayOfWeek,
    shift.StartTime,
    shift.EndTime,
    shift.Type,
    shift.ShiftDate,
    shiftID,
  ]);
}

async function deleteShift(shiftID) {
  const sql = `DELETE FROM SpecialistHours WHERE SpecialistHourID=?`;
  return await doQuery(sql, [shiftID]);
}

async function getShiftsForSpecialist(medicalSpecialistID) {
  const sql = `SELECT * FROM SpecialistHours WHERE MedicalSpecialistID=?`;
  return await doQuery(sql, [medicalSpecialistID]);
}

module.exports = {
  createShift,
  updateShift,
  deleteShift,
  getShiftsForSpecialist,
};
