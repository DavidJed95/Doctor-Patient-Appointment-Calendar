/**
 * @author - David Jedwabsky
 */
'use strict';
const express = require('express');
const errorHandler = require('./utils/errorHandler');
const path = require('path');
const cors = require('cors')
const app = express();
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Middleware
app.use(cors())
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API Routes
const authRouter = require('./routes/authRoutes');
app.use('/auth', authRouter);

// // Serve React application
// app.all('*', (req, res) => {
//   res.status(404).send('resource not found');
// });

// Error handling middleware
app.use(errorHandler);

// If the request does not match any other routes, serve the 'index.html' file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});

// Start the server
const port = process.env.PORT || 8001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
