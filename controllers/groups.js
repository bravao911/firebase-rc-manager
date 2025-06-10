// controllers/groups.js
const { remoteConfig } = require('../config/firebase');
const { getCurrentTemplate, validateAndPublishTemplate } = require('../utils/templateUtils');

// Get all groups
exports.getAllGroups = async () => {
  const template = await getCurrentTemplate();
  return template.parameterGroups || {};
};

// Get specific group
exports.getGroup = async (groupName) => {
  const template = await getCurrentTemplate();
  return template.parameterGroups?.[groupName] || null;
};

// Create or update group
exports.upsertGroup = async (groupName, description = '') => {
  const template = await getCurrentTemplate();

  if (!template.parameterGroups) template.parameterGroups = {};

  // Ensure parameters object exists for the group
  // If the group doesn't exist or parameters is undefined, initialize it as an empty object
  const existingGroup = template.parameterGroups[groupName];
  if (!existingGroup) {
      template.parameterGroups[groupName] = {
          description,
          parameters: {} // Initialize parameters as an empty object for new groups
      };
  } else if (!existingGroup.parameters) {
      existingGroup.parameters = {}; // Initialize parameters if it's missing from an existing group
  }
  
  // Update description if provided
  template.parameterGroups[groupName].description = description;

  await validateAndPublishTemplate(template);
  return { groupName, description };
};

// Delete group
exports.deleteGroup = async (groupName) => {
  const template = await getCurrentTemplate();

  if (!template.parameterGroups?.[groupName]) return false;

  delete template.parameterGroups[groupName];
  await validateAndPublishTemplate(template);
  return true;
};