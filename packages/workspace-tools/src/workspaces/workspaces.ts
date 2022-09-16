import { getWorkspaces } from "./getWorkspaces";

const cache = new Map<string, string[]>();

/**
 * Get paths to every package.json in the workspace, given a cwd
 * @param cwd
 */
export function getAllPackageJsonFiles(cwd: string) {
  if (cache.has(cwd)) {
    return cache.get(cwd);
  }

  const workspaces = getWorkspaces(cwd);
  const packageJsonFiles = workspaces.map((workspace) => workspace.packageJson.packageJsonPath);

  cache.set(cwd, packageJsonFiles);

  return packageJsonFiles;
}

export function _resetCache() {
  cache.clear();
}
