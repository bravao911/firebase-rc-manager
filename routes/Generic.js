const express = require('express');
const router = express.Router();
const { getGenericData } = require('../controllers/Generic');

// Route to get all documents from a specified collection
// Example: GET /data/cities
router.get('/:collectionName', getGenericData);

// Route to get a specific document by its ID from a collection
// Example: GET /data/cities/4939202
router.get('/:collectionName/:docId', getGenericData);


module.exports = router;
