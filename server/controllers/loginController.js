'use strict';
const { login } = require('../database/queries/all-queries');
const { generateLoginToken } = require('../services/tokenService');
exports.login = async (req, res, next) => {
  const userInput= req.body;
  console.log(userInput)
  
if (!userInput.id && !userInput.password) {
  return res.status(401).json({
    message: 'You must enter both id and password to login',
  });
}

if (!userInput.id) {
  return res.status(401).json({
    message:
      'You forgot to enter your user id correctly as when you registered',
  });
}

if (!userInput.password) {
  return res.status(401).json({
    message:
      'You forgot to enter your user password correctly as when you registered',
  });
}
  try {
    

    const result = await login(userInput);
    console.log(`result is: ${result}`);

    if (result.status === 'success') {
      // Check if the user's email is verified
      if (result.user.isUserVerified === 0) {
        return res.status(401).json({
          message: 'Email not verified. Please verify your email first.',
          redirectTo: '/',
        });
      }

      const user = result.user;
      const loginToken = generateLoginToken(user);

      //  Set session variables
      req.session.isLoggedIn = true;
      req.session.user = {
        ID: user.ID,
        UserType: user.UserType,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Mobile: user.Mobile,
        Email: user.Email,
        Languages: user.Languages,
      };
      req.session.loginToken = loginToken
      // Login successful, send a response with the user information
      const greeting = `Welcome ${
        user.UserType === 'Medical Specialist' ? 'Doctor ' : ''
      }${user.FirstName} ${user.LastName}`;
      console.log(`greeting: ${greeting}`);
      return res
        .status(200)
        .json({
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
    next(error);
  }
};
