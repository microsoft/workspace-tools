import path from "path";

import { cleanupFixtures, setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { clearWorkspaceRootCache, getWorkspaceRootInfo } from "workspace-tools-paths";
import { getWorkspacePackages } from "../workspaces/getWorkspacePackages";

describe("getWorkspacePackages", () => {
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

      const workspacesPackageInfo = getWorkspacePackages(root);

      expect(workspacesPackageInfo).toMatchObject({
        "package-a": { packageJsonPath: path.join(root, "packages/package-a/package.json") },
        "package-b": { packageJsonPath: path.join(root, "packages/package-b/package.json") },
      });
    });

    it("gets the name and path of the workspaces against a packages spec of an individual package", () => {
      const root = setupFixture("monorepo-globby");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("yarn");

      const workspacesPackageInfo = getWorkspacePackages(root);

      expect(workspacesPackageInfo).toMatchObject({
        "package-a": { packageJsonPath: path.join(root, "packages/package-a/package.json") },
        "package-b": { packageJsonPath: path.join(root, "packages/package-b/package.json") },
        individual: { packageJsonPath: path.join(root, "individual/package.json") },
      });
    });
  });

  describe("pnpm", () => {
    it("gets the name and path of the workspaces", () => {
      const root = setupFixture("monorepo-pnpm");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("pnpm");

      const workspacesPackageInfo = getWorkspacePackages(root);

      expect(workspacesPackageInfo).toMatchObject({
        "package-a": { packageJsonPath: path.join(root, "packages/package-a/package.json") },
        "package-b": { packageJsonPath: path.join(root, "packages/package-b/package.json") },
      });
    });
  });

  describe("rush + pnpm", () => {
    it("gets the name and path of the workspaces", () => {
      const root = setupFixture("monorepo-rush-pnpm");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("rush");

      const workspacesPackageInfo = getWorkspacePackages(root);

      expect(workspacesPackageInfo).toMatchObject({
        "package-a": { packageJsonPath: path.join(root, "packages/package-a/package.json") },
        "package-b": { packageJsonPath: path.join(root, "packages/package-b/package.json") },
      });
    });
  });

  describe("rush + yarn", () => {
    it("gets the name and path of the workspaces", () => {
      const root = setupFixture("monorepo-rush-yarn");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("rush");

      const workspacesPackageInfo = getWorkspacePackages(root);

      expect(workspacesPackageInfo).toMatchObject({
        "package-a": { packageJsonPath: path.join(root, "packages/package-a/package.json") },
        "package-b": { packageJsonPath: path.join(root, "packages/package-b/package.json") },
      });
    });
  });

  describe("npm", () => {
    it("gets the name and path of the workspaces", () => {
      const root = setupFixture("monorepo-npm");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("npm");

      const workspacesPackageInfo = getWorkspacePackages(root);

      expect(workspacesPackageInfo).toMatchObject({
        "package-a": { packageJsonPath: path.join(root, "packages/package-a/package.json") },
        "package-b": { packageJsonPath: path.join(root, "packages/package-b/package.json") },
      });
    });

    it("gets the name and path of the workspaces using the shorthand configuration", () => {
      const root = setupFixture("monorepo-shorthand");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("npm");

      const workspacesPackageInfo = getWorkspacePackages(root);

      expect(workspacesPackageInfo).toMatchObject({
        "package-a": { packageJsonPath: path.join(root, "packages/package-a/package.json") },
        "package-b": { packageJsonPath: path.join(root, "packages/package-b/package.json") },
        individual: { packageJsonPath: path.join(root, "individual/package.json") },
      });
    });
  });

  describe("lerna", () => {
    it("gets the name and path of the workspaces", async () => {
      const root = setupFixture("monorepo-lerna-npm");

      expect(getWorkspaceRootInfo(root)?.manager).toBe("lerna");

      const workspacesPackageInfo = getWorkspacePackages(root);

      expect(workspacesPackageInfo).toMatchObject({
        "package-a": { packageJsonPath: path.join(root, "packages/package-a/package.json") },
        "package-b": { packageJsonPath: path.join(root, "packages/package-b/package.json") },
      });
    });
  });
});
