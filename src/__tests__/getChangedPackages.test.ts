import path from "path";
import fs from "fs";

import { cleanupFixtures, setupFixture } from "../helpers/setupFixture";
import { stageAndCommit, git } from "../git";
import { getChangedPackages } from "../workspaces/getChangedPackages";

describe("getChangedPackages()", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  it("can detect changes inside an untracked file", () => {
    // arrange
    const root = setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can detect changes inside an untracked file in a nested monorepo", () => {
    // arrange
    const root = path.join(setupFixture("monorepo-nested"), "monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toEqual(["package-a"]);
  });

  it("can detect changes inside an unstaged file", () => {
    // arrange
    const root = setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/src/index.ts");
    fs.writeFileSync(newFile, "hello foo test");

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can detect changes inside an unstaged file in a nested monorepo", () => {
    // arrange
    const root = path.join(setupFixture("monorepo-nested"), "monorepo");

    const newFile = path.join(root, "packages/package-a/src/index.ts");
    fs.writeFileSync(newFile, "hello foo test");

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toEqual(["package-a"]);
  });

  it("can detect changes inside a staged file", () => {
    // arrange
    const root = setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["add", newFile], { cwd: root });

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can detect changes inside a staged file in a nested monorepo", () => {
    // arrange
    const root = path.join(setupFixture("monorepo-nested"), "monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["add", newFile], { cwd: root });

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toEqual(["package-a"]);
  });

  it("can detect changes inside a file that has been committed in a different branch", () => {
    // arrange
    const root = setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["checkout", "-b", "newbranch"], { cwd: root });
    stageAndCommit(["add", newFile], "test commit", root);

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can detect changes inside a file that has been committed in a different branch in a nested monorepo", () => {
    // arrange
    const root = path.join(setupFixture("monorepo-nested"), "monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["checkout", "-b", "newbranch"], { cwd: root });
    stageAndCommit(["add", newFile], "test commit", root);

    // act
    const changedPkgs = getChangedPackages(root, "master");

    // assert
    expect(changedPkgs).toEqual(["package-a"]);
  });

  it("can ignore glob patterns in detecting changes", () => {
    // arrange
    const root = setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["add", newFile], { cwd: root });

    // act
    const changedPkgs = getChangedPackages(root, "master", ["packages/package-a/*"]);

    // assert
    expect(changedPkgs).toEqual([]);
  });
});
