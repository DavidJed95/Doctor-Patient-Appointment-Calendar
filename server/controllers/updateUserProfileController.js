'use strict';
const { updateUserProfile } = require('../database/queries/all-queries');
const emailService = require('../services/emailService');

exports.updateProfile = async (req, res) => {
  
  const { password, firstName, lastName, email, mobile, languages } = req.body;
  const user = {
    password,
    firstName,
    lastName,
    email,
    mobile,
    languages,
  };

  try {
    const result = await updateUserProfile(user);

    if (result.status === 'success') {
      // Profile update successful, you send a email and response indicating success

      // Send email verification email to the user
      const emailContent = `<p>Hi ${updates.firstName} ${updates.lastName},</p>
      <p>You have updated your user profile successfully.</p>
      <p>Best regards,<br>The Team</p>`;

      await emailService.sendEmail(
        updates.email,
        'Updated User Profile',
        emailContent,
      );

      return res
        .status(200)
        .json({ message: 'User profile updated successfully' });
    } else {
      // Profile update failed, you can send a response indicating the failure reason
      return res
        .status(400)
        .json({ message: result.message, redirectTo: '/home' });
    }
  } catch (error) {
    console.error(error);
    // Handle any other errors that occurred during profile update
    return res
      .status(500)
      .json({ message: 'An error occurred during profile update' });
  }
};
