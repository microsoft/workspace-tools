import { getWorkspaceManagerAndRoot, getWorkspaceUtilities } from "./implementations";

/**
 * Get a list of package folder paths in the monorepo. The list of included packages is based on
 * the manager's config file and matching package folders (which must contain package.json) on disk.
 */
export function getWorkspacePackagePaths(cwd: string): string[] {
  const utils = getWorkspaceUtilities(cwd);
  return utils?.getWorkspacePackagePaths(cwd) || [];
}

/**
 * Get a list of package folder paths in the monorepo. The list of included packages is based on
 * the manager's config file and matching package folders (which must contain package.json) on disk.
 */
export async function getWorkspacePackagePathsAsync(cwd: string): Promise<string[]> {
  const utils = getWorkspaceUtilities(cwd);

  if (!utils) {
    return [];
  }

  if (!utils.getWorkspacePackagePathsAsync) {
    const managerName = getWorkspaceManagerAndRoot(cwd)?.manager;
    throw new Error(`${cwd} is using ${managerName} which has not been converted to async yet`);
  }

  return utils.getWorkspacePackagePathsAsync(cwd);
}
