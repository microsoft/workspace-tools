/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: ["<rootDir>/src"],
  transform: {
    // Use ts-jest but disable type checking (superfluous)
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { isolatedModules: true } }],
  },
  testRegex: "(/__tests__/.*(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  passWithNoTests: true,
  preset: "ts-jest",
  setupFilesAfterEnv: [require.resolve("./setupTests.ts")],
};
module.exports = config;
