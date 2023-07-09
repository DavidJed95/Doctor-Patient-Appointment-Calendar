'use strict';
const doQuery = require('../query');
const emailService = require('../../services/emailService');
const getUserByID = require('./get-user-by-id');

/**
 * Update the profile information of a user.
 * @param {*} id - User ID
 * @param {*} updates - Object containing the updated profile fields
 * @returns { status, message }
 */
async function updateUserProfile(id, updates) {
  const updateFields = [];

  // Generate the update query and collect the update fields
  let updateQuery = 'UPDATE users SET ';
  for (const [key, value] of Object.entries(updates)) {
    if (key !== 'email' && key !== 'id') {
      updateQuery += `${key} = ?, `;
      updateFields.push(value);
    }
  }

  // Remove the trailing comma and space
  updateQuery = updateQuery.slice(0, -2);

  // Add the WHERE clause to update only the specific user
  updateQuery += ' WHERE id = ?';
  updateFields.push(id);

  // Execute the update query
  await doQuery(updateQuery, updateFields);

  // Send email to the user about the profile update
  const user = await getUserByID(id);
  const emailContent = `Your profile information has been updated. Please review the changes:\n\n${JSON.stringify(
    updates,
    null,
    2,
  )}`;
  emailService.sendEmail(user.Email, 'Profile Update', emailContent);

  return { status: 'success', message: 'User profile updated successfully' };
}

module.exports = updateUserProfile;
