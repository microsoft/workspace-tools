// @ts-check

/** @type {import('beachball').BeachballConfig} */
const config = {
  access: "public",
  disallowedChangeTypes: ["major"],
  groupChanges: true,
  scope: ["!**/__fixtures__/**"],
  ignorePatterns: ["**/jest.config.js", "**/src/__fixtures__/**", "**/src/__tests__/**"],
};
module.exports = config;
