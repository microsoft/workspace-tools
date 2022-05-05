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

  it("can find can ignore changes in a glob pattern", () => {
    // arrange
    const root = setupFixture("monorepo");

    const newFileA = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFileA, "hello foo test");

    const newFileB = path.join(root, "packages/package-b/footest.txt");
    fs.writeFileSync(newFileB, "hello foo test");

    // act
    const packages = getPackagesByFiles(root, ["packages/package-a/footest.txt", "packages/package-b/footest.txt"], ["packages/package-b/**"]);

    // assert
    expect(packages).toContain("package-a");
    expect(packages).not.toContain("package-b");
  });

  it("can find can handle empty files", () => {
    // arrange
    const root = setupFixture("monorepo");

    // act
    const packages = getPackagesByFiles(root, []);

    // assert
    expect(packages.length).toBe(0);
  });

  it("can find can handle unrelated files", () => {
    // arrange
    const root = setupFixture("monorepo");

    // act
    const packages = getPackagesByFiles(root, ["package.json"]);

    // assert
    expect(packages.length).toBe(0);
  });
});
