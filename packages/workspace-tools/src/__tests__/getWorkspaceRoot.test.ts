import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import { getWorkspaceRoot } from "../workspaces/getWorkspaceRoot";

describe("getWorkspaceRoot", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("handles yarn workspace", () => {
    const repoRoot = setupFixture("monorepo");
    expect(getWorkspaceRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles pnpm workspace", () => {
    const repoRoot = setupFixture("monorepo-pnpm");
    expect(getWorkspaceRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles rush workspace", () => {
    const repoRoot = setupFixture("monorepo-rush-pnpm");
    expect(getWorkspaceRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles npm workspace", () => {
    const repoRoot = setupFixture("monorepo-npm");
    expect(getWorkspaceRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles lerna workspace", () => {
    const repoRoot = setupFixture("monorepo-lerna-npm");
    expect(getWorkspaceRoot(repoRoot)).toBe(repoRoot);
  });
});
