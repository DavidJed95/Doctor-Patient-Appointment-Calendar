'use strict';
const createUser = require('../database/queries/create-user');

exports.register = async (req, res) => {
  console.log(req.body.creationDate);
  const {
    userType,
    id,
    email,
    password,
    passwordConfirm,
    firstName,
    lastName,
    mobile,
    languages,
    creationDate,
    medicalStatus,
    medicalLicense,
    specialization,
  } = req.body;

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: 'The passwords do not match' });
  }

  try {
    const user = {
      userType,
      id,
      email,
      password,
      passwordConfirm,
      firstName,
      lastName,
      mobile,
      languages,
      creationDate,
      medicalStatus: userType === 'Patient' ? medicalStatus : undefined,
      medicalLicense:
        userType === 'Medical Specialist' ? medicalLicense : undefined,
      specialization:
        userType === 'Medical Specialist' ? specialization : undefined,
    };

    const result = await createUser(user);

    if (result.status === 'success') {
      // Registration successful

      res.status(200).json({
        message: 'User registered successfully',
        redirectTo: '/',
      });
    } else {
      // Registration failed
      res
        .status(400)
        .json({ message: result.message, redirectTo: '/auth/register' });
    }
  } catch (error) {
    console.error(error);
    // Handle any other errors that occurred during registration
    res.status(500).json({
      message: 'An error occurred during registration',
      redirectTo: '/auth/register',
    });
  }
};
