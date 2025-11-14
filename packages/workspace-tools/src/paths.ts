import path from "path";
import fs from "fs";
import { getWorkspaceManagerRoot } from "./workspaces/getWorkspaceRoot";
import { git } from "./git";
import { logVerboseWarning } from "./logging";

/**
 * Starting from `cwd`, searches up the directory hierarchy for `filePath`.
 * If multiple strings are given, searches each directory level for any of them.
 * @returns Full path to the item found, or undefined if not found.
 */
export function searchUp(filePath: string | string[], cwd: string) {
  const paths = typeof filePath === "string" ? [filePath] : filePath;
  // convert to an absolute path if needed
  cwd = path.resolve(cwd);
  const root = path.parse(cwd).root;

  let foundPath: string | undefined;

  while (!foundPath && cwd !== root) {
    foundPath = paths.find((p) => fs.existsSync(path.join(cwd, p)));
    if (foundPath) {
      break;
    }

    cwd = path.dirname(cwd);
  }

  return foundPath ? path.join(cwd, foundPath) : undefined;
}

/**
 * Starting from `cwd`, uses `git rev-parse --show-toplevel` to find the root of the git repo.
 * Throws if `cwd` is not in a Git repository.
 */
export function findGitRoot(cwd: string) {
  const output = git(["rev-parse", "--show-toplevel"], { cwd });
  if (!output.success) {
    throw new Error(`Directory "${cwd}" is not in a git repository`);
  }

  return path.normalize(output.stdout);
}

/**
 * Starting from `cwd`, searches up the directory hierarchy for `package.json`.
 */
export function findPackageRoot(cwd: string) {
  const jsonPath = searchUp("package.json", cwd);
  return jsonPath && path.dirname(jsonPath);
}

/**
 * Starting from `cwd`, searches up the directory hierarchy for the workspace root,
 * falling back to the git root if no workspace is detected.
 */
export function findProjectRoot(cwd: string) {
  let workspaceRoot: string | undefined;
  try {
    workspaceRoot = getWorkspaceManagerRoot(cwd);
  } catch (err) {
    logVerboseWarning(`Error getting workspace root for ${cwd}`, err);
  }

  if (!workspaceRoot) {
    logVerboseWarning(`Could not find workspace root for ${cwd}. Falling back to git root.`);
  }
  return workspaceRoot || findGitRoot(cwd);
}

/**
 * Determines if `child` path is a subdirectory of `parent` path.
 */
export function isChildOf(child: string, parent: string) {
  const relativePath = path.relative(child, parent);
  return /^[.\/\\]+$/.test(relativePath);
}
