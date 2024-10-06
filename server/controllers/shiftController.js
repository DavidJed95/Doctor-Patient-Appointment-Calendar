"use strict";
const {
  createShift,
  updateShift,
  deleteShift,
  getShiftsForSpecialist,
  getAvailableSpecialists,
} = require("../database/queries/all-queries");

exports.createShift = async (req, res, next) => {
  try {
    const shifts = Array.isArray(req.body) ? req.body : [req.body];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let shift of shifts) {
      const shiftDate = new Date(shift.ShiftDate);
      shiftDate.setHours(0, 0, 0, 0);

      if (shiftDate < today) {
        return res
          .status(400)
          .json({ message: "Cannot create a shift in the past." });
      }

      await createShift(shift);
    }

    res.status(200).json({ message: "Shifts created successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating shift. Please try again." });
    next(error);
  }
};

exports.updateShift = async (req, res, next) => {
  try {
    const shiftID = req.params.id;
    const shift = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const shiftDate = new Date(shift.ShiftDate);
    shiftDate.setHours(0, 0, 0, 0);

    if (shiftDate < today) {
      return res
        .status(400)
        .json({ message: "Cannot update a shift to a past date." });
    }

    const result = await updateShift(shiftID, shift);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.status(200).json({ message: "Shift updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating shift. Please try again." });
    next(error);
  }
};

exports.deleteShift = async (req, res, next) => {
  try {
    const shiftID = req.params.id;
    const result = await deleteShift(shiftID);

    if (result.error) {
      return res
        .status(500)
        .json({ message: "Error deleting shift. Please try again" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.status(200).json({ message: "Shift deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getShiftsForSpecialist = async (req, res, next) => {
  try {
    const { medicalSpecialistID, date } = req.query;
    if (!medicalSpecialistID) {
      return res
        .status(400)
        .json({ message: "Medical Specialist ID is required." });
    }
    const today = new Date().toISOString().slice(0, 10);
    const shifts = await getShiftsForSpecialist(medicalSpecialistID, today);

    console.log(`Fetched events from server are of type: ${typeof shifts}.
    and these are the shifts: ${shifts}`);
    res.status(200).json(shifts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shifts. Please try again." });
    next(error);
  }
};

exports.getAvailableSpecialists = async (req, res, next) => {
  try {
    const result = await getAvailableSpecialists();
    if (result.status === "success") {
      return res
        .status(200)
        .json({ message: result.message, specialists: result.specialists });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching available specialists. Please try again.",
    });
    next(error);
  }
};
