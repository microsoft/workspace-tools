import { getWorkspaceManagerAndRoot } from ".";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import {
  getPackagePathsFromWorkspaceRoot,
  getPackagePathsFromWorkspaceRootAsync,
  getWorkspaceInfoFromWorkspaceRoot,
  getWorkspaceInfoFromWorkspaceRootAsync,
} from "./packageJsonWorkspaces";

/** @deprecated Use `getWorkspaceRoot` */
export function getYarnWorkspaceRoot(cwd: string): string {
  const root = getWorkspaceManagerAndRoot(cwd, undefined, "yarn")?.root;
  if (!root) {
    throw new Error("Could not find yarn workspace root from " + cwd);
  }
  return root;
}

/** Get package paths for a yarn workspace. */
export function getWorkspacePackagePaths(cwd: string): string[] {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return getPackagePathsFromWorkspaceRoot(yarnWorkspacesRoot);
}

/** Get package paths for a yarn workspace. */
export function getWorkspacePackagePathsAsync(cwd: string): Promise<string[]> {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return getPackagePathsFromWorkspaceRootAsync(yarnWorkspacesRoot);
}

/**
 * Get an array with names, paths, and package.json contents for each package in a yarn workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export function getYarnWorkspaces(cwd: string): WorkspaceInfo {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(yarnWorkspacesRoot);
}

/**
 * Get an array with names, paths, and package.json contents for each package in a yarn workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export function getYarnWorkspacesAsync(cwd: string): Promise<WorkspaceInfo> {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRootAsync(yarnWorkspacesRoot);
}

export { getYarnWorkspaces as getWorkspaces };
export { getYarnWorkspacesAsync as getWorkspacesAsync };
