const express = require('express');
const router = express.Router();
const {
  getAllGroups,
  getGroup,
  upsertGroup,
  deleteGroup
} = require('../controllers/groups');
const { handleError } = require('../controllers/errorHandler');
const { getRemoteConfig } = require('firebase-admin/remote-config');
const remoteConfig = getRemoteConfig();

// Before update: always fetch the latest
 remoteConfig.getTemplate();

// Get all groups
router.get('/', async (req, res) => {
  try {
    const data = await getAllGroups();
    res.json({ success: true, data });
  } catch (error) {
    handleError(res, 'retrieve all groups', error);
  }
});

// Get specific group
router.get('/:groupName', async (req, res) => {
  try {
    const { groupName } = req.params;
    const group = await getGroup(groupName);
    
    if (group) {
      res.json({ success: true, data: group });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
    }
  } catch (error) {
    handleError(res, 'retrieve group', error);
  }
});

// Create or update group
router.post('/', async (req, res) => {
  try {
    const { groupName, description } = req.body;
    if (!groupName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing groupName' 
      });
    }
    
    const data = await upsertGroup(groupName, description);
    res.json({ success: true, data });
  } catch (error) {
    handleError(res, 'create/update group', error);
  }
});

// Delete group
router.delete('/:groupName', async (req, res) => {
  try {
    const { groupName } = req.params;
    const deleted = await deleteGroup(groupName);
    
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
    }
  } catch (error) {
    handleError(res, 'delete group', error);
  }
});

module.exports = router;