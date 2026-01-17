import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import { getWorkspaceManagerAndRoot } from "../../workspaces/implementations/getWorkspaceManagerAndRoot";

describe("getWorkspaceManagerAndRoot", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("handles yarn monorepo", () => {
    const repoRoot = setupFixture("monorepo");
    expect(getWorkspaceManagerAndRoot(repoRoot)).toEqual({
      root: repoRoot,
      manager: "yarn",
    });
  });

  it("handles pnpm monorepo", () => {
    const repoRoot = setupFixture("monorepo-pnpm");
    expect(getWorkspaceManagerAndRoot(repoRoot)).toEqual({
      root: repoRoot,
      manager: "pnpm",
    });
  });

  it("handles rush monorepo", () => {
    const repoRoot = setupFixture("monorepo-rush-pnpm");
    expect(getWorkspaceManagerAndRoot(repoRoot)).toEqual({
      root: repoRoot,
      manager: "rush",
    });
  });

  it("handles npm monorepo", () => {
    const repoRoot = setupFixture("monorepo-npm");
    expect(getWorkspaceManagerAndRoot(repoRoot)).toEqual({
      root: repoRoot,
      manager: "npm",
    });
  });

  it("handles lerna monorepo", () => {
    const repoRoot = setupFixture("monorepo-lerna-npm");
    expect(getWorkspaceManagerAndRoot(repoRoot)).toEqual({
      root: repoRoot,
      manager: "lerna",
    });
  });
});
