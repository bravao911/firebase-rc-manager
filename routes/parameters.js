const express = require('express');
const router = express.Router();
const {
  getAllParameters,
  getParameter,
  upsertParameter,
  deleteParameter
} = require('../controllers/parameters');
const { handleError } = require('../controllers/errorHandler');

// Get all parameters
router.get('/', async (req, res) => {
  try {
    const data = await getAllParameters();
    res.json({ success: true, data });
  } catch (error) {
    handleError(res, 'retrieve all parameters', error);
  }
});

// Get specific parameter (grouped or top-level)
router.get(['/:groupName/:key', '/:key'], async (req, res) => {
  try {
    const { groupName, key } = req.params;
    const parameter = await getParameter(key, groupName);
    
    if (parameter) {
      res.json({ success: true, data: parameter });
    } else {
      res.status(404).json({ 
        success: false, 
        message: `Parameter not found` 
      });
    }
  } catch (error) {
    handleError(res, 'retrieve parameter', error);
  }
});

// Create or update parameter
router.post('/', async (req, res) => {
  try {
    const { key, value, description, groupName } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing key or value' 
      });
    }
    
    const data = await upsertParameter(key, value, description, groupName);
    res.json({ success: true, data });
  } catch (error) {
    handleError(res, 'create/update parameter', error);
  }
});

// Delete parameter
router.delete(['/:groupName/:key', '/:key'], async (req, res) => {
  try {
    const { groupName, key } = req.params;
    const deleted = await deleteParameter(key, groupName);
    
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Parameter not found' 
      });
    }
  } catch (error) {
    handleError(res, 'delete parameter', error);
  }
});

module.exports = router;