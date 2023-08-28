'use strict';
const {
  forgotPassword,
  updateUserPassword,
} = require('../database/queries/all-queries');
const tokenService = require('../services/tokenService');
const emailService = require('..//services/emailService');

exports.forgotPassword = async (req, res) => {
  console.log(req.body);
  const user = req.body;

  try {
    console.log('Before calling forgotPassword');
    const result = await forgotPassword(user);
    console.log('After calling forgotPassword', result);

    if (result.status === 'success') {
      // Generate a password reset token
      const resetToken = tokenService.generatePasswordResetToken(result.user);

      // Send the password reset email to the user
      const emailContent = `<p>Hi ${result.user.LastName} ${result.user.FirstName},</p><p>You have requested to reset your password.</p><p>Please click on the following link to reset your password:</p>
      <p><a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a></p>
      <p>If you did not request this password reset, please ignore this email.</p>
      <p>Best regards,<br>The Team</p>`;

      await emailService.sendEmail(user.email, 'Password Reset', emailContent);

      // Password reset initiated successfully, send the query message to the user
      return res.status(200).json({ message: result.message, redirectTo: '/' });
    } else if (result.status === 'failure') {
      // User not found, send the query message to the user
      return res.status(404).json({ message: result.message });
    } else {
      // Handle other possible query statuses
      return res
        .status(400)
        .json({ message: 'An error occurred during password reset' });
    }
  } catch (error) {
    console.error(error);
    // Handle any other errors that occurred during the password reset process
    return res
      .status(500)
      .json({ message: 'An error occurred during password reset' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decodedToken = tokenService.verifyPasswordResetToken(token);

    console.log('Decoded Token:', decodedToken);

    if (decodedToken && decodedToken.id && !isNaN(decodedToken.id)) {
      await updateUserPassword(Number(decodedToken.id), newPassword);
      return res
        .status(200)
        .json({ message: 'Password successfully updated!', redirectTo: '/' });
    } else {
      return res.status(400).json({
        message:
          'Invalid or expired token.\n\nPlease try resetting password again.',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error updating password!' });
  }
};
