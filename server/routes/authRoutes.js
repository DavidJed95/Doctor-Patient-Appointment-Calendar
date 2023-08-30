'use strict';
const express = require('express');
const registrationController = require('../controllers/registrationController');
const loginController = require('../controllers/loginController');
const passwordResetController = require('../controllers/passwordResetController');
const updateUserProfileController = require('../controllers/updateUserProfileController');

const router = express.Router();

// Connect the controllers to their respective routes
router.post('/register', registrationController.register);
router.get('/verify-email/:token', registrationController.verifyEmail);
router.post('/login', loginController.login);
router.post('/password-reset', passwordResetController.forgotPassword);
router.put('/reset-password/:token', passwordResetController.resetPassword);
router.put('/profile-update', updateUserProfileController.updateProfile);

router.get('/check-login', (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.status(403).json({ isLoggedIn: false });
  }
});

router.post('/logout', (req, res, next) => {
  try {
    req.session.destroy(); // Clear session data
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.status(200).json({ message: 'See you again soon' });
  } catch (error) {
    next(error);
  }
});

router.get('*', (req, res) => {
  res.status(404).redirect('*');
});
module.exports = router;
