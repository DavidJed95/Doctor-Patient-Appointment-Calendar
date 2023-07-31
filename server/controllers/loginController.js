'use strict';
const { login } = require('../database/queries/all-queries');

exports.login = async (req, res) => {
  console.log(req.body);
  const { id, password } = req.body;

  try {
    const result = await login(id, password);

    if (result.status === 'success') {
      // Login successful, you can send a response with the user information
      return res.status(200).json({
        message: 'Login successful',
        user: result.user,
        redirectTo: '/home', // Redirect to the home page after successful login
      });
    } else {
      // Login failed, you can send a response indicating the failure reason
      return res.status(401).json({ message: result.message });
    }
  } catch (error) {
    console.error(error);
    // Handle any other errors that occurred during login
    return res.status(500).json({ message: 'To login you must confirm your email after registration' });
  }
};
