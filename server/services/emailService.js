'use strict';
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

// Create a transporter for sending email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
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
    from: 'DoctorPatientAppointmentSystem@gmail.com',
    to: email,
    subject: subject,
    html: content,
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
