import path from "path";

import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import { getWorkspaceManagerAndRoot } from "../workspaces/implementations";
import { getYarnWorkspaces, getYarnWorkspacesAsync } from "../workspaces/implementations/yarn";
import { getPnpmWorkspaces, getPnpmWorkspacesAsync } from "../workspaces/implementations/pnpm";
import { getRushWorkspaces, getRushWorkspacesAsync } from "../workspaces/implementations/rush";
import { getNpmWorkspaces, getNpmWorkspacesAsync } from "../workspaces/implementations/npm";
import { getLernaWorkspaces, getLernaWorkspacesAsync } from "../workspaces/implementations/lerna";

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

      expect(getWorkspaceManagerAndRoot(packageRoot, new Map())).toEqual({ manager: "yarn", root: packageRoot });

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

      expect(getWorkspaceManagerAndRoot(packageRoot, new Map())).toEqual({ manager: "yarn", root: packageRoot });

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

  describe.each([
    ["getPnpmWorkspaces", getPnpmWorkspaces],
    ["getPnpmWorkspacesAsync", getPnpmWorkspacesAsync],
  ])("pnpm (%s)", (name, getWorkspaces) => {
    it("gets the name and path of the workspaces", async () => {
      const packageRoot = setupFixture("monorepo-pnpm");

      expect(getWorkspaceManagerAndRoot(packageRoot, new Map())).toEqual({ manager: "pnpm", root: packageRoot });

      const workspacesPackageInfo = await getWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });

  describe.each([
    ["getRushWorkspaces", getRushWorkspaces],
    ["getRushWorkspacesAsync", getRushWorkspacesAsync],
  ])("rush + pnpm (%s)", (name, getWorkspaces) => {
    it("gets the name and path of the workspaces", async () => {
      const packageRoot = setupFixture("monorepo-rush-pnpm");

      expect(getWorkspaceManagerAndRoot(packageRoot, new Map())).toEqual({ manager: "rush", root: packageRoot });

      const workspacesPackageInfo = await getWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });

  describe.each([
    ["getRushWorkspaces", getRushWorkspaces],
    ["getRushWorkspacesAsync", getRushWorkspacesAsync],
  ])("rush + pnpm (%s)", (name, getWorkspaces) => {
    it("gets the name and path of the workspaces", async () => {
      const packageRoot = setupFixture("monorepo-rush-yarn");

      expect(getWorkspaceManagerAndRoot(packageRoot, new Map())).toEqual({ manager: "rush", root: packageRoot });

      const workspacesPackageInfo = await getWorkspaces(packageRoot);

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

      expect(getWorkspaceManagerAndRoot(packageRoot, new Map())).toEqual({ manager: "npm", root: packageRoot });

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

      expect(getWorkspaceManagerAndRoot(packageRoot, new Map())).toEqual({ manager: "npm", root: packageRoot });

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

  describe.each([
    ["getLernaWorkspaces", getLernaWorkspaces],
    ["getLernaWorkspacesAsync", getLernaWorkspacesAsync],
  ])("lerna (%s)", (name, getWorkspaces) => {
    it("gets the name and path of the workspaces", async () => {
      const packageRoot = setupFixture("monorepo-lerna-npm");

      expect(getWorkspaceManagerAndRoot(packageRoot, new Map())).toEqual({ manager: "lerna", root: packageRoot });

      const workspacesPackageInfo = await getWorkspaces(packageRoot);

      const packageAPath = path.join(packageRoot, "packages", "package-a");
      const packageBPath = path.join(packageRoot, "packages", "package-b");

      expect(_.orderBy(workspacesPackageInfo, ["name"], ["asc"])).toMatchObject([
        { name: "package-a", path: packageAPath },
        { name: "package-b", path: packageBPath },
      ]);
    });
  });
});
