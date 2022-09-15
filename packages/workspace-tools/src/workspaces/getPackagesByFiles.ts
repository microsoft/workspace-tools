import micromatch from "micromatch";
import path from "path";
import { getWorkspacePackages } from "./getWorkspacePackages";

/**
 * Given a list of files, finds all packages names that contain those files
 *
 * @param workspaceRoot - The root of the workspace
 * @param files - files to search for
 * @param ignoreGlobs - glob patterns to ignore
 * @param returnAllPackagesOnNoMatch - if true, will return all packages if no matches are found
 * @returns package names that have changed
 */
export function getPackagesByFiles(
  workspaceRoot: string,
  files: string[],
  ignoreGlobs: string[] = [],
  returnAllPackagesOnNoMatch: boolean = false
) {
  const workspacePackages = Object.values(getWorkspacePackages(workspaceRoot)).map((pkg) => ({
    name: pkg.name,
    path: path.dirname(pkg.packageJsonPath),
  }));
  const ignoreSet = new Set(micromatch(files, ignoreGlobs));

  files = files.filter((change) => !ignoreSet.has(change));

  const packages = new Set<string>();

  for (const file of files) {
    const candidates = workspacePackages.filter((pkg) =>
      file.startsWith(path.relative(workspaceRoot, pkg.path).replace(/\\/g, "/"))
    );

    if (candidates.length > 0) {
      const found = candidates.reduce((found, item) => {
        return found.path.length > item.path.length ? found : item;
      }, candidates[0]);
      packages.add(found.name);
    } else if (returnAllPackagesOnNoMatch) {
      return workspacePackages.map((pkg) => pkg.name);
    }
  }

  return [...packages];
}
