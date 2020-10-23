const { getFileContent } = require("./files");
const { config } = require("./config");
const { resolve } = require("path");

const getTemplates = () => {
  console.log(`✨ try to read templates from directory "${config.templates}"`);

  return {
    apiTemplate: getTemplate("api"),
    clientTemplate: config.generateClient ? getTemplate("client") : null,
    routeTypesTemplate: getTemplate("route-types"),
  };
};

const getTemplate = (templateName) =>
  getFileContent(resolve(config.templates, `./${templateName}.mustache`));

module.exports = {
  getTemplates,
};
