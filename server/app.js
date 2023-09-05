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
const cookieParser = require('cookie-parser');

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
    },
  }),
);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, // This allows cookies to be sent with requests
  }),
);
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// API Routes
const authRouter = require('./routes/authRoutes');
app.use('/auth', authRouter);

const shiftRoutes = require('./routes/shiftRoutes');
app.use('/shift', shiftRoutes);

// const appointmentRoutes = require('./routes/appointmentRoutes')
// app.use('/appointment', appointmentRoutes)

// const reportRoutes = require('./routes/reportRoutes')

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 8001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
