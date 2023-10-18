// @ts-check

const { spawnSync } = require("child_process");
const { getUnstagedChanges, git, stageAndCommit } = require("workspace-tools");

/** @type {import('beachball').BeachballConfig} */
const config = {
  access: "public",
  disallowedChangeTypes: ["major"],
  groupChanges: true,
  scope: ["!**/__fixtures__/**"],
  ignorePatterns: ["**/jest.config.js", "**/src/__fixtures__/**", "**/src/__tests__/**"],
  hooks: {
    postpublish: (packagePath, name) => {
      if (name !== "workspace-tools") {
        return;
      }

      if (getUnstagedChanges(process.cwd()).includes("yarn.lock")) {
        console.warn("yarn.lock unexpectedly had changes; not updating workspace-tools resolutions");
        return;
      }

      console.log('Running "yarn --force" to update workspace-tools resolutions');
      spawnSync("yarn", ["--force", "--ignore-scripts"], { stdio: "inherit" });

      if (getUnstagedChanges(process.cwd()).includes("yarn.lock")) {
        console.log("Committing and pushing yarn.lock changes");
        stageAndCommit(["yarn.lock"], "Update workspace-tools resolutions", process.cwd());
        git(["push", "--no-verify", "--verbose", "origin", "HEAD:master"]);
      } else {
        console.log("No changes to yarn.lock");
      }
    },
  },
};
module.exports = config;
