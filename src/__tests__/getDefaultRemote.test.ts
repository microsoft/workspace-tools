import { cleanupFixtures, setupFixture, setupLocalRemote } from "../helpers/setupFixture";
import { getDefaultRemote, gitFailFast } from "../git";

describe("getDefaultRemote()", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("is origin in the default test repo", () => {
    // arrange
    const cwd = setupFixture("basic");

    // act
    const remote = getDefaultRemote(cwd);

    // assert
    expect(remote).toBe("origin");
  });


  it("is myMain when default branch is different", () => {
    // arrange
    const cwd = setupFixture("basic");
    setupLocalRemote(cwd, "myRemote", "basic");

    // act
    const remote = getDefaultRemote(cwd);

    // assert
    expect(remote).toBe("myRemote");
  });
});

