import { getWorkspaceManagerAndRoot } from "./index";
import type { WorkspaceInfos } from "../../types/WorkspaceInfo";
import {
  getPackagePathsFromWorkspaceRoot,
  getPackagePathsFromWorkspaceRootAsync,
  getWorkspaceInfoFromWorkspaceRoot,
  getWorkspaceInfoFromWorkspaceRootAsync,
} from "./packageJsonWorkspaces";

/** @deprecated Use `getWorkspaceManagerRoot` */
export function getYarnWorkspaceRoot(cwd: string): string {
  const root = getWorkspaceManagerAndRoot(cwd, undefined, "yarn")?.root;
  if (!root) {
    throw new Error("Could not find yarn workspace root from " + cwd);
  }
  return root;
}

/** Get paths for each package ("workspace") in a yarn monorepo. */
export function getWorkspacePackagePaths(cwd: string): string[] {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return getPackagePathsFromWorkspaceRoot(yarnWorkspacesRoot);
}

/** Get paths for each package ("workspace") in a yarn monorepo. */
export function getWorkspacePackagePathsAsync(cwd: string): Promise<string[]> {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return getPackagePathsFromWorkspaceRootAsync(yarnWorkspacesRoot);
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in a yarn monorepo.
 */
export function getYarnWorkspaces(cwd: string): WorkspaceInfos {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(yarnWorkspacesRoot);
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in a yarn monorepo.
 */
export function getYarnWorkspacesAsync(cwd: string): Promise<WorkspaceInfos> {
  const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRootAsync(yarnWorkspacesRoot);
}

export { getYarnWorkspaces as getWorkspaces };
export { getYarnWorkspacesAsync as getWorkspacesAsync };
