'use strict';
const { updateUserProfile } = require('../database/queries/all-queries');
const emailService = require('../services/emailService');

exports.updateProfile = async (req, res, next) => {
  const updatedUser = req.body;
  console.log(updatedUser);
  try {
    const result = await updateUserProfile(updatedUser);

    if (result.status === 'success') {
      // Profile update successful, you send a email and response indicating success
      console.log('Email is: ', result.user.Email);
      // Send email verification email to the user
      const emailContent = `<p>Hi ${result.user.FirstName} ${result.user.LastName},</p>
      <p>You have updated your user profile successfully.</p>
      <p>Best regards,<br>The Team</p>`;
      console.log(emailContent);
      await emailService.sendEmail(
        result.user.Email,
        'Updated User Profile',
        emailContent,
      );

      return res
        .status(200)
        .json({ message: result.message, user: result.user });
    } else {
      // Profile update failed, you can send a response indicating the failure reason
      return res
        .status(400)
        .json({ message: result.message, redirectTo: '/home' });
    }
  } catch (error) {
    next(error);
  }
};
