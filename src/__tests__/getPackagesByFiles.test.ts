import path from "path";
import fs from "fs";

import { cleanupFixtures, setupFixture, setupLocalRemote } from "../helpers/setupFixture";
import { getPackagesByFiles } from "../workspaces/getPackagesByFiles";

describe("getChangedPackages()", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("can find all packages that contain the files in a monorepo", () => {
    // arrange
    const root = setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");

    // act
    const packages = getPackagesByFiles(root, ["packages/package-a/footest.txt"]);

    // assert
    expect(packages).toContain("package-a");
    expect(packages).not.toContain("package-b");
  });
});
