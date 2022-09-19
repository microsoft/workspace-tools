import path from "path";

import { cleanupFixtures, setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { getWorkspaceImplementation } from "../workspaces/implementations";
import { getYarnWorkspaces } from "../workspaces/implementations/yarn";
import { getPnpmWorkspaces } from "../workspaces/implementations/pnpm";
import { getRushWorkspaces } from "../workspaces/implementations/rush";
import { getNpmWorkspaces } from "../workspaces/implementations/npm";
import { getLernaWorkspaces } from "../workspaces/implementations/lerna";

describe("getWorkspaces", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  describe("yarn", () => {
    it("gets the name and path of the workspaces", () => {
      const packageRoot = setupFixture("monorepo");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("yarn");

      const workspacesPackageInfo = getYarnWorkspaces(packageRoot);

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

      const workspacesPackageInfo = getYarnWorkspaces(packageRoot);

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

  describe("pnpm", () => {
    it("gets the name and path of the workspaces", () => {
      const packageRoot = setupFixture("monorepo-pnpm");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("pnpm");

      const workspacesPackageInfo = getPnpmWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });

  describe("rush + pnpm", () => {
    it("gets the name and path of the workspaces", () => {
      const packageRoot = setupFixture("monorepo-rush-pnpm");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("rush");

      const workspacesPackageInfo = getRushWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });

  describe("rush + yarn", () => {
    it("gets the name and path of the workspaces", () => {
      const packageRoot = setupFixture("monorepo-rush-yarn");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("rush");

      const workspacesPackageInfo = getRushWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });

  describe("npm", () => {
    it("gets the name and path of the workspaces", () => {
      const packageRoot = setupFixture("monorepo-npm");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("npm");

      const workspacesPackageInfo = getNpmWorkspaces(packageRoot);

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

      const workspacesPackageInfo = getNpmWorkspaces(packageRoot);

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

  describe("lerna", () => {
    it("gets the name and path of the workspaces", async () => {
      const packageRoot = setupFixture("monorepo-lerna-npm");

      expect(getWorkspaceImplementation(packageRoot, {})).toBe("lerna");

      const workspacesPackageInfo = getLernaWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });
});
