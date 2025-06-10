// controllers/parameters.js
const { remoteConfig } = require('../config/firebase');
const { getCurrentTemplate, validateAndPublishTemplate } = require('../utils/templateUtils');

// Get all parameters
exports.getAllParameters = async () => {
  const template = await getCurrentTemplate();
  const allParameters = {
    topLevel: template.parameters || {},
    grouped: {}
  };

  if (template.parameterGroups) {
    for (const groupName in template.parameterGroups) {
      if (template.parameterGroups.hasOwnProperty(groupName)) {
        // Ensure that if parameterGroups[groupName] exists, its .parameters is also an object
        // This defensive check prevents errors if a group somehow got created without 'parameters'
        allParameters.grouped[groupName] = template.parameterGroups[groupName].parameters || {};
      }
    }
  }

  return allParameters;
};

// Get parameter by key (top-level or grouped)
exports.getParameter = async (key, groupName = null) => {
  const template = await getCurrentTemplate();

  if (groupName) {
    // Add defensive check for parameterGroups[groupName] and its parameters
    if (template.parameterGroups?.[groupName]?.parameters?.[key]) {
      return template.parameterGroups[groupName].parameters[key];
    }
    return null;
  }

  return template.parameters?.[key] || null;
};

// Create or update parameter
exports.upsertParameter = async (key, value, description = '', groupName = null) => {
  const template = await getCurrentTemplate();

  if (groupName) {
    if (!template.parameterGroups) template.parameterGroups = {};

    // --- CRITICAL FIX START ---
    // Ensure the group exists and its parameters object is initialized
    if (!template.parameterGroups[groupName]) {
      template.parameterGroups[groupName] = {
        description: `Auto-created group for ${groupName}.`,
        parameters: {} // Initialize parameters as an empty object
      };
    } else if (!template.parameterGroups[groupName].parameters) {
      // If the group exists but somehow 'parameters' is missing, initialize it
      template.parameterGroups[groupName].parameters = {};
    }
    // --- CRITICAL FIX END ---

    template.parameterGroups[groupName].parameters[key] = {
      defaultValue: { value: JSON.stringify(value) }, // <-- The 'value' is stringified here
      description: description
    };
  } else {
    if (!template.parameters) template.parameters = {};
    template.parameters[key] = {
      defaultValue: { value: JSON.stringify(value) },
      description: description
    };
  }

  await validateAndPublishTemplate(template);
  return { key, value, description, groupName };
};

// Delete parameter
exports.deleteParameter = async (key, groupName = null) => {
  const template = await getCurrentTemplate();
  let deleted = false;

  if (groupName) {
    // Add defensive checks here as well
    if (template.parameterGroups?.[groupName]?.parameters?.[key]) {
      delete template.parameterGroups[groupName].parameters[key];
      deleted = true;
    }
  } else if (template.parameters?.[key]) {
    delete template.parameters[key];
    deleted = true;
  }

  if (deleted) {
    await validateAndPublishTemplate(template);
  }
  return deleted;
};