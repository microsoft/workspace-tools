// @ts-check

// const fs = require("fs");
// const jju = require("jju");
// const tsconfig = jju.parse(fs.readFileSync("./scripts/tsconfig.base.json", "utf-8"));

// https://typedoc.org/options/configuration/
/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  name: "workspace-tools",
  entryPointStrategy: "packages",
  entryPoints: ["packages/*"],

  // entryPoints: ["packages/*/src/index.ts"],
  // tsconfig: "./scripts/tsconfig.typedoc.json",
  // compilerOptions: tsconfig.compilerOptions,
  logLevel: "Verbose",
  // entry
};

module.exports = config;
