"use strict";
const { login } = require("../database/queries/all-queries");
const { generateLoginToken } = require("../services/tokenService");
exports.login = async (req, res, next) => {
  const userInput = req.body;

  if (!userInput.id && !userInput.password) {
    return res.status(401).json({
      message: "You must enter both id and password, in order to login",
    });
  }

  if (!userInput.id || !userInput.password) {
    return res.status(401).json({
      message: "Missing user id or password",
    });
  }

  try {
    const result = await login(userInput);

    if (result.status === "success") {
      // Check if the user's email is verified
      if (result.user.isUserVerified === 0) {
        return res.status(401).json({
          message: "Email not verified. Please verify your email first.",
          redirectTo: "/",
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
      req.session.loginToken = loginToken;

      return res.status(200).json({
        message: result.message,
        user: { ...req.session.user },
        redirectTo: "/home", // Redirect to the home page after successful login
      });
    } else {
      // Login failed, sending a response indicating the failure reason
      return res.status(401).json({ message: result.message, redirectTo: "/" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};
