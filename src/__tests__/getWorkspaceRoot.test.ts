import path from "path";

import { setupFixture } from "../helpers/setupFixture";
import { getYarnWorkspaceRoot } from "../workspaces/implementations/yarn";
import { getPnpmWorkspaceRoot } from "../workspaces/implementations/pnpm";
import { getRushWorkspaceRoot } from "../workspaces/implementations/rush";

describe("getYarnWorkspaceRoot()", () => {
  it("gets the root of the workspace", async () => {
    const repoRoot = await setupFixture("monorepo");
    const workspaceRoot = getYarnWorkspaceRoot(repoRoot);

    expect(workspaceRoot).toBe(repoRoot);
  });
});

describe("getPnpmWorkspaceRoot()", () => {
  it("gets the root of the workspace", async () => {
    const repoRoot = await setupFixture("monorepo-pnpm");
    const workspaceRoot = getPnpmWorkspaceRoot(repoRoot);

    expect(workspaceRoot).toBe(repoRoot);
  });
});

describe("getRushWorkspaceRoot()", () => {
  it("gets the root of the workspace", async () => {
    const repoRoot = await setupFixture("monorepo-rush-pnpm");
    const workspaceRoot = getRushWorkspaceRoot(repoRoot);

    expect(workspaceRoot).toBe(repoRoot);
  });
});
