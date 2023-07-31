'use strict';
const fs = require('fs');
const path = require('path'); // Import the 'path' module to handle file paths

const errorHandler = (error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log the error to a text file (errorLog.txt)
  const logMessage = `${new Date().toISOString()} - Error: ${message}\n`;
  const logFilePath = path.join(__dirname, 'errorLog.txt'); // Use path.join to create the file path

  fs.appendFile(logFilePath, logMessage, err => {
    if (err) {
      console.error('Error writing to errorLog.txt:', err);
    }
  });

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
