// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const parametersRouter = require('./routes/parameters');
const groupsRouter = require('./routes/groups');
const uploadsRouter = require('./routes/uploads'); // <--- NEW: Import the uploads router
const reservationsRouter = require('./routes/reservations');
const genericRoutes = require('./routes/Generic'); // <--- NEW: Import the generic routes


const app = express();

// CORS Middleware (Allow requests from Ionic app)
app.use(cors({
  origin: ['http://localhost:8100', 'http://localhost:8101'], // Allow your Ionic frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
// Use bodyParser.json() for JSON payloads (for parameters/groups)
app.use(bodyParser.json());
// bodyParser.urlencoded is needed for parsing URL-encoded bodies (often used with forms, but not strictly for multipart)
// For multipart/form-data, multer handles the parsing.

// Routes
app.use('/parameters', parametersRouter);
app.use('/groups', groupsRouter);
app.use('/uploads', uploadsRouter); // <--- NEW: Register the uploads router
// Tell the app to use the new route for any path starting with /reservations
app.use('/reservations', reservationsRouter);
app.use('/data', genericRoutes);



// Health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Firebase Remote Config API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;