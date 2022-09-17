import { cleanupFixtures, setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { getWorkspaceRootInfo } from "../getWorkspaceRootInfo";

describe("getWorkspaceRootInfo", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("handles yarn workspace", () => {
    const repoRoot = setupFixture({ fixtureName: "monorepo", skipGit: true });
    const workspaceRoot = getWorkspaceRootInfo(repoRoot);

    expect(workspaceRoot).toEqual({ root: repoRoot, manager: "yarn" });
  });

  it("handles pnpm workspace", () => {
    const repoRoot = setupFixture({ fixtureName: "monorepo-pnpm", skipGit: true });
    const workspaceRoot = getWorkspaceRootInfo(repoRoot);

    expect(workspaceRoot).toEqual({ root: repoRoot, manager: "pnpm" });
  });

  it("handles rush workspace", () => {
    const repoRoot = setupFixture({ fixtureName: "monorepo-rush-pnpm", skipGit: true });
    const workspaceRoot = getWorkspaceRootInfo(repoRoot);

    expect(workspaceRoot).toEqual({ root: repoRoot, manager: "rush" });
  });

  it("handles npm workspace", () => {
    const repoRoot = setupFixture({ fixtureName: "monorepo-npm", skipGit: true });
    const workspaceRoot = getWorkspaceRootInfo(repoRoot);

    expect(workspaceRoot).toEqual({ root: repoRoot, manager: "npm" });
  });

  it("handles lerna workspace", () => {
    const repoRoot = setupFixture({ fixtureName: "monorepo-lerna-npm", skipGit: true });
    const workspaceRoot = getWorkspaceRootInfo(repoRoot);

    expect(workspaceRoot).toEqual({ root: repoRoot, manager: "lerna" });
  });
});
