'use strict';
const express = require('express');
const shiftController = require('../controllers/shiftController');
const router = express.Router();

router.post('/', shiftController.createShift);
router.put('/:id', shiftController.updateShift);
router.delete('/:id', shiftController.deleteShift);
router.get('/', shiftController.getShiftsForSpecialist);
// router.get('/specialist-shifts', shiftController.getShiftsForSpecialist);
module.exports = router;
