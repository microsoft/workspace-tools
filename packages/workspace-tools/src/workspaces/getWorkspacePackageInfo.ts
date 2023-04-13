import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { WorkspaceInfo } from "../types/WorkspaceInfo";
import { PackageInfo } from "../types/PackageInfo";
import { logVerboseWarning } from "../logging";
import { infoFromPackageJson } from "../infoFromPackageJson";

/**
 * Get an array with names, paths, and package.json contents for each of the given package paths
 * within a workspace.
 *
 * This is an internal helper used by `getWorkspaces` implementations for different managers.
 * (See `../getWorkspaces` for why it's named this way.)
 * @param packagePaths Paths to packages within a workspace
 * @returns Array of workspace package infos
 * @internal
 */
export function getWorkspacePackageInfo(packagePaths: string[]): WorkspaceInfo {
  if (!packagePaths) {
    return [];
  }

  return packagePaths
    .map<WorkspaceInfo[number] | null>((workspacePath) => {
      let packageJson: PackageInfo;
      const packageJsonPath = path.join(workspacePath, "package.json");

      try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as PackageInfo;
      } catch (err) {
        logVerboseWarning(`Error reading or parsing ${packageJsonPath} while getting workspace package info`, err);
        return null;
      }

      return {
        name: packageJson.name,
        path: workspacePath,
        packageJson: infoFromPackageJson(packageJson, packageJsonPath),
      };
    })
    .filter(Boolean) as WorkspaceInfo;
}

/**
 * Get an array with names, paths, and package.json contents for each of the given package paths
 * within a workspace.
 *
 * This is an internal helper used by `getWorkspaces` implementations for different managers.
 * (See `../getWorkspaces` for why it's named this way.)
 * @param packagePaths Paths to packages within a workspace
 * @returns Array of workspace package infos
 * @internal
 */
export async function getWorkspacePackageInfoAsync(packagePaths: string[]): Promise<WorkspaceInfo> {
  if (!packagePaths) {
    return [];
  }

  const workspacePkgPromises = packagePaths.map<Promise<WorkspaceInfo[number] | null>>(async (workspacePath) => {
    const packageJsonPath = path.join(workspacePath, "package.json");

    try {
      const packageJson = JSON.parse(await fsPromises.readFile(packageJsonPath, "utf-8")) as PackageInfo;
      return {
        name: packageJson.name,
        path: workspacePath,
        packageJson: infoFromPackageJson(packageJson, packageJsonPath),
      };
    } catch (err) {
      logVerboseWarning(`Error reading or parsing ${packageJsonPath} while getting workspace package info`, err);
      return null;
    }
  });

  return (await Promise.all(workspacePkgPromises)).filter(Boolean) as WorkspaceInfo;
}
