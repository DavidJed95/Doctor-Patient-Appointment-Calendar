/**
 * @author - David Jedwabsky
 */
'use strict';
const express = require('express');
const logger = require('./utils/errorHandler');
const path = require('path');
const app = express();

app.use(logger);

const dotenv = require('dotenv');

const authRouter = require('./routes/authRoutes');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Configure middleware
app.use(express.static(path.join(__dirname, '/client/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  // Handle the error and send an appropriate response to the client
  res
    .status(500)
    .json({ status: 'failure', message: 'Internal Server Error!' });
});

// Start the server
const port = process.env.PORT || 8001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
