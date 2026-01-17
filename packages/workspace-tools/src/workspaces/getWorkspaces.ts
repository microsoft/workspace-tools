import type { WorkspaceInfos } from "../types/WorkspaceInfo";
import type { WorkspaceManager } from "./WorkspaceManager";
import { getWorkspacePackageInfo, getWorkspacePackageInfoAsync } from "./getWorkspacePackageInfo";
import { logVerboseWarning } from "../logging";
import { getWorkspacePackagePaths, getWorkspacePackagePathsAsync } from "./getWorkspacePackagePaths";

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace" in
 * npm/yarn/pnpm terms) within a monorepo. The list of included packages is based on the
 * workspace/monorepo manager's config file.
 *
 * (Calculation of the workspace manager and root for `cwd` is cached internally.)
 *
 * @param manager Workspace/monorepo manager to use instead of auto-detecting
 *
 * @returns Array of workspace package infos, or undefined if not available
 * (logs verbose warnings instead of throwing on error)
 */
export function getWorkspaces(cwd: string, manager?: WorkspaceManager): WorkspaceInfos | undefined {
  const packagePaths = getWorkspacePackagePaths(cwd, manager);
  if (!packagePaths) return undefined;

  try {
    return getWorkspacePackageInfo(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting ${manager} workspace package infos for ${cwd}`, err);
  }
  return undefined;
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace" in
 * npm/yarn/pnpm terms) within a monorepo. The list of included packages is based on the
 * workspace/monorepo manager's config file.
 *
 * NOTE: As of writing, this will start promises to read all package.json files in parallel,
 * without direct concurrency control.
 *
 * (Calculation of the workspace manager and root for `cwd` is cached internally.)
 *
 * @param manager Workspace/monorepo manager to use instead of auto-detecting
 *
 * @returns Array of workspace package infos, or undefined if not available
 * (logs verbose warnings instead of throwing on error)
 */
export async function getWorkspacesAsync(cwd: string, manager?: WorkspaceManager): Promise<WorkspaceInfos | undefined> {
  const packagePaths = await getWorkspacePackagePathsAsync(cwd, manager);
  if (!packagePaths) return undefined;

  try {
    return getWorkspacePackageInfoAsync(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting ${manager} workspace package infos for ${cwd}`, err);
  }
  return undefined;
}
