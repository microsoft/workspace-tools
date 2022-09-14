module.exports = {
  pipeline: {
    build: ["^build"],
    test: ["build"],
  },
  npmClient: "yarn",
  // These options are sent to `backfill`: https://github.com/microsoft/backfill/blob/master/README.md
  cacheOptions: {
    // These are relative to the git root, and affects the hash of the cache
    // Any of these file changes will invalidate cache
    environmentGlob: [".github/workflows/*", "*.js", "package.json"],
  },
};
