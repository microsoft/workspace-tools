// @ts-check

/** @type {import('beachball').BeachballConfig} */
const config = {
  access: "public",
  disallowedChangeTypes: ["major"],
  groupChanges: true,
  ignorePatterns: ["**/jest.config.js", "**/src/__tests__/**"],
};
module.exports = config;
