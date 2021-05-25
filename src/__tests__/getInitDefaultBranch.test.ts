import path from "path";
import fs from "fs";

import { cleanupFixtures, setupFixture } from "../helpers/setupFixture";
import { getDefaultBranch, git } from "../git";

describe("getDefaultBranch()", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("is main in the default test repo", () => {
    // arrange
    const cwd = setupFixture("basic");

    // act
    const branch = getDefaultBranch(cwd);

    // assert
    expect(branch).toBe("main");
  });


  it("is myMain when default branch is different", () => {
    // arrange
    const cwd = setupFixture("basic");
    git(['config', 'init.defaultBranch', 'myMain'], {cwd} );

    // act
    const branch = getDefaultBranch(cwd);

    // assert
    expect(branch).toBe("myMain");
  });
});

