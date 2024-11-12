import path from "path";
import fs from "fs-extra";
import tmp from "tmp";
import { spawnSync, SpawnSyncOptions } from "child_process";

// tmp is supposed to be able to clean up automatically, but this doesn't always work within jest.
// So we attempt to use its built-in cleanup mechanisms, but tests should ideally do their own cleanup too.
tmp.setGracefulCleanup();

// Temp directories are created under tempRoot.name with incrementing numeric sub-directories
let tempRoot: tmp.DirResult | undefined;
let tempNumber = 0;

const fixturesRoot = path.join(__dirname, "__fixtures__");

/**
 * Create a git repo in a temp directory, optionally containing the fixture files from `fixtureName`.
 * Be sure to call `cleanupFixtures()` after all tests to clean up temp directories.
 */
export function setupFixture(fixtureName?: string) {
  let fixturePath: string | undefined;
  if (fixtureName) {
    fixturePath = path.join(fixturesRoot, fixtureName);
    if (!fs.existsSync(fixturePath)) {
      throw new Error(`Couldn't find fixture "${fixtureName}" under "${fixturesRoot}"`);
    }
  }

  if (!tempRoot) {
    // Create a shared root temp directory for fixture files
    tempRoot = tmp.dirSync({ unsafeCleanup: true }); // clean up even if files are left
  }

  // Make the directory and git init
  const cwd = path.join(tempRoot.name, String(tempNumber++), fixturePath ? path.basename(fixturePath) : "");

  fs.mkdirpSync(cwd);
  basicGit(["init"], { cwd });
  basicGit(["config", "user.name", "test user"], { cwd });
  basicGit(["config", "user.email", "test@test.email"], { cwd });

  // Ensure GPG signing doesn't interfere with tests
  basicGit(["config", "commit.gpgsign", "false"], { cwd });

  // Make the 'main' branch the default in the test repo
  // ensure that the configuration for this repo does not collide
  // with any global configuration the user had made, so we have
  // a 'fixed' value for our tests, regardless of user configuration
  basicGit(["symbolic-ref", "HEAD", "refs/heads/main"], { cwd });
  basicGit(["config", "init.defaultBranch", "main"], { cwd });

  // Copy and commit the fixture if requested
  if (fixturePath) {
    fs.copySync(fixturePath, cwd, { filter: (src) => !/[/\\](node_modules|temp|.rush)([/\\]|$)/.test(src) });
    basicGit(["add", "."], { cwd });
    basicGit(["commit", "-m", "test"], { cwd });
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

export function setupPackageJson(cwd: string, packageJson: Record<string, any> = {}) {
  const pkgJsonPath = path.join(cwd, "package.json");
  let oldPackageJson: Record<string, any> | undefined;
  if (fs.existsSync(pkgJsonPath)) {
    oldPackageJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
  }
  fs.writeFileSync(pkgJsonPath, JSON.stringify({ ...oldPackageJson, ...packageJson }, null, 2));
}

export function setupLocalRemote(cwd: string, remoteName: string, fixtureName?: string) {
  // Create a separate repo and configure it as a remote
  const remoteCwd = setupFixture(fixtureName);
  const remoteUrl = remoteCwd.replace(/\\/g, "/");
  basicGit(["remote", "add", remoteName, remoteUrl], { cwd });
  basicGit(["config", "pull.rebase", "false"], { cwd });
  basicGit(["pull", "-X", "ours", "origin", "main", "--allow-unrelated-histories"], { cwd });
  // Configure url in package.json
  setupPackageJson(cwd, { repository: { url: remoteUrl, type: "git" } });
}

/**
 * Very basic git wrapper that throws on error.
 * (Can't use the helper methods from `workspace-tools-git` to avoid a circular dependency.)
 */
function basicGit(args: string[], options: { cwd: string } & SpawnSyncOptions) {
  const result = spawnSync("git", args, options);
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed with ${result.status}\n\n${result.stderr.toString()}`);
  }
}
