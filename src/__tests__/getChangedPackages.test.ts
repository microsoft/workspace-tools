import path from "path";
import fs from "fs";

import { setupFixture } from "../helpers/setupFixture";
import { stageAndCommit, git } from "../git";
import { getChangedPackages } from "../workspaces/getChangedPackages";

describe("getChangedPackages()", () => {
  it("can detect changes inside an untracked file", async () => {
    // arrange
    const root = await setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can detect changes inside an unstaged file", async () => {
    // arrange
    const root = await setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/src/index.ts");
    fs.writeFileSync(newFile, "hello foo test");

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can detect changes inside a staged file", async () => {
    // arrange
    const root = await setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["add", newFile], { cwd: root });

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can detect changes inside a file that has been committed in a different branch", async () => {
    // arrange
    const root = await setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["checkout", "-b", "newbranch"], { cwd: root });
    stageAndCommit(["add", newFile], "test commit", root);

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can detect changes inside a file that has been committed in a different branch in nested monorepo", async () => {
    // arrange
    const root = path.join(await setupFixture("monorepo-nested"), "monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["checkout", "-b", "newbranch"], { cwd: root });
    stageAndCommit(["add", newFile], "test commit", root);

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can ignore glob patterns in detecting changes", async () => {
    // arrange
    const root = await setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["add", newFile], { cwd: root });

    // act
    const changedPkgs = getChangedPackages(root, "master", [
      "packages/package-a/*",
    ]);

    // assert
    expect(changedPkgs).toEqual([]);
  });
});
