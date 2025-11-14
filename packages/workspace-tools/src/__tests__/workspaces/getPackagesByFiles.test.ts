import path from "path";
import fs from "fs";

import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import { getPackagesByFiles } from "../../workspaces/getPackagesByFiles";

describe("getPackagesByFiles", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("can find all packages that contain the files in a monorepo", () => {
    const root = setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");

    const packages = getPackagesByFiles(root, ["packages/package-a/footest.txt"]);

    expect(packages).toEqual(["package-a"]);
  });

  it("can find can ignore changes in a glob pattern", () => {
    const root = setupFixture("monorepo");

    const newFileA = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFileA, "hello foo test");

    const newFileB = path.join(root, "packages/package-b/footest.txt");
    fs.writeFileSync(newFileB, "hello foo test");

    const packages = getPackagesByFiles(
      root,
      ["packages/package-a/footest.txt", "packages/package-b/footest.txt"],
      ["packages/package-b/**"]
    );

    expect(packages).toEqual(["package-a"]);
  });

  it("can find can handle empty files", () => {
    const root = setupFixture("monorepo");

    const packages = getPackagesByFiles(root, []);

    expect(packages).toEqual([]);
  });

  it("can find can handle unrelated files", () => {
    const root = setupFixture("monorepo");

    const packages = getPackagesByFiles(root, ["package.json"]);

    expect(packages).toEqual([]);
  });
});
