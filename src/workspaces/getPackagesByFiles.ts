import multimatch from "multimatch";
import path from "path";
import { WorkspaceInfo } from "../types/WorkspaceInfo";
import { getWorkspaces } from "./getWorkspaces";

/**
 * Given a list of files, finds all packages names that contain those files
 *
 * @param workspaceRoot - The root of the workspace
 * @param files - files to search for
 * @param ignoreGlobs - glob patterns to ignore
 * @param workspaceInfo - optional, if not provided, will be fetched from cwd
 * @returns package names that have changed
 */
export function getPackagesByFiles(
  workspaceRoot: string,
  files: string[],
  ignoreGlobs: string[] = [],
  workspaceInfo: WorkspaceInfo = getWorkspaces(workspaceRoot)
) {
  const ignoreSet = new Set(multimatch(files, ignoreGlobs));

  files = files.filter((change) => !ignoreSet.has(change));

  const packages = new Set<string>();

  for (const file of files) {
    const candidates = workspaceInfo.filter(
      (pkgPath) => file.indexOf(path.relative(workspaceRoot, pkgPath.path).replace(/\\/g, "/")) === 0
    );

    if (candidates && candidates.length > 0) {
      const found = candidates.reduce((found, item) => {
        return found.path.length > item.path.length ? found : item;
      }, candidates[0]);
      packages.add(found.name);
    }
  }

  return [...packages];
}
