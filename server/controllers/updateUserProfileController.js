'use strict';
const { updateUserProfile } = require('../database/queries/all-queries');
const emailService = require('../services/emailService');

exports.updateProfile = async (req, res, next) => {
  const updatedUser = req.body;

  // Check if user provided any updates (exclude ID)
  const providedUpdates = Object.keys(updatedUser).filter(
    key =>
      key !== 'ID' &&
      typeof updatedUser[key] === 'string' &&
      updatedUser[key].trim() !== '',
  );

  if (providedUpdates.length === 0) {
    return res.status(400).json({
      message: 'Please provide at least one field to update',
      redirectTo: '/profile-update',
    });
  }

  try {
    const result = await updateUserProfile(updatedUser);

    if (result.status === 'success') {
      // Profile update successful, you send a email and response indicating success
      // Send email verification email to the user
      const emailContent = `<p>Hi ${result.user.FirstName} ${result.user.LastName},</p>
      <p>You have updated your user profile successfully.</p>
      <p>Best regards,<br>The Team</p>`;
      await emailService.sendEmail(
        result.user.Email,
        'Updated User Profile',
        emailContent,
      );

      return res
        .status(200)
        .json({ message: result.message, user: result.user });
    } else {
      return res
        .status(400)
        .json({ message: result.message, redirectTo: '/home' });
    }
  } catch (error) {
    next(error);
  }
};
