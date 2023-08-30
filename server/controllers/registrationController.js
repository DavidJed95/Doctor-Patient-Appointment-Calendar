'use strict';
const doQuery = require('../database/query');
const createUser = require('../database/queries/create-user');
const tokenService = require('../services/tokenService');
const emailService = require('../services/emailService');

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

    if (result.status === 'success') {
      // Registration successful
      // Generate email verification token
      const emailVerificationToken =
        tokenService.generateEmailVerificationToken(user);
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
        .json({ message: result.message, redirectTo: '/register' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send({ status: 'failure', message: error.message });
    next(error);
  }
};

/**
 * This method decodes the received token and checks if it is the same that the user got
 * @param {*} req - request of the user
 * @param {*} res - response back to the user
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
      console.log(decodedToken);
      console.log(typeof decodedToken.id);
      console.log('User ID:', userId, 'Type:', typeof userId);

      // Update user's isUserVerified status to 1 in the database
      const updateUserSql = `UPDATE users SET isUserVerified = ? WHERE ID = ?`;
      await doQuery(updateUserSql, [1, userId]);

      return res.status(200).json({
        message: 'Registration email has been verified',
        redirectTo: '/',
      });
    } else {
      console.log('Invalid token: ', decodedToken);
      return res
        .status(400)
        .json({ message: 'Invalid token or expired link.' });
    }
  } catch (error) {
    next(error);
  }
};
