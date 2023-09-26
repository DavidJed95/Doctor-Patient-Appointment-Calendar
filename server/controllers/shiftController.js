'use strict';
const {
  createShift,
  updateShift,
  deleteShift,
  getShiftsForSpecialist,
} = require('../database/queries/all-queries');

/**
 * This method creates a new shift for the Medical Specialist
 * @param {*} req -  request of the Medical Specialist
 * @param {*} res - response back to the Medical Specialist
 * @param {*} next - moves the error to the errorHandler if there is one
 */
exports.createShift = async (req, res, next) => {
  try {
    const shifts = Array.isArray(req.body) ? req.body : [req.body]; // Ensure that shifts is an array
    for (let shift of shifts) {
      await createShift(shift);
    }
    res.status(200).json({ message: 'Shifts created successfully.' });
  } catch (error) {
    next(error);
  }
};
/**
 * This method updates shift for the Medical Specialist
 * @param {*} req -  request of the Medical Specialist
 * @param {*} res - response back to the Medical Specialist
 * @param {*} next - moves the error to the errorHandler if there is one
 */
exports.updateShift = async (req, res, next) => {
  try {
    const shiftID = req.params.id;
    const shift = req.body;
    const result = await updateShift(shiftID, shift);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(200).json({ message: 'Shift updated successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * This method deletes shift for the Medical Specialist
 * @param {*} req -  request of the Medical Specialist
 * @param {*} res - response back to the Medical Specialist
 * @param {*} next - moves the error to the errorHandler if there is one
 */
exports.deleteShift = async (req, res, next) => {
  try {
    const shiftID = req.params.id;
    const result = await deleteShift(shiftID);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * This method retrieves all shifts for a specific Medical Specialist
 * @param {*} req -  request of the Medical Specialist
 * @param {*} res - response back to the Medical Specialist
 * @param {*} next - moves the error to the errorHandler if there is one
 */
exports.getShiftsForSpecialist = async (req, res, next) => {
  try {
    const medicalSpecialistID = req.query.medicalSpecialistID;
    if (!medicalSpecialistID) {
      return res.status(400).json({ message: 'Medical Specialist ID is required.' });
    }
    const shifts = await getShiftsForSpecialist(medicalSpecialistID);
    res.status(200).json(shifts);
  } catch (error) {
    next(error);
  }
};
