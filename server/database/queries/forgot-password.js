'use strict';
const doQuery = require('../query');
const getUserByID = require('./get-user-by-id');
const tokenService = require('../../services/tokenService');
const emailService = require('../../services/emailService');

/**
 * Initiate the password reset process for a user.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @param {*} id - User ID
 * @returns { status, message }
 */
async function forgotPassword(req, res, id) {
  console.log(req.body.params.id);
  console.log('id = ' + id);
  let user;

  // Check if the provided ID is an email
  const isEmail = id.includes('@');

  if (isEmail) {
    // Get the user by Email
    const getUserByEmailQuery = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await doQuery(getUserByEmailQuery, [id]);
    user = rows[0];
  } else {
    // Get the user by ID
    user = await getUserByID(id);
  }

  if (!user) {
    return { status: 'failure', message: 'User not found' };
  }

  // Generate a password reset token
  const resetToken = tokenService.generateEmailVerificationToken(user);

  // Update the user model with the reset token
  const updateQuery =
    'UPDATE users SET EmailVerificationToken = ? WHERE id = ?';
  await doQuery(updateQuery, [resetToken, user.id]);

  // Send the password reset email to the user
  const emailContent = `Hi ${user.firstName},\n\nYou have requested to reset your password. Please click on the following link to reset your password:\n\nReset Password: http://example.com/reset-password?token=${resetToken}\n\nIf you did not request this password reset, please ignore this email.\n\nBest regards,\nThe Team`;
  emailService.sendEmail(user.email, 'Password Reset', emailContent);

  return {
    status: 'success',
    message:
      'Password reset initiated. Check your email for further instructions.',
  };
}

module.exports = forgotPassword;
