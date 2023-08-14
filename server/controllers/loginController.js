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
      // Check if the user's email is verified
      if (result.user.isUserVerified === 0) {
        return res.status(401).json({
          message: 'Email not verified. Please verify your email first.',
          redirectTo: '/',
        });
      }

      //  Set session variables
      req.session.isLoggedIn = true;
      req.session.user = {
        ID: result.result.user.ID,
        UserType: result.user.UserType,
        FirstName: result.user.FirstName,
        LastName: result.user.LastName,
        Mobile: result.user.Mobile,
      };

      // Login successful, send a response with the user information
      const greeting = `Welcome ${
        UserType === 'Medical Specialist' ? 'Doctor' : ''
      }${FirstName} ${LastName}`;
      console.log(`greeting: ${greeting}`);
      return res.status(200).json({
        message: 'Login successful',
        user: { ...req.session.user },
        greeting,
        redirectTo: '/home', // Redirect to the home page after successful login
      });
    } else {
      // Login failed, sending a response indicating the failure reason
      return res.status(401).json({ message: result.message, redirectTo: '/' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Entered wrong login credentials. Please try again',
      redirectTo: '/',
    });
  }
};
