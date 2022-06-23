import path from "path";
import fs from "fs";
import { getWorkspaceRoot } from "./workspaces/getWorkspaceRoot";

/**
 * Starting from `cwd`, searches up the directory hierarchy for `pathName`.
 */
export function searchUp(pathName: string, cwd: string) {
  const root = path.parse(cwd).root;

  let found = false;

  while (!found && cwd !== root) {
    if (fs.existsSync(path.join(cwd, pathName))) {
      found = true;
      break;
    }

    cwd = path.dirname(cwd);
  }

  if (found) {
    return cwd;
  }

  return null;
}

/**
 * Starting from `cwd`, searches up the directory hierarchy for `.git`.
 */
export function findGitRoot(cwd: string) {
  return searchUp(".git", cwd);
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

/**
 * Get the folder containing beachball change files.
 */
export function getChangePath(cwd: string) {
  const gitRoot = findGitRoot(cwd);

  if (gitRoot) {
    return path.join(gitRoot, "change");
  }

  return null;
}

export function isChildOf(child: string, parent: string) {
  const relativePath = path.relative(child, parent);
  return /^[.\/\\]+$/.test(relativePath);
}
