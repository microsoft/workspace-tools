import { cleanupFixtures, setupFixture } from "../helpers/setupFixture";
import { getYarnWorkspaceRoot } from "../workspaces/implementations/yarn";
import { getPnpmWorkspaceRoot } from "../workspaces/implementations/pnpm";
import { getRushWorkspaceRoot } from "../workspaces/implementations/rush";
import { getNpmWorkspaceRoot } from "../workspaces/implementations/npm";

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
