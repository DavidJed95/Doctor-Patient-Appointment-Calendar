'use strict';
const bcrypt = require('bcrypt');
const doQuery = require('../query');
const tokenService = require('../../services/tokenService');
const emailService = require('../../services/emailService');

/**
 * This method checks if the user already exists in the database on ID and Email
 * @param {*} id - id of the user
 * @param {*} email - email of the user
 * @returns - true if the user already exists in the database otherwise false
 */
async function checkUserExist(id, email) {
  let param = [id, email];
  const sql = `SELECT 1 from users Where id = ? OR email = ? LIMIT 1`;
  const result = await doQuery(sql, param);
  console.log(result);
  return result.length > 0 ? true : false;
}

/**
 * This method creates a new user in the database
 * @param {*} user - user data received from registrationController
 * @returns status and message
 */

async function createUser(user) {
  console.log(user)
  const {
    userType,
    id,
    password,
    passwordConfirm,
    firstName,
    lastName,
    email,
    mobile,
    languages,
    creationDate,
    medicalStatus,
    medicalLicense,
    specialization,
  } = user;

  if (
    !userType ||
    typeof id !== 'string' ||
    id.length !== 9 ||
    !/^\d+$/.test(id) ||
    !email ||
    !password ||
    !passwordConfirm ||
    !firstName ||
    !lastName ||
    !mobile ||
    !languages
  ) {
    return {
      status: 'failure',
      message: 'Please provide all required user data',
    };
  }

  const parsedId = Number(user.id);

  if (password !== passwordConfirm) {
    return { status: 'failure', message: 'The passwords do not match' };
  }

  const userExists = await checkUserExist(parsedId, email);
  if (userExists) {
    return { status: 'failure', message: 'User already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userParams = [
    paredId,
    hashedPassword,
    firstName,
    lastName,
    email,
    mobile,
    languages,
    creationDate,
    userType,
  ];
  const userSql = `INSERT INTO users (ID, Password, FirstName, LastName, Email, Mobile, Languages, CreationDate, UserType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  await doQuery(userSql, userParams);

  if (medicalStatus) {
    const patientParams = [parsedId, medicalStatus];
    const patientSql = `Insert INTO patients (ID, MedicalStatus) Values (?,?)`;
    await doQuery(patientSql, patientParams);
  }

  if (medicalLicense && specialization) {
    const specialistParams = [parsedId, medicalLicense, specialization];
    const specialistSql = `INSERT INTO medicalspecialists (ID, MedicalLicense, Specialization) VALUES (?,?,?)`;
    await doQuery(specialistSql, specialistParams);
  }

  // Generate email verification token
  const emailVerificationToken =
    tokenService.generateEmailVerificationToken(user);

  // Update the user model with the email verification token
  const updateUserSql = `UPDATE users SET EmailVerificationToken = ? WHERE ID = ?`;
  const tokenParams = [emailVerificationToken, parsedId];
  await doQuery(updateUserSql, tokenParams);

  // Send email verification email to the user
  const emailContent = `Hi ${
    firstName + ' ' + lastName
  },\n\nThank you for registering. Please click on the following link to verify your email:\n\nEmail Verification: http://example.com/verify-email?token=${emailVerificationToken}\n\nIf you did not register for this account, please ignore this email.\n\nBest regards,\nThe Team`;
  emailService.sendEmail(email, 'Verification Email', emailContent);

  return { status: 'success', message: 'User created successfully' };
}

module.exports = createUser;
