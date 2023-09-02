'use strict';
const express = require('express');
const shiftController = require('../controllers/shiftController');
const router = express.Router();

router.post('/shift', shiftController.createShift);
router.put('/shift:id', shiftController.updateShift);
router.delete('/shift:id', shiftController.deleteShift);
router.get('/shift', shiftController.getShiftsForSpecialist);
module.exports = router;
