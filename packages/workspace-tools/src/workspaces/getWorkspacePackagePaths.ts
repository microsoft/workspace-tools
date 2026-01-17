import { getWorkspaceManagerAndRoot, getWorkspaceUtilities } from "./implementations";
import type { WorkspaceManager } from "./WorkspaceManager";

/**
 * Get the original glob patterns from the manager's workspaces config.
 *
 * (Calculation of the workspace manager and root for `cwd` is cached internally.)
 *
 * @param manager Workspace/monorepo manager to use instead of auto-detecting
 *
 * @returns Array of patterns, or undefined if not available
 * (logs verbose warnings instead of throwing on error)
 */
export function getWorkspacePatterns(cwd: string, manager?: WorkspaceManager): string[] | undefined {
  manager ??= getWorkspaceManagerAndRoot(cwd)?.manager;
  return manager && getWorkspaceUtilities(cwd, manager).getWorkspacePatterns(cwd);
}

/**
 * Get a list of package folder paths in the monorepo. The list of included packages is based on
 * the manager's config file and matching package folders (which must contain package.json) on disk.
 *
 * (Calculation of the workspace manager and root for `cwd` is cached internally, but the list of
 * package paths is NOT cached. `getAllPackageJsonFiles` *does* cache the returned list.)
 *
 * @param manager Workspace/monorepo manager to use instead of auto-detecting
 *
 * @returns Package paths, or undefined if there's any issue
 * (logs verbose warnings instead of throwing on error)
 */
export function getWorkspacePackagePaths(cwd: string, manager?: WorkspaceManager): string[] | undefined {
  manager ??= getWorkspaceManagerAndRoot(cwd)?.manager;
  return manager && getWorkspaceUtilities(cwd, manager).getWorkspacePackagePaths(cwd);
}

/**
 * Get a list of package folder paths in the monorepo. The list of included packages is based on
 * the manager's config file and matching package folders (which must contain package.json) on disk.
 *
 * (Calculation of the workspace manager and root for `cwd` is cached internally, but the list of
 * package paths is NOT cached. `getAllPackageJsonFilesAsync` *does* cache the returned list.)
 *
 * @param manager Workspace/monorepo manager to use instead of auto-detecting
 *
 * @returns Package paths, or undefined if there's any issue
 * (logs verbose warnings instead of throwing on error)
 */
export async function getWorkspacePackagePathsAsync(
  cwd: string,
  manager?: WorkspaceManager
): Promise<string[] | undefined> {
  manager ??= getWorkspaceManagerAndRoot(cwd)?.manager;
  return manager && getWorkspaceUtilities(cwd, manager).getWorkspacePackagePathsAsync(cwd);
}
