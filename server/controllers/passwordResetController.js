'use strict';
const { forgotPassword } = require('../database/queries/all-queries');
const tokenService = require('../services/tokenService');
const emailService = require('..//services/emailService');

exports.forgotPassword = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  try {
    const result = await forgotPassword(req, res, id);

    if (result.status === 'success') {
      // Generate a password reset token
      const resetToken = tokenService.generateSessionToken(user);

      // Update the user model with the reset token
      const updateQuery =
        'UPDATE users SET EmailVerificationToken = ? WHERE id = ?';
      await doQuery(updateQuery, [resetToken, user.id]);

      // Send the password reset email to the user
      const emailContent = `<p>Hi ${result.user.LastName} ${result.user.FirstName},</p><p>You have requested to reset your password.</p><p>Please click on the following link to reset your password:</p>
      <p>Reset Password: http://localhost:3000/reset-password?token=${resetToken}</p>
      <p>If you did not request this password reset, please ignore this email.</p>
      <p>Best regards,<br>The Team</p>`;

      await emailService.sendEmail(user.email, 'Password Reset', emailContent);

      // Password reset initiated successfully, send the query message to the user
      return res.status(200).json({ message: result.message });
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
