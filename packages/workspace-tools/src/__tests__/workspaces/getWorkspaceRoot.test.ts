import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import { getWorkspaceManagerRoot } from "../../workspaces/getWorkspaceRoot";

describe("getWorkspaceManagerRoot", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("handles yarn monorepo", () => {
    const repoRoot = setupFixture("monorepo");
    expect(getWorkspaceManagerRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles pnpm monorepo", () => {
    const repoRoot = setupFixture("monorepo-pnpm");
    expect(getWorkspaceManagerRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles rush monorepo", () => {
    const repoRoot = setupFixture("monorepo-rush-pnpm");
    expect(getWorkspaceManagerRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles npm monorepo", () => {
    const repoRoot = setupFixture("monorepo-npm");
    expect(getWorkspaceManagerRoot(repoRoot)).toBe(repoRoot);
  });

  it("handles lerna monorepo", () => {
    const repoRoot = setupFixture("monorepo-lerna-npm");
    expect(getWorkspaceManagerRoot(repoRoot)).toBe(repoRoot);
  });
});
