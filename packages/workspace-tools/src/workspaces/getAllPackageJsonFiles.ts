import { getWorkspacePackages } from "./getWorkspacePackages";

const cache = new Map<string, string[]>();

/**
 * Get paths to every package.json in the workspace, given a cwd
 */
export function getAllPackageJsonFiles(cwd: string): string[] {
  const cached = cache.get(cwd);
  if (cached) {
    return cached;
  }

  const packageJsonFiles = Object.values(getWorkspacePackages(cwd)).map((pkg) => pkg.packageJsonPath);

  cache.set(cwd, packageJsonFiles);

  return packageJsonFiles;
}

export function _resetPackageJsonFilesCache() {
  cache.clear();
}
