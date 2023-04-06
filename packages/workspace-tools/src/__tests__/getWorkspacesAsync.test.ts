import path from "path";

import { cleanupFixtures, setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { getWorkspaceImplementation } from "../workspaces/implementations";
import { getYarnWorkspacesAsync } from "../workspaces/implementations/yarn";
import { getNpmWorkspacesAsync } from "../workspaces/implementations/npm";

describe("getWorkspacesAsync", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  describe("yarn", () => {
    it("gets the name and path of the workspaces", () => {
      const packageRoot = setupFixture("monorepo");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("yarn");

      const workspacesPackageInfo = getYarnWorkspacesAsync(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });

    it("gets the name and path of the workspaces against a packages spec of an individual package", () => {
      const packageRoot = setupFixture("monorepo-globby");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("yarn");

      const workspacesPackageInfo = getYarnWorkspacesAsync(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");
      const individualPath = path.join(packageRoot, "individual");

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
        { name: "individual", path: individualPath },
      ]);
    });
  });

  describe("npm", () => {
    it("gets the name and path of the workspaces", () => {
      const packageRoot = setupFixture("monorepo-npm");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("npm");

      const workspacesPackageInfo = getNpmWorkspacesAsync(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });

    it("gets the name and path of the workspaces using the shorthand configuration", () => {
      const packageRoot = setupFixture("monorepo-shorthand");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("npm");

      const workspacesPackageInfo = getNpmWorkspacesAsync(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");
      const individualPath = path.join(packageRoot, "individual");

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
        { name: "individual", path: individualPath },
      ]);
    });
  });
});
