import { cleanupFixtures, setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { getYarnWorkspaceRoot } from "../workspaces/implementations/yarn";
import { getPnpmWorkspaceRoot } from "../workspaces/implementations/pnpm";
import { getRushWorkspaceRoot } from "../workspaces/implementations/rush";
import { getNpmWorkspaceRoot } from "../workspaces/implementations/npm";
import { getLernaWorkspaceRoot } from "../workspaces/implementations/lerna";

describe("getWorkspaceRoot", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("handles yarn workspace", () => {
    const repoRoot = setupFixture("monorepo");
    const workspaceRoot = getYarnWorkspaceRoot(repoRoot);

    expect(workspaceRoot).toBe(repoRoot);
  });

  it("handles pnpm workspace", () => {
    const repoRoot = setupFixture("monorepo-pnpm");
    const workspaceRoot = getPnpmWorkspaceRoot(repoRoot);

    expect(workspaceRoot).toBe(repoRoot);
  });

  it("handles rush workspace", () => {
    const repoRoot = setupFixture("monorepo-rush-pnpm");
    const workspaceRoot = getRushWorkspaceRoot(repoRoot);

    expect(workspaceRoot).toBe(repoRoot);
  });

  it("handles npm workspace", () => {
    const repoRoot = setupFixture("monorepo-npm");
    const workspaceRoot = getNpmWorkspaceRoot(repoRoot);

    expect(workspaceRoot).toBe(repoRoot);
  });
});

describe("getLernaWorkspaceRoot()", () => {
  it("gets the root of the workspace", async () => {
    const repoRoot = await setupFixture("monorepo-lerna-npm");
    const workspaceRoot = getLernaWorkspaceRoot(repoRoot);

    expect(workspaceRoot).toBe(repoRoot);
  });
});
