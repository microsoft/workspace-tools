import path from "path";
import fs from "fs";
import { getWorkspaceRoot } from "./workspaces/getWorkspaceRoot";
import { git } from "./git";

/**
 * Starting from `cwd`, searches up the directory hierarchy for `pathName`.
 * @param pathName Path to look for
 * @param cwd Directory to start from
 * @param type If specified, look for only files or only directories. Otherwise accept either.
 */
export function searchUp(pathName: string, cwd: string, type?: "file" | "directory") {
  const root = path.parse(cwd).root;

  let found = false;

  while (!found && cwd !== root) {
    const current = path.join(cwd, pathName);
    if (fs.existsSync(current)) {
      const isDir = fs.statSync(current).isDirectory();

      if (!((type === "file" && isDir) || (type === "directory" && !isDir))) {
        found = true;
        break;
      }
    }

    cwd = path.dirname(cwd);
  }

  if (found) {
    return cwd;
  }

  return null;
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
  return searchUp("package.json", cwd);
}

/**
 * Starting from `cwd`, searches up the directory hierarchy for the workspace root,
 * falling back to the git root if no workspace is detected.
 */
export function findProjectRoot(cwd: string) {
  let workspaceRoot: string | undefined;
  try {
    workspaceRoot = getWorkspaceRoot(cwd);
  } catch {}

  return workspaceRoot || findGitRoot(cwd);
}

export function isChildOf(child: string, parent: string) {
  const relativePath = path.relative(child, parent);
  return /^[.\/\\]+$/.test(relativePath);
}
