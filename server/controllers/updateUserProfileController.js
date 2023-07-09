'use strict';
const { updateUserProfile } = require('../database/queries/all-queries');

exports.updateProfile = async (req, res) => {
  const userId = req.params.id; // Assuming the user ID is passed as a parameter
  const updates = req.body; // Assuming the updated profile fields are sent in the request body

  try {
    const result = await updateUserProfile(userId, updates);

    if (result.status === 'success') {
      // Profile update successful, you can send a response indicating success
      return res
        .status(200)
        .json({ message: 'User profile updated successfully' });
    } else {
      // Profile update failed, you can send a response indicating the failure reason
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error(error);
    // Handle any other errors that occurred during profile update
    return res
      .status(500)
      .json({ message: 'An error occurred during profile update' });
  }
};
