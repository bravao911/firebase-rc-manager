const { remoteConfig } = require('../config/firebase');

exports.getCurrentTemplate = async () => {
  return await remoteConfig.getTemplate();
};

exports.validateAndPublishTemplate = async (template) => {
  const validatedTemplate = await remoteConfig.validateTemplate(template);
  return await remoteConfig.publishTemplate(validatedTemplate);
};