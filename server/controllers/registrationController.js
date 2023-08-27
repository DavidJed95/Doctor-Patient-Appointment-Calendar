'use strict';
const createUser = require('../database/queries/create-user');
const tokenService = require('../services/tokenService');
const emailService = require('../services/emailService');

exports.register = async (req, res) => {
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
      // Generate email verification token
      const emailVerificationToken = tokenService.generateEmailVerificationToken(user);
      console.log(
        `emailVerificationToken generated in the registrationController: ${emailVerificationToken}`,
      );
      // Send email verification email to the user
      const emailContent = `<p>Hi ${firstName} ${lastName},</p>
      <p>Thank you for registering. Please click on the following link to verify your email:</p>
      <p><a href="http://localhost:3000/verify-email/${emailVerificationToken}">Verify Email</a></p>
      <p>Best regards,<br>The Team</p>`;

      await emailService.sendEmail(
        email,
        'Registration Verification Email',
        emailContent,
      );

      return res.status(200).json({
        message:
          result.message +
          '\nPlease enter your email to verify your registration',
        redirectTo: '/',
      });
    } else {
      // Registration failed
      return res
        .status(400)
        .json({ message: result.message, redirectTo: '/auth/register' });
    }
  } catch (error) {
    console.error(error);
    // Handle any other errors that occurred during registration
    return res.status(500).json({
      message: 'An error occurred during registration',
      redirectTo: '/auth/register',
    });
  }
};
