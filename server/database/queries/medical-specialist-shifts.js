const doQuery = require('../query');

const { format, parseISO } = require('date-fns')

// Additional functions
function getDayOfWeekEnum(dateString) {
  const dayName = format(parseISO(dateString), 'EEEE'); // 'Monday', 'Tuesday', ...
  return dayName
}

async function createShift(shift) {
  try {
    const dayOfWeek = getDayOfWeekEnum(shift.ShiftDate);
    const shiftSql = `INSERT INTO SpecialistHours (MedicalSpecialistID, DayOfWeek, StartTime, EndTime, Type, ShiftDate) VALUES (?, ?, ?, ?, ?, ?)`;
    const shiftDetails = [
      shift.MedicalSpecialistID,
      dayOfWeek,
      shift.StartTime,
      shift.EndTime,
      shift.Type,
      shift.ShiftDate,
    ];
    return await doQuery(shiftSql, shiftDetails);
  } catch (error) {
    console.error('Error creating shift:', error);
    return { error: 'Error creating shift.' };
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
    return { error: 'Error updating shift.' };
  }
}

async function deleteShift(shiftID) {
  try {
    const sql = `DELETE FROM SpecialistHours WHERE SpecialistHourID=?`;
    return await doQuery(sql, [shiftID]);
  } catch (error) {
    console.error('Error deleting shift:', error);
    return { error: 'Error deleting shift.' };
  }
}

async function getShiftsForSpecialist(medicalSpecialistID) {
  try {
    const sql = `SELECT * FROM SpecialistHours WHERE MedicalSpecialistID=?`;
    return await doQuery(sql, [medicalSpecialistID]);
  } catch (error) {
    console.error('Error fetching shifts for specialist:', error);
    return { error: 'Error fetching shifts for specialist.' };
  }
}

module.exports = {
  createShift,
  updateShift,
  deleteShift,
  getShiftsForSpecialist,
};
