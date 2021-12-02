import { setupFixture } from "../helpers/setupFixture";
import { parseLockFile } from "../lockfile";

const ERROR_MESSAGES = {
  NO_LOCK: "You do not have yarn.lock, pnpm-lock.yaml or package-lock.json. Please use one of these package managers.",
  UNSUPPORTED:
    "Your package-lock.json version is not supported: lockfileVersion is 1. You need npm version 7 or above and package-lock version 2 or above. Please, upgrade npm or choose a different package manager.",
};

describe("parseLockFile()", () => {
  // General
  it("throws if it cannot find lock file", async () => {
    const packageRoot = await setupFixture("basic-without-lock-file");

    await expect(parseLockFile(packageRoot)).rejects.toThrow(ERROR_MESSAGES.NO_LOCK);
  });

  // NPM
  it("parses package-lock.json file when it is found", async () => {
    const packageRoot = await setupFixture("monorepo-npm");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(parsedLockeFile).toHaveProperty("type", "success");
  });

  it("throws if npm version is unsupported", async () => {
    const packageRoot = await setupFixture("monorepo-npm-unsupported");

    await expect(parseLockFile(packageRoot)).rejects.toThrow(ERROR_MESSAGES.UNSUPPORTED);
  });

  // Yarn
  it("parses yarn.lock file when it is found", async () => {
    const packageRoot = await setupFixture("basic");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(parsedLockeFile).toHaveProperty("type", "success");
  });

  it("parses combined ranges in yarn.lock", async () => {
    const packageRoot = await setupFixture("basic-yarn");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(parsedLockeFile.object["@babel/code-frame@^7.0.0"].version).toBe(
      parsedLockeFile.object["@babel/code-frame@^7.8.3"].version
    );
  });

  // PNPM
  it("parses pnpm-lock.yaml file when it is found", async () => {
    const packageRoot = await setupFixture("basic-pnpm");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(Object.keys(parsedLockeFile.object["yargs@16.2.0"].dependencies!)).toContain("cliui");
  });
});
