'use strict';
const fs = require('fs');
const path = require('path'); // Import the 'path' module to handle file paths

const errorHandler = (error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  let errorFile, errorFunction, errorLine, errorText
  
  if (error.stack) {
    //Splitting the stack string of the error into lines and pick the relevant line
    const stackLines = error.stack.split('\n');
    const errorDetails = stackLines[1] || '';

    const matched = errorDetails.match(/\((.*):(\d+):(\d+)\)/);
    errorFile = matched[1] || 'unknown';
    errorLine = matched[2] || 'unknown';
    errorText = '';

    // Extracting function name from the stack line
    const funcMatch = errorDetails.match(/at\s+(.*)\s+\(/) || [];
    errorFunction = funcMatch[1] || 'unknown'
  }
  
  const logMessage = `
  ${new Date().toISOString()} - Error: ${message}\n
  File: ${errorFile}
  Function: ${errorFunction}
  Line: ${errorLine}
  ---------------------------------------------------
  `;
  
  const logFilePath = path.join(__dirname, '..', 'ErrorLog.txt'); // Use path.join to create the file path

  fs.appendFile(logFilePath, logMessage, err => {
    if (err) {
      console.error('Error writing to errorLog.txt:', err);
    }
  });

  res.status(statusCode).json({ message: error.message });
};

module.exports = errorHandler;
