'use strict';
const { login } = require('../database/queries/all-queries');

exports.login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = {
      id,
      password,
    };

    const result = await login(user);
    console.log(`result is: ${result}`);

    if (result.status === 'success') {
      // Login successful, send a response with the user information
      const { userType, firstName, lastName } = result.user;
      console.log(`userType: ${userType}
      firstName: ${firstName}
      lastName: ${lastName}`);

      const greeting = `Welcome ${
        userType === 'Medical Specialist' && 'Doctor'
      } ${firstName} ${lastName}`;
      return res.status(200).json({
        message: 'Login successful',
        user: { userType, firstName, lastName },
        greeting,
        redirectTo: '/home', // Redirect to the home page after successful login
      });
    } else {
      // Login failed, you can send a response indicating the failure reason
      return res
        .status(401)
        .json({ message: result.message, redirectTo: '/auth/login' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Entered wrong login credentials. Please try again',
      redirectTo: '/auth/login',
    });
  }
};
