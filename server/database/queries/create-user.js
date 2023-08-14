'use strict';
const bcrypt = require('bcrypt');
const doQuery = require('../query');

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
  return result.length > 0 ? true : false;
}

/**
 * This method creates a new user in the database
 * @param {*} user - user data received from registrationController
 * @returns status and message
 */

async function createUser(user) {
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
    parsedId,
    hashedPassword,
    firstName,
    lastName,
    email,
    mobile,
    languages,
    creationDate,
    userType,
    0,
  ];
  const userSql = `
    INSERT INTO users (ID, Password, FirstName, LastName, Email, Mobile, Languages, CreationDate, UserType, isUserVerified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  console.table(`userParams to save in the database in create user query: ${userParams}`);
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

  return { status: 'success', message: 'User created successfully' };
}

module.exports = createUser;
