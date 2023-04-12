import path from "path";

import { cleanupFixtures, setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { getWorkspaceManager } from "../workspaces/implementations";
import { getYarnWorkspaces, getYarnWorkspacesAsync } from "../workspaces/implementations/yarn";
import { getPnpmWorkspaces } from "../workspaces/implementations/pnpm";
import { getRushWorkspaces } from "../workspaces/implementations/rush";
import { getNpmWorkspaces, getNpmWorkspacesAsync } from "../workspaces/implementations/npm";
import { getLernaWorkspaces } from "../workspaces/implementations/lerna";

import _ from "lodash";

describe("getWorkspaces", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  describe.each([
    ["getYarnWorkspaces", getYarnWorkspaces],
    ["getYarnWorkspacesAsync", getYarnWorkspacesAsync],
  ])("yarn (%s)", (name, getWorkspaces) => {
    it("gets the name and path of the workspaces", async () => {
      const packageRoot = setupFixture("monorepo");

      expect(getWorkspaceManager(packageRoot, new Map())).toBe("yarn");

      const workspacesPackageInfo = await getWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });

    it("gets the name and path of the workspaces against a packages spec of an individual package", async () => {
      const packageRoot = setupFixture("monorepo-globby");

      expect(getWorkspaceManager(packageRoot, new Map())).toBe("yarn");

      const workspacesPackageInfo = await getWorkspaces(packageRoot);

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

  describe("pnpm", () => {
    it("gets the name and path of the workspaces", () => {
      const packageRoot = setupFixture("monorepo-pnpm");

      expect(getWorkspaceManager(packageRoot, new Map())).toBe("pnpm");

      const workspacesPackageInfo = getPnpmWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });

  describe("rush + pnpm", () => {
    it("gets the name and path of the workspaces", () => {
      const packageRoot = setupFixture("monorepo-rush-pnpm");

      expect(getWorkspaceManager(packageRoot, new Map())).toBe("rush");

      const workspacesPackageInfo = getRushWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });

  describe("rush + yarn", () => {
    it("gets the name and path of the workspaces", () => {
      const packageRoot = setupFixture("monorepo-rush-yarn");

      expect(getWorkspaceManager(packageRoot, new Map())).toBe("rush");

      const workspacesPackageInfo = getRushWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });

  describe.each([
    ["getNpmWorkspaces", getNpmWorkspaces],
    ["getNpmWorkspacesAsync", getNpmWorkspacesAsync],
  ])("npm (%s)", (name, getWorkspaces) => {
    it("gets the name and path of the workspaces", async () => {
      const packageRoot = setupFixture("monorepo-npm");

      expect(getWorkspaceManager(packageRoot, new Map())).toBe("npm");

      const workspacesPackageInfo = await getWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });

    it("gets the name and path of the workspaces using the shorthand configuration", async () => {
      const packageRoot = setupFixture("monorepo-shorthand");

      expect(getWorkspaceManager(packageRoot, new Map())).toBe("npm");

      const workspacesPackageInfo = await getWorkspaces(packageRoot);

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

  describe("lerna", () => {
    it("gets the name and path of the workspaces", async () => {
      const packageRoot = setupFixture("monorepo-lerna-npm");

      expect(getWorkspaceManager(packageRoot, new Map())).toBe("lerna");

      const workspacesPackageInfo = getLernaWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });
});
