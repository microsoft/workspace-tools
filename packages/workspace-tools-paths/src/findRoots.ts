import path from "path";
import { spawnSync } from "child_process";
import { searchUp } from "./searchUp";
import { getWorkspaceRootInfo } from "./getWorkspaceRootInfo";

/**
 * Starting from `cwd`, uses `git rev-parse --show-toplevel` to find the root of the git repo.
 * Throws if `cwd` is not in a Git repository.
 */
export function findGitRoot(cwd: string): string {
  const result = spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd });

  if (result.status !== 0) {
    throw new Error(`Directory "${cwd}" is not in a git repository`);
  }

  return path.normalize(result.stdout.toString().trim());
}

/**
 * Starting from `cwd`, searches up the directory hierarchy for `package.json`.
 * @returns The package root, or undefined if no `package.json` is found.
 */
export function findPackageRoot(cwd: string): string | undefined {
  const packageJsonPath = searchUp("package.json", cwd);
  return packageJsonPath ? path.dirname(packageJsonPath) : undefined;
}

/**
 * Starting from `cwd`, searches up the directory hierarchy for a workspace root.
 * Respects `process.env.PREFERRED_WORKSPACE_MANAGER` if set.
 */
export function findWorkspaceRoot(cwd: string): string | undefined {
  return getWorkspaceRootInfo(cwd)?.root;
}

/** @deprecated Use `findWorkspaceRoot` (renamed for consistency) */
export function getWorkspaceRoot(cwd: string): string | undefined {
  return findWorkspaceRoot(cwd);
}

/**
 * Starting from `cwd`, searches up the directory hierarchy for the workspace root,
 * falling back to the git root if no workspace is detected.
 */
export function findProjectRoot(cwd: string): string | undefined {
  let workspaceRoot: string | undefined;
  try {
    workspaceRoot = findWorkspaceRoot(cwd);
  } catch {}

  return workspaceRoot || findGitRoot(cwd);
}
