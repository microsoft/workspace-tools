import path from "path";

import { cleanupFixtures, setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { getYarnWorkspaces } from "../workspaces/implementations/yarn";
import { getPnpmWorkspaces } from "../workspaces/implementations/pnpm";
import { getRushWorkspaces } from "../workspaces/implementations/rush";
import { getNpmWorkspaces } from "../workspaces/implementations/npm";
import { getLernaWorkspaces } from "../workspaces/implementations/lerna";
import { clearWorkspaceRootCache, getWorkspaceRootInfo } from "workspace-tools-paths";

describe("getWorkspaces", () => {
  afterEach(() => {
    clearWorkspaceRootCache();
  });

  afterAll(() => {
    cleanupFixtures();
  });

  describe("yarn", () => {
    it("gets the name and path of the workspaces", () => {
      const root = setupFixture("monorepo");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("yarn");

      const workspacesPackageInfo = getYarnWorkspaces(root);

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: path.join(root, "packages", "package-a") },
        { name: "package-b", path: path.join(root, "packages", "package-b") },
      ]);
    });

    it("gets the name and path of the workspaces against a packages spec of an individual package", () => {
      const root = setupFixture("monorepo-globby");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("yarn");

      const workspacesPackageInfo = getYarnWorkspaces(root);

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: path.join(root, "packages", "package-a") },
        { name: "package-b", path: path.join(root, "packages", "package-b") },
        { name: "individual", path: path.join(root, "individual") },
      ]);
    });
  });

  describe("pnpm", () => {
    it("gets the name and path of the workspaces", () => {
      const root = setupFixture("monorepo-pnpm");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("pnpm");

      const workspacesPackageInfo = getPnpmWorkspaces(root);

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: path.join(root, "packages", "package-a") },
        { name: "package-b", path: path.join(root, "packages", "package-b") },
      ]);
    });
  });

  describe("rush + pnpm", () => {
    it("gets the name and path of the workspaces", () => {
      const root = setupFixture("monorepo-rush-pnpm");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("rush");

      const workspacesPackageInfo = getRushWorkspaces(root);

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: path.join(root, "packages", "package-a") },
        { name: "package-b", path: path.join(root, "packages", "package-b") },
      ]);
    });
  });

  describe("rush + yarn", () => {
    it("gets the name and path of the workspaces", () => {
      const root = setupFixture("monorepo-rush-yarn");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("rush");

      const workspacesPackageInfo = getRushWorkspaces(root);

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: path.join(root, "packages", "package-a") },
        { name: "package-b", path: path.join(root, "packages", "package-b") },
      ]);
    });
  });

  describe("npm", () => {
    it("gets the name and path of the workspaces", () => {
      const root = setupFixture("monorepo-npm");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("npm");

      const workspacesPackageInfo = getNpmWorkspaces(root);

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: path.join(root, "packages", "package-a") },
        { name: "package-b", path: path.join(root, "packages", "package-b") },
      ]);
    });

    it("gets the name and path of the workspaces using the shorthand configuration", () => {
      const root = setupFixture("monorepo-shorthand");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("npm");

      const workspacesPackageInfo = getNpmWorkspaces(root);

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: path.join(root, "packages", "package-a") },
        { name: "package-b", path: path.join(root, "packages", "package-b") },
        { name: "individual", path: path.join(root, "individual") },
      ]);
    });
  });

  describe("lerna", () => {
    it("gets the name and path of the workspaces", async () => {
      const root = setupFixture("monorepo-lerna-npm");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("lerna");

      const workspacesPackageInfo = getLernaWorkspaces(root);

      expect(workspacesPackageInfo).toMatchObject([
        { name: "package-a", path: path.join(root, "packages", "package-a") },
        { name: "package-b", path: path.join(root, "packages", "package-b") },
      ]);
    });
  });
});
