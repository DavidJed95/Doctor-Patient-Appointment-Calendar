`'use strict';`;
const express = require('express');
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const passwordResetController = require('../controllers/passwordResetController');
const updateUserProfileController = require('../controllers/updateUserProfileController');

const router = express.Router();

// Connect the controllers to their respective routes
router.post('/register', registrationController.register);
router.post('/login', loginController.login);
router.post('/password-reset', passwordResetController.forgotPassword);
router.put('/profile-update', updateUserProfileController.updateProfile);

// router.get('/appointment', (req, res) => {
//   res.send('appointment');
// });

// router.get('/appointment/success', (req, res) => {
//   // Display success message and redirect to appointment page
//   setTimeout(() => {
//     res.send('Appointment created successfully.');
//     // Redirect to appointment page after 3 seconds
//     setTimeout(() => {
//       res.redirect('/auth/appointment');
//     }, 3000);
//   }, 2000);
// });

// router.get('/appointment/failure', (req, res) => {
//   // Display failure message and redirect back to appointment page
//   setTimeout(() => {
//     res.send('Failed to create appointment. Please try again.');
//     // Redirect back to appointment page after 3 seconds
//     setTimeout(() => {
//       res.redirect('/auth/appointment');
//     }, 3000);
//   }, 2000);
// });

// Include the appointment routes
// router.use('/appointments', require('./appointmentRoutes'));

// Include the report routes
// router.use('/reports', require('./reportRoutes'));
module.exports = router;
