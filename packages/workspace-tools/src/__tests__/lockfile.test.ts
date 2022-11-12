import fs from "fs-extra";
import path from "path";
import { setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { parseLockFile } from "../lockfile";
import { PackageInfo } from "../types/PackageInfo";

const ERROR_MESSAGES = {
  NO_LOCK: "You do not have yarn.lock, pnpm-lock.yaml or package-lock.json. Please use one of these package managers.",
  UNSUPPORTED:
    "Your package-lock.json version is not supported: lockfileVersion is 1. You need npm version 7 or above and package-lock version 2 or above. Please, upgrade npm or choose a different package manager.",
};

describe("parseLockFile()", () => {
  describe("general", () => {
    it("throws if it cannot find lock file", async () => {
      const packageRoot = setupFixture("basic-without-lock-file");

      await expect(parseLockFile(packageRoot)).rejects.toThrow(ERROR_MESSAGES.NO_LOCK);
    });
  });

  describe("NPM", () => {
    it("parses package-lock.json file when it is found", async () => {
      const packageRoot = setupFixture("monorepo-npm");
      const parsedLockFile = await parseLockFile(packageRoot);

      expect(parsedLockFile).toHaveProperty("type", "success");
    });

    it("throws if npm version is unsupported", async () => {
      const packageRoot = setupFixture("monorepo-npm-unsupported");

      await expect(parseLockFile(packageRoot)).rejects.toThrow(ERROR_MESSAGES.UNSUPPORTED);
    });
  });

  // TODO: add yarn 2
  describe.each([1] as const)("yarn %s", (yarnVersion) => {
    const updatePath = (path: string) => (yarnVersion === 1 ? path : `${path}-2`);

    it("parses yarn.lock file when it is found", async () => {
      const packageRoot = setupFixture(updatePath("basic"));
      const parsedLockFile = await parseLockFile(packageRoot);

      expect(parsedLockFile).toHaveProperty("type", "success");
    });

    it("parses combined ranges in yarn.lock", async () => {
      const packageRoot = setupFixture(updatePath("basic-yarn"));

      // Verify that __fixtures__/basic-yarn still follows these assumptions:
      // - "execa" is listed as a dep in package.json
      // - "@types/execa" is also listed as a dep, and internally has a dep on "execa@*"
      const packageName = "execa";
      const packageInfo = fs.readJSONSync(path.join(packageRoot, "package.json")) as PackageInfo;
      expect(packageInfo.dependencies?.[packageName]).toBeTruthy();
      expect(packageInfo.devDependencies?.[`@types/${packageName}`]).toBeTruthy();

      // The actual test: execa@* resolves to the same thing as execa@<specific version from package.json>
      const expectedSpec = `${packageName}@*`;
      const parsedLockFile = await parseLockFile(packageRoot);
      expect(parsedLockFile.object[expectedSpec]).toBeTruthy();
      const otherSpecs = Object.entries(parsedLockFile.object).filter(
        ([spec]) => spec.startsWith(`${packageName}@`) && spec !== expectedSpec
      );
      expect(otherSpecs.length).toBeGreaterThanOrEqual(1);
      expect(otherSpecs).toContainEqual([expect.anything(), parsedLockFile.object[expectedSpec]]);
    });
  });

  describe("PNPM", () => {
    it("parses pnpm-lock.yaml file when it is found", async () => {
      const packageRoot = setupFixture("basic-pnpm");
      const parsedLockFile = await parseLockFile(packageRoot);

      const yargs = Object.keys(parsedLockFile.object).find((key) => /^yargs@/.test(key));
      // if either of these fails, check the actual lock file to verify the deps didn't change
      // with renovate updates or something
      expect(yargs).toBeTruthy();
      expect(parsedLockFile.object[yargs!].dependencies?.["cliui"]).toBeTruthy();
    });
  });
});
