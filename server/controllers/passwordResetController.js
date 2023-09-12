'use strict';
const {
  forgotPassword,
  updateUserPassword,
} = require('../database/queries/all-queries');
const tokenService = require('../services/tokenService');
const emailService = require('../services/emailService');

exports.forgotPassword = async (req, res, next) => {
  console.log(req.body);
  const user = req.body;

  try {
    const result = await forgotPassword(user);

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
    console.error(error.message);
    res.status(400).send({ status: 'failure', message: error.message });
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decodedToken = tokenService.verifyPasswordResetToken(token);

    if (decodedToken) {
      await updateUserPassword(decodedToken.id, newPassword);
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
    res.status(500).json({ message: 'Error updating password!' });
    next(error);
  }
};
