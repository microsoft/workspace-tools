import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import { getWorkspaceManagerRoot } from "../workspaces/getWorkspaceRoot";

describe("getWorkspaceManagerRoot", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("handles yarn workspace", () => {
    const repoRoot = setupFixture("monorepo");
    expect(getWorkspaceManagerRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles pnpm workspace", () => {
    const repoRoot = setupFixture("monorepo-pnpm");
    expect(getWorkspaceManagerRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles rush workspace", () => {
    const repoRoot = setupFixture("monorepo-rush-pnpm");
    expect(getWorkspaceManagerRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles npm workspace", () => {
    const repoRoot = setupFixture("monorepo-npm");
    expect(getWorkspaceManagerRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles lerna workspace", () => {
    const repoRoot = setupFixture("monorepo-lerna-npm");
    expect(getWorkspaceManagerRoot(repoRoot)).toBe(repoRoot);
  });
});
