'use strict';
const nodemailer = require('nodemailer');

// Create a transporter for sending email
const transporter = nodemailer.createTransport({
  host: 'gmail',
  prot: 2525,
  auth: {
    user: 'doctorpatientappointmentcalend@gmail.com',
    pass: '2f16a8a2c64719',
  },
});

/**
 * Function to send an email
 * @param {string} email - recipient's email address
 * @param {string} subject - email subject
 * @param {string} content - email content
 */
const sendEmail = async (email, subject, content) => {
  // Compose the email options
  const mailOptions = {
    from: 'System@stmp.mailtrap.io',
    to: email,
    subject: subject,
    text: content,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Email sending failed: ${error}`);
  }
};

module.exports = {
  sendEmail,
};
