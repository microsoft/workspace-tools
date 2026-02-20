import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import path from "path";
import type { WorkspaceManager } from "../../types/WorkspaceManager";
import { getWorkspaceInfos, getWorkspaceInfosAsync } from "../../workspaces/getWorkspaceInfos";
import { getWorkspaceManagerAndRoot } from "../../workspaces/implementations";

describe("getWorkspaceInfos", () => {
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
    { manager: "lerna", desc: "lerna + yarn", fixtureName: "monorepo-lerna-yarn" },
  ])("$desc", ({ manager, fixtureName }) => {
    it.each(["sync", "async"] as const)("gets workspace info (%s)", async (syncAsync) => {
      const getInfo = syncAsync === "sync" ? getWorkspaceInfos : getWorkspaceInfosAsync;

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
