import path from "path";

import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import { getWorkspaceManagerAndRoot } from "../../workspaces/implementations";
import type { WorkspaceManager } from "../../workspaces/WorkspaceManager";
import { getWorkspaces, getWorkspacesAsync } from "../../workspaces/getWorkspaces";

describe("getWorkspaces", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  describe.each<{
    manager: WorkspaceManager;
    desc: string;
    fixtureName: string;
  }>([
    { manager: "yarn", desc: "yarn", fixtureName: "monorepo" },
    { manager: "pnpm", desc: "pnpm", fixtureName: "monorepo-pnpm" },
    { manager: "rush", desc: "rush + pnpm", fixtureName: "monorepo-rush-pnpm" },
    { manager: "rush", desc: "rush + yarn", fixtureName: "monorepo-rush-yarn" },
    { manager: "npm", desc: "npm", fixtureName: "monorepo-npm" },
    { manager: "lerna", desc: "lerna + npm", fixtureName: "monorepo-lerna-npm" },
  ])("$desc", ({ manager, fixtureName }) => {
    it.each(["sync", "async"] as const)("gets workspace info (%s)", async (syncAsync) => {
      const getInfo = syncAsync === "sync" ? getWorkspaces : getWorkspacesAsync;

      const root = setupFixture(fixtureName);
      expect(getWorkspaceManagerAndRoot(root, new Map())).toEqual({ manager, root });

      const workspacesPackageInfo = (await getInfo(root, manager))?.sort((a, b) => a.name.localeCompare(b.name));

      expect(workspacesPackageInfo).toMatchObject([
        { name: "individual", path: path.join(root, "individual") },
        { name: "package-a", path: path.join(root, "packages/package-a") },
        { name: "package-b", path: path.join(root, "packages/package-b") },
      ]);
    });
  });
});
