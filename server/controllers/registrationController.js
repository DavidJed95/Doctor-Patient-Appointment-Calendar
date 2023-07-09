'use strict';
const { createUser } = require('../database/queries/all-queries');

exports.register = async (req, res) => {
  console.log(req.body);
  const {
    id,
    email,
    password,
    passwordConfirm,
    firstName,
    lastName,
    mobile,
    languages,
  } = req.body;

  try {
    const user = {
      id,
      email,
      password,
      firstName,
      lastName,
      mobile,
      languages,
      creationDate: new Date(),
    };

    const result = await createUser(user);

    if (result.status === 'success') {
      // Registration successful, you can send a response indicating success
      return res.status(200).json({ message: 'User registered successfully' });
    } else {
      // Registration failed, you can send a response indicating the failure reason
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error(error);
    // Handle any other errors that occurred during registration
    return res
      .status(500)
      .json({ message: 'An error occurred during registration' });
  }
};
