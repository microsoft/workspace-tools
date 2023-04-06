import path from "path";

import { cleanupFixtures, setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { getWorkspaceImplementation } from "../workspaces/implementations";
import { getYarnWorkspacesAsync } from "../workspaces/implementations/yarn";
import { getNpmWorkspacesAsync } from "../workspaces/implementations/npm";

import _ from "lodash";

describe("getWorkspacesAsync", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  describe("yarn", () => {
    it("gets the name and path of the workspaces", async () => {
      const packageRoot = setupFixture("monorepo");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("yarn");

      const workspacesPackageInfo = await getYarnWorkspacesAsync(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });

    it("gets the name and path of the workspaces against a packages spec of an individual package", async () => {
      const packageRoot = setupFixture("monorepo-globby");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("yarn");

      const workspacesPackageInfo = await getYarnWorkspacesAsync(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");
      const individualPath = path.join(packageRoot, "individual");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "individual", path: individualPath },
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });

  describe("npm", () => {
    it("gets the name and path of the workspaces", async () => {
      const packageRoot = setupFixture("monorepo-npm");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("npm");

      const workspacesPackageInfo = await getNpmWorkspacesAsync(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });

    it("gets the name and path of the workspaces using the shorthand configuration", async () => {
      const packageRoot = setupFixture("monorepo-shorthand");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("npm");

      const workspacesPackageInfo = await getNpmWorkspacesAsync(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");
      const individualPath = path.join(packageRoot, "individual");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "individual", path: individualPath },
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });
});
