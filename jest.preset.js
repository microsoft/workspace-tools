module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: ["<rootDir>/src/__fixtures__"],
  preset: "ts-jest",
  setupFilesAfterEnv: [require.resolve("./scripts/jest/setupTests.ts")],
};
