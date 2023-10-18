// @ts-check

const { spawnSync } = require("child_process");
const fs = require("fs");
const { getUnstagedChanges } = require("workspace-tools");

/** @type {import('beachball').BeachballConfig} */
const config = {
  access: "public",
  disallowedChangeTypes: ["major"],
  groupChanges: true,
  scope: ["!**/__fixtures__/**"],
  ignorePatterns: ["**/jest.config.js", "**/src/__fixtures__/**", "**/src/__tests__/**"],
  hooks: {
    postbump: (packagePath, name) => {
      if (name !== "workspace-tools") {
        return;
      }

      if (getUnstagedChanges(process.cwd()).includes("yarn.lock")) {
        console.warn("yarn.lock unexpectedly had changes; not updating workspace-tools resolutions");
        return;
      }

      let yarnLock = fs.readFileSync("yarn.lock", "utf-8");
      const wsToolsMatch = yarnLock.match(/.*workspace-tools@npm:workspace-tools@latest[\s\S]+?\n\n/);
      if (wsToolsMatch) {
        console.log("Removing workspace-tools entry from yarn.lock");
        yarnLock = yarnLock.replace(wsToolsMatch[0], "");
        fs.writeFileSync("yarn.lock", yarnLock);

        console.log("Running yarn to update workspace-tools resolutions");
        spawnSync("yarn", ["--ignore-scripts"], { stdio: "inherit" });
      } else {
        console.warn("Didn't find a yarn.lock entry for workspace-tools resolutions in expected format");
      }
    },
  },
};
module.exports = config;
