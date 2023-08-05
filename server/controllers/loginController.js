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
      const {userType, firstName, lastName} = result.user
      console.log(`userType: ${userType}
      firstName: ${firstName}
      lastName: ${lastName}`);

      const greeting = `Welcome ${userType === 'Medical Specialist' && 'Doctor'} ${firstName} ${lastName}`;
      return res.status(200).json({
        message: 'Login successful',
        user: { userType, firstName, lastName },
        greeting,
        redirectTo: '/home', // Redirect to the home page after successful login
      });
    } else {
      // Login failed, you can send a response indicating the failure reason
      return res.status(401).json({ message: result.message });
    }
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ message: 'To login you must confirm your email after registration' });
  }
};
