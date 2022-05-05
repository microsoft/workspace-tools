import multimatch from "multimatch";
import path from "path";
import { getWorkspaces } from "./getWorkspaces";

/**
 * Given a list of files, finds all packages names that contain those files
 *
 * @param cwd
 * @param files
 * @param ignoreGlobs
 * @returns package names that have changed
 */
export function getPackagesByFiles(cwd: string, files: string[], ignoreGlobs: string[] = []) {
  const workspaceInfo = getWorkspaces(cwd);
  const ignoreSet = new Set(multimatch(files, ignoreGlobs));

  files = files.filter((change) => !ignoreSet.has(change));

  const packages = new Set<string>();

  for (const change of files) {
    const candidates = workspaceInfo.filter(
      (pkgPath) => change.indexOf(path.relative(cwd, pkgPath.path).replace(/\\/g, "/")) === 0
    );

    if (candidates && candidates.length > 0) {
      const found = candidates.reduce((found, item) => {
        return found.path.length > item.path.length ? found : item;
      }, candidates[0]);
      packages.add(found.name);
    } else {
      return workspaceInfo.map((pkg) => pkg.name);
    }
  }

  return [...packages];
}
