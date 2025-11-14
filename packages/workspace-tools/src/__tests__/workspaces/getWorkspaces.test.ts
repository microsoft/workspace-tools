import path from "path";

import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import { getWorkspaceManagerAndRoot } from "../../workspaces/implementations";
import { getYarnWorkspaces, getYarnWorkspacesAsync } from "../../workspaces/implementations/yarn";
import { getPnpmWorkspaces, getPnpmWorkspacesAsync } from "../../workspaces/implementations/pnpm";
import { getRushWorkspaces, getRushWorkspacesAsync } from "../../workspaces/implementations/rush";
import { getNpmWorkspaces, getNpmWorkspacesAsync } from "../../workspaces/implementations/npm";
import { getLernaWorkspaces, getLernaWorkspacesAsync } from "../../workspaces/implementations/lerna";
import type { WorkspaceManager } from "../../workspaces/WorkspaceManager";

describe("getWorkspaces", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  describe.each<{
    manager: WorkspaceManager;
    managerName: string;
    fixtureName: string;
    getSync: typeof getYarnWorkspaces;
    getAsync: typeof getYarnWorkspacesAsync;
  }>([
    {
      manager: "yarn",
      managerName: "yarn",
      fixtureName: "monorepo",
      getSync: getYarnWorkspaces,
      getAsync: getYarnWorkspacesAsync,
    },
    {
      manager: "pnpm",
      managerName: "pnpm",
      fixtureName: "monorepo-pnpm",
      getSync: getPnpmWorkspaces,
      getAsync: getPnpmWorkspacesAsync,
    },
    {
      manager: "rush",
      managerName: "rush + pnpm",
      fixtureName: "monorepo-rush-pnpm",
      getSync: getRushWorkspaces,
      getAsync: getRushWorkspacesAsync,
    },
    {
      manager: "rush",
      managerName: "rush + yarn",
      fixtureName: "monorepo-rush-yarn",
      getSync: getRushWorkspaces,
      getAsync: getRushWorkspacesAsync,
    },
    {
      manager: "npm",
      managerName: "npm",
      fixtureName: "monorepo-npm",
      getSync: getNpmWorkspaces,
      getAsync: getNpmWorkspacesAsync,
    },
    {
      manager: "lerna",
      managerName: "lerna + npm",
      fixtureName: "monorepo-lerna-npm",
      getSync: getLernaWorkspaces,
      getAsync: getLernaWorkspacesAsync,
    },
  ])("$managerName", ({ manager, fixtureName, getSync, getAsync }) => {
    it.each([
      ["sync", getSync],
      ["async", getAsync],
    ])("gets workspace info (%s)", async (name, getWorkspaces) => {
      const root = setupFixture(fixtureName);

      expect(getWorkspaceManagerAndRoot(root, new Map())).toEqual({ manager, root });

      const workspacesPackageInfo = (await getWorkspaces(root)).sort((a, b) => a.name.localeCompare(b.name));

      expect(workspacesPackageInfo).toMatchObject([
        { name: "individual", path: path.join(root, "individual") },
        { name: "package-a", path: path.join(root, "packages/package-a") },
        { name: "package-b", path: path.join(root, "packages/package-b") },
      ]);
    });
  });
});
