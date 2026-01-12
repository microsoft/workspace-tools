import path from "path";
import { getWorkspacePackagePaths, getWorkspacePackagePathsAsync } from "./getWorkspacePackagePaths";
import { isCachingEnabled } from "../isCachingEnabled";

const cache = new Map<string, string[]>();

/**
 * Get paths to every package.json in the monorepo, given a cwd.
 */
export function getAllPackageJsonFiles(cwd: string): string[] {
  if (isCachingEnabled() && cache.has(cwd)) {
    return cache.get(cwd)!;
  }

  const packageJsonFiles = getWorkspacePackagePaths(cwd).map((packagePath) => path.join(packagePath, "package.json"));

  cache.set(cwd, packageJsonFiles);

  return packageJsonFiles;
}

export function _resetPackageJsonFilesCache() {
  cache.clear();
}

/**
 * Get paths to every package.json in the monorepo, given a cwd.
 */
export async function getAllPackageJsonFilesAsync(cwd: string): Promise<string[]> {
  if (isCachingEnabled() && cache.has(cwd)) {
    return cache.get(cwd)!;
  }

  const packageJsonFiles = (await getWorkspacePackagePathsAsync(cwd)).map((packagePath) =>
    path.join(packagePath, "package.json")
  );

  cache.set(cwd, packageJsonFiles);

  return packageJsonFiles;
}
