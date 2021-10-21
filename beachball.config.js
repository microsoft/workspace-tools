module.exports = {
  scope: ["!src/__fixtures__/**/*"],
  ignorePatterns: [
    ".github/**",
    ".prettierrc",
    "jest.config.js",
    "src/__fixtures__/**",
    "src/__tests__/**",
    // This prevents dependabot from being blocked by change file requirements for lock file-only changes
    "yarn.lock",
  ],
};
