import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import { getDefaultBranch, git } from "../../git/index";

describe("getDefaultBranch()", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("is main or master in the default test repo", () => {
    const cwd = setupFixture(undefined, { git: true });

    const branch = getDefaultBranch(cwd);

    // avoid dependency on git version or other particulars of test environment
    expect(branch).toMatch(/^(main|master)$/);
  });

  it("is myMain when default branch is different", () => {
    const cwd = setupFixture(undefined, { git: true });
    git(["config", "init.defaultBranch", "myMain"], { cwd });

    const branch = getDefaultBranch(cwd);

    expect(branch).toBe("myMain");
  });
});
