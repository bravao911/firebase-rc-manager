/**
 * This file defines the routes for reservation-related endpoints.
 * It maps the HTTP GET request for /stream/:id to the corresponding
 * controller function that handles the real-time data streaming for a single document.
 */

const express = require('express');
const router = express.Router();

// Import the updated controller function
const reservationsController = require('../controllers/reservations');

/**
 * @route   GET /reservations/stream/:id
 * @desc    Opens a connection to stream real-time updates for a single reservation document.
 * @access  Public (or add authentication middleware as needed)
 */
router.get('/stream/:id', reservationsController.streamReservationById);

module.exports = router;
