import { getWorkspaceManagerAndRoot } from ".";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import {
  getWorkspaceInfoFromWorkspaceRoot,
  getWorkspaceInfoFromWorkspaceRootAsync,
  getPackagePathsFromWorkspaceRoot,
  getPackagePathsFromWorkspaceRootAsync,
} from "./packageJsonWorkspaces";

function getNpmWorkspaceRoot(cwd: string): string {
  const root = getWorkspaceManagerAndRoot(cwd, undefined, "npm")?.root;
  if (!root) {
    throw new Error("Could not find npm workspace root from " + cwd);
  }
  return root;
}

/** Get package paths for an npm workspace. */
export function getWorkspacePackagePaths(cwd: string): string[] {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getPackagePathsFromWorkspaceRoot(npmWorkspacesRoot);
}

/** Get package paths for an npm workspace. */
export function getWorkspacePackagePathsAsync(cwd: string): Promise<string[]> {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getPackagePathsFromWorkspaceRootAsync(npmWorkspacesRoot);
}

/**
 * Get an array with names, paths, and package.json contents for each package in an npm workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export function getNpmWorkspaces(cwd: string): WorkspaceInfo {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(npmWorkspacesRoot);
}

/**
 * Get an array with names, paths, and package.json contents for each package in an npm workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export function getNpmWorkspacesAsync(cwd: string): Promise<WorkspaceInfo> {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRootAsync(npmWorkspacesRoot);
}

export { getNpmWorkspaces as getWorkspaces };
export { getNpmWorkspacesAsync as getWorkspacesAsync };
