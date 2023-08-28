/**
 * @author - David Jedwabsky
 */
'use strict';
const express = require('express');
const session = require('express-session');
const errorHandler = require('./utils/errorHandler');
const path = require('path');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Middlewares
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true only if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    },
  }),
);
app.use(
  cors({
    origin: 'http://localhost:3000', // Assuming your React app is running on port 3000
    credentials: true, // This allows cookies to be sent with requests
  }),
);
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API Routes
const authRouter = require('./routes/authRoutes');
app.use('/auth', authRouter);

// Error handling middleware
app.use(errorHandler);



// Start the server
const port = process.env.PORT || 8001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
