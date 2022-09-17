import { cleanupFixtures, setupFixture } from "workspace-tools-scripts/jest/setupFixture";
import { getDefaultBranch, git } from "../git";

describe("getDefaultBranch()", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("is main or master in the default test repo", () => {
    const cwd = setupFixture();

    const branch = getDefaultBranch(cwd);

    // avoid dependency on git version or other particulars of test environment
    expect(branch).toMatch(/^(main|master)$/);
  });

  it("is myMain when default branch is different", () => {
    const cwd = setupFixture();
    git(["config", "init.defaultBranch", "myMain"], { cwd });

    const branch = getDefaultBranch(cwd);

    expect(branch).toBe("myMain");
  });
});
