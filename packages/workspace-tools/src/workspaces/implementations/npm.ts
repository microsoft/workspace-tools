import { getWorkspaceManagerAndRoot } from ".";
import type { WorkspaceInfos } from "../../types/WorkspaceInfo";
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

/** Get paths for each package ("workspace") in an npm monorepo. */
export function getWorkspacePackagePaths(cwd: string): string[] {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getPackagePathsFromWorkspaceRoot(npmWorkspacesRoot);
}

/** Get paths for each package ("workspace") in an npm monorepo. */
export function getWorkspacePackagePathsAsync(cwd: string): Promise<string[]> {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getPackagePathsFromWorkspaceRootAsync(npmWorkspacesRoot);
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in an npm monorepo.
 */
export function getNpmWorkspaces(cwd: string): WorkspaceInfos {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(npmWorkspacesRoot);
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in an npm monorepo.
 */
export function getNpmWorkspacesAsync(cwd: string): Promise<WorkspaceInfos> {
  const npmWorkspacesRoot = getNpmWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRootAsync(npmWorkspacesRoot);
}

export { getNpmWorkspaces as getWorkspaces };
export { getNpmWorkspacesAsync as getWorkspacesAsync };
