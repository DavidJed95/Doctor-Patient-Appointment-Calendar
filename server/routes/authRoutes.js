`'use strict';`;
const express = require('express');
const registrationController = require('../controllers/registrationController');
const loginController = require('../controllers/loginController');
const updateUserProfileController = require('../controllers/updateUserProfileController');
const passwordResetController = require('../controllers/passwordResetController');

const router = express.Router();

// Connect the controllers to their respective routes
router.post('/register', registrationController.register);
router.post('/login', loginController.login);
router.post('/password-reset', async (req, res) => {
  const { id } = req.body;

  // Initiate the password reset process
  const result = await passwordResetController.forgotPassword(id);

  if (result.status === 'failure' && result.message === 'User not found') {
    // User does not exist, redirect to registration page
    setTimeout(() => {
      res.send("User does not exist. Please register first.");
      // Redirection to registration page after 3 seconds
      setTimeout(() => res.redirect('/register'), 3000);
    });
  } else {
    // Display success message and redirect to login page
    setTimeout(() => {
      res.send(result.message);
      // Redirection to login page after 5 seconds
      setTimeout(() => res.redirect('/login'), 5000);
    });
  }
});

router.put('/profile/update', updateUserProfileController.updateProfile);

router.get('/', (req, res) => {
  res.send('login');
});

router.get('/register', (req, res) => {
  res.send('registration');
});

router.get('/register/success', (req, res) => {
  // Display success message and redirect to login page
  setTimeout(() => {
    res.send('Successfully Registered!. Please Login to continue');
    // Redirection to login page after 5 seconds
    setTimeout(() => res.redirect('/login'), 5000);
  });
});

router.get('/login', (req, res) => {
  res.send('login');
});

router.get('/login/failure', (req, res) => {
  // Display failure message and redirect back to login page
  setTimeout(() => {
    res.send('Login failed. Please try again.');
    // Redirect back to login page after 3 seconds
    setTimeout(() => {
      res.redirect('/login');
    }, 3000);
  }, 2000);
});

router.get('/profile', (req, res) => {
  res.send('profile');
});

router.get('/profile/update', (req, res) => {
  // Display success message and redirect back to profile page
  setTimeout(() => {
    res.send('Profile update successfully!');
    // Redirect back to profile page after 3 seconds
    setTimeout(() => {
      res.redirect('/profile');
    }, 3000);
  }, 2000);
});

router.get('/appointment', (req, res) => {
  res.send('appointment');
});

router.get('/appointment/success', (req, res) => {
  // Display success message and redirect to appointment page
  setTimeout(() => {
    res.send('Appointment created successfully.');
    // Redirect to appointment page after 3 seconds
    setTimeout(() => {
      res.redirect('/appointment');
    }, 3000);
  }, 2000);
});

router.get('/appointment/failure', (req, res) => {
  // Display failure message and redirect back to appointment page
  setTimeout(() => {
    res.send('Failed to create appointment. Please try again.');
    // Redirect back to appointment page after 3 seconds
    setTimeout(() => {
      res.redirect('/appointment');
    }, 3000);
  }, 2000);
});

// Include the appointment routes
// router.use('/appointments', require('./appointmentRoutes'));

// Include the report routes
// router.use('/reports', require('./reportRoutes'));
module.exports = router;

