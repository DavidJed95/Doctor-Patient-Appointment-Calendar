'use strict';
const { forgotPassword } = require('../database/queries/all-queries');

exports.forgotPassword = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  try {
    const result = await forgotPassword(req, res, id);

    if (result.status === 'success') {
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
