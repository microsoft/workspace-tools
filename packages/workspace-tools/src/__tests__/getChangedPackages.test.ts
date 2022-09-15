import path from "path";
import fs from "fs";

import { cleanupFixtures, setupFixture, setupLocalRemote } from "workspace-tools-scripts/jest/setupFixture";
import { stageAndCommit, git } from "workspace-tools-git";
import { getChangedPackages, getChangedPackagesBetweenRefs } from "../workspaces/getChangedPackages";

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
    const changedPkgs = getChangedPackages(root, "main");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can detect changes inside an untracked file in a nested monorepo", () => {
    // arrange
    const root = path.join(setupFixture("monorepo-nested"), "monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");

    // act
    const changedPkgs = getChangedPackages(root, "main");

    // assert
    expect(changedPkgs).toEqual(["package-a"]);
  });

  it("can detect changes when multiple files are changed", () => {
    // arrange
    const root = path.join(setupFixture("monorepo-nested"), "monorepo");

    const readmeFile = path.join(root, "README.md");
    const lageFile = path.join(root, "lage.config.json");
    fs.writeFileSync(readmeFile, "hello foo test");
    fs.writeFileSync(lageFile, "hello foo test");

    // act
    const changedPkgs = getChangedPackages(root, "main");

    // assert
    expect(changedPkgs).toEqual(["package-a", "package-b"]);
  });

  it("can ignore changes when multiple files are changed", () => {
    // arrange
    const root = path.join(setupFixture("monorepo-nested"), "monorepo");

    const readmeFile = path.join(root, "README.md");
    const lageFile = path.join(root, "lage.config.json");
    fs.writeFileSync(readmeFile, "hello foo test");
    fs.writeFileSync(lageFile, "hello foo test");

    const ignoreGlobs = ["lage.config.json", "README.md"];

    // act
    const changedPkgs = getChangedPackages(root, "main", ignoreGlobs);

    // assert
    expect(changedPkgs).toEqual([]);
  });

  it("can detect changes inside an unstaged file", () => {
    // arrange
    const root = setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/index.ts");
    fs.writeFileSync(newFile, "hello foo test");

    // act
    const changedPkgs = getChangedPackages(root, "main");

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can detect changes inside an unstaged file in a nested monorepo", () => {
    // arrange
    const root = path.join(setupFixture("monorepo-nested"), "monorepo");

    const newFile = path.join(root, "packages/package-a/index.ts");
    fs.writeFileSync(newFile, "hello foo test");

    // act
    const changedPkgs = getChangedPackages(root, "main");

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
    const changedPkgs = getChangedPackages(root, "main");

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
    const changedPkgs = getChangedPackages(root, "main");

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
    const changedPkgs = getChangedPackages(root, "main");

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
    const changedPkgs = getChangedPackages(root, "main");

    // assert
    expect(changedPkgs).toEqual(["package-a"]);
  });

  it("can detect changes inside a file that has been committed in a different branch using default remote", () => {
    // arrange
    const root = setupFixture("monorepo");
    setupLocalRemote(root, "origin", "basic");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["checkout", "-b", "newbranch"], { cwd: root });
    stageAndCommit(["add", newFile], "test commit", root);

    // act
    const changedPkgs = getChangedPackages(root, undefined);

    // assert
    expect(changedPkgs).toContain("package-a");
  });

  it("can ignore glob patterns in detecting changes", () => {
    // arrange
    const root = setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["add", newFile], { cwd: root });

    // act
    const changedPkgs = getChangedPackages(root, "main", ["packages/package-a/*"]);

    // assert
    expect(changedPkgs).toEqual([]);
  });

  it("can detect changed packages between two refs", () => {
    // arrange
    const root = setupFixture("monorepo");

    const newFile = path.join(root, "packages/package-a/footest.txt");
    fs.writeFileSync(newFile, "hello foo test");
    git(["add", newFile], { cwd: root });
    stageAndCommit(["packages/package-a/footest.txt"], "test commit in a", root);

    const newFile2 = path.join(root, "packages/package-b/footest2.txt");
    fs.writeFileSync(newFile2, "hello foo test");
    git(["add", newFile2], { cwd: root });
    stageAndCommit(["packages/package-b/footest2.txt"], "test commit in b", root);

    // act
    const changedPkgs = getChangedPackagesBetweenRefs(root, "HEAD^1", "HEAD");

    // assert
    expect(changedPkgs).toContain("package-b");
    expect(changedPkgs).not.toContain("package-a");
  });
});
