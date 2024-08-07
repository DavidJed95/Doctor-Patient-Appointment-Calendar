'use strict';
const doQuery = require('../database/query');
const { createUser } = require('../database/queries/all-queries');
const tokenService = require('../services/tokenService');
const emailService = require('../services/emailService');
/**
 * This method registers a new user to the system
 * @param {*} req - request of the user
 * @param {*} res - response back to the user
 * @param {*} next - moves the error to the errorHandler if there is one
 * @returns
 */
exports.register = async (req, res, next) => {
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

    // Registration successful
    // Generate email verification token
    if (result.status === 'success') {
      const emailVerificationToken =
        tokenService.generateEmailVerificationToken(user);

      // Send email verification email to the user
      const emailContent = `<p>Hi ${firstName} ${lastName},</p>
      <p>Thank you for registering. Please click on the following link to verify your email:</p>
      <p><a href="http://localhost:3000/verify-email/${emailVerificationToken}">Verify Email</a></p>
      <p>Best regards,<br>Doctor Patient Appointment Calendar</p>`;

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
        .json({ message: result.message, redirectTo: '/register' });
    }
  } catch (error) {
    res.status(400).send({ status: 'failure', message: error.message });
    next(error);
  }
};

/**
 * This method decodes the received token and checks if it is the same that the user got
 * @param {*} req - request of the user
 * @param {*} res - response back to the user
 * @param {*} next - moves the error to the errorHandler if there is one
 * @returns status code of success/ failure of decoding the verification email, message and redirection path
 */
exports.verifyEmail = async (req, res, next) => {
  const emailVerificationToken = req.params.token;
  console.log('Token received: ', emailVerificationToken);
  try {
    const decodedToken = tokenService.verifyEmailVerificationToken(
      emailVerificationToken,
    );
    console.log('decoded token: ', decodedToken);
    console.log('decoded user: ', decodedToken.user);
    if (decodedToken) {
      const userId = decodedToken.id || decodedToken.ID;
      // Update user's isUserVerified status to 1 in the database
      const updateUserSql = `UPDATE users SET isUserVerified = ? WHERE ID = ?`;
      await doQuery(updateUserSql, [1, userId]);

      return res.status(200).json({
        message: 'Registration email has been verified',
        redirectTo: '/',
      });
    } else {
      return res
        .status(400)
        .json({ message: 'Invalid token or expired link.' });
    }
  } catch (error) {
    next(error);
  }
};
