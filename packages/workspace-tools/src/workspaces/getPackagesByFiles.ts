import micromatch from "micromatch";
import path from "path";
import { getWorkspaces } from "./getWorkspaces";

/**
 * Given a list of files, finds all packages names that contain those files
 *
 * @param workspaceRoot - The root of the workspace
 * @param files - files to search for
 * @param ignoreGlobs - glob patterns to ignore
 * @param returnAllPackagesOnNoMatch - if true, will return all packages if no matches are found for any file
 * @returns package names that have changed
 */
export function getPackagesByFiles(
  workspaceRoot: string,
  files: string[],
  ignoreGlobs: string[] = [],
  returnAllPackagesOnNoMatch: boolean = false
) {
  const workspaceInfo = getWorkspaces(workspaceRoot);
  const ignoreSet = new Set(micromatch(files, ignoreGlobs));

  files = files.filter((change) => !ignoreSet.has(change));

  const packages = new Set<string>();

  for (const file of files) {
    const candidates = workspaceInfo.filter(
      (pkgPath) => file.indexOf(path.relative(workspaceRoot, pkgPath.path).replace(/\\/g, "/")) === 0
    );

    if (candidates.length) {
      const found = candidates.reduce((found, item) => {
        return found.path.length > item.path.length ? found : item;
      }, candidates[0]);
      packages.add(found.name);
    } else if (returnAllPackagesOnNoMatch) {
      return workspaceInfo.map((pkg) => pkg.name);
    }
  }

  return [...packages];
}
