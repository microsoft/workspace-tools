import { getWorkspaceManagerAndRoot } from ".";
import type { WorkspaceInfos } from "../../types/WorkspaceInfo";
import {
  getWorkspaceInfoFromWorkspaceRoot,
  getWorkspaceInfoFromWorkspaceRootAsync,
  getPackagePathsFromWorkspaceRoot,
  getPackagePathsFromWorkspaceRootAsync,
} from "./packageJsonWorkspaces";

function getNpmRoot(cwd: string): string {
  const root = getWorkspaceManagerAndRoot(cwd, undefined, "npm")?.root;
  if (!root) {
    throw new Error("Could not find npm root from " + cwd);
  }
  return root;
}

/** Get paths for each package ("workspace") in an npm monorepo. */
export function getWorkspacePackagePaths(cwd: string): string[] {
  const root = getNpmRoot(cwd);
  return getPackagePathsFromWorkspaceRoot(root);
}

/** Get paths for each package ("workspace") in an npm monorepo. */
export function getWorkspacePackagePathsAsync(cwd: string): Promise<string[]> {
  const root = getNpmRoot(cwd);
  return getPackagePathsFromWorkspaceRootAsync(root);
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in an npm monorepo.
 */
export function getNpmWorkspaces(cwd: string): WorkspaceInfos {
  const root = getNpmRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(root);
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in an npm monorepo.
 */
export function getNpmWorkspacesAsync(cwd: string): Promise<WorkspaceInfos> {
  const root = getNpmRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRootAsync(root);
}

export { getNpmWorkspaces as getWorkspaces };
export { getNpmWorkspacesAsync as getWorkspacesAsync };
