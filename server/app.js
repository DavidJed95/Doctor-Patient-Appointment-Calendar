/**
 * @author - David Jedwabsky
 */
'use strict';
const express = require('express');
const errorHandler = require('./utils/errorHandler');
const path = require('path');
const app = express();
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Middleware
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
const authRouter = require('./routes/authRoutes');
app.use('/auth', authRouter);

// Serve React application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 8001;
app.listen(port, () => console.log(`Server is running on port ${port}`));