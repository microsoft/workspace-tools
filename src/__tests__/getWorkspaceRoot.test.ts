import { setupFixture } from "../helpers/setupFixture";
import { getYarnWorkspaceRoot } from "../workspaces/implementations/yarn";
import { getPnpmWorkspaceRoot } from "../workspaces/implementations/pnpm";
import { getRushWorkspaceRoot } from "../workspaces/implementations/rush";
import { getNpmWorkspaceRoot } from "../workspaces/implementations/npm";
import { getLernaWorkspaceRoot } from "../workspaces/implementations/lerna";

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

describe("getNpmWorkspaceRoot()", () => {
  it("gets the root of the workspace", async () => {
    const repoRoot = await setupFixture("monorepo-npm");
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
