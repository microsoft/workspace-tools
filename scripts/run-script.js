#!/usr/bin/env node

const scriptName = process.argv[2];

switch (scriptName) {
  case "api":
  case "api-extractor":
    require("./api-extractor/index");
    break;

  default:
    console.error(`Unknown script "${scriptName}".`);
    process.exit(1);
}
