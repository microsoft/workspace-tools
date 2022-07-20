import path from "path";
import findUp from "find-up";
import fs from "fs-extra";
import tmp from "tmp";
import { init, stageAndCommit, gitFailFast } from "../git";
import { PackageInfo } from "../types/PackageInfo";

// tmp is supposed to be able to clean up automatically, but this doesn't always work within jest.
// So we attempt to use its built-in cleanup mechanisms, but tests should ideally do their own cleanup too.
tmp.setGracefulCleanup();

let fixturesRoot: string | undefined;
// Temp directories are created under tempRoot.name with incrementing numeric sub-directories
let tempRoot: tmp.DirResult | undefined;
let tempNumber = 0;

/**
 * Create a temp directory containing the given fixture name in a git repo.
 * Be sure to call `cleanupFixtures()` after all tests to clean up temp directories.
 */
export function setupFixture(fixtureName?: string) {
  let fixturePath: string | undefined;
  if (fixtureName) {
    if (!fixturesRoot) {
      fixturesRoot = findUp.sync("__fixtures__", { cwd: __dirname, type: "directory" });
    }

    fixturePath = path.join(fixturesRoot!, fixtureName);
    if (!fs.existsSync(fixturePath)) {
      throw new Error(`Couldn't find fixture "${fixtureName}" under "${fixturesRoot}"`);
    }
  }

  if (!tempRoot) {
    // Create a shared root temp directory for fixture files
    tempRoot = tmp.dirSync({ unsafeCleanup: true }); // clean up even if files are left
  }

  // Make the directory and git init
  const cwd = path.join(tempRoot.name, String(tempNumber++), fixtureName || "");

  fs.mkdirpSync(cwd);
  init(cwd, "test@test.email", "test user");

  // Ensure GPG signing doesn't interfere with tests
  gitFailFast(["config", "commit.gpgsign", "false"], { cwd });

  // Make the 'main' branch the default in the test repo
  // ensure that the configuration for this repo does not collide
  // with any global configuration the user had made, so we have
  // a 'fixed' value for our tests, regardless of user configuration
  gitFailFast(["symbolic-ref", "HEAD", "refs/heads/main"], { cwd });
  gitFailFast(["config", "init.defaultBranch", "main"], { cwd });

  // Copy and commit the fixture if requested
  if (fixturePath) {
    fs.copySync(fixturePath, cwd);
    stageAndCommit(["."], "test", cwd);
  }

  return cwd;
}

/**
 * `tmp` is not always reliable about cleanup even with appropriate options, so it's recommended to
 * call this function in `afterAll`.
 */
export function cleanupFixtures() {
  if (tempRoot) {
    tempRoot.removeCallback();
    tempRoot = undefined;
  }
}

export function setupPackageJson(cwd: string, packageJson: Partial<PackageInfo> = {}) {
  const pkgJsonPath = path.join(cwd, "package.json");
  let oldPackageJson: Partial<PackageInfo> | undefined;
  if (fs.existsSync(pkgJsonPath)) {
    oldPackageJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
  }
  fs.writeFileSync(pkgJsonPath, JSON.stringify({ ...oldPackageJson, ...packageJson }, null, 2));
}

export function setupLocalRemote(cwd: string, remoteName: string, fixtureName?: string) {
  // Create a seperate repo and configure it as a remote
  const remoteCwd = setupFixture(fixtureName);
  const remoteUrl = remoteCwd.replace(/\\/g, "/");
  gitFailFast(["remote", "add", remoteName, remoteUrl], { cwd });
  // Configure url in package.json
  setupPackageJson(cwd, { repository: { url: remoteUrl, type: "git" } });
}
