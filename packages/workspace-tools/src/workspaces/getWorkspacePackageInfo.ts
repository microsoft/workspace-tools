import path from "path";
import fsPromises from "fs/promises";
import type { WorkspacePackageInfo, WorkspaceInfos } from "../types/WorkspaceInfo";
import { PackageInfo } from "../types/PackageInfo";
import { logVerboseWarning } from "../logging";
import { infoFromPackageJson } from "../infoFromPackageJson";
import { readPackageInfo } from "./readPackageInfo";

/**
 * Get an array with names, paths, and package.json contents for each of the given package paths
 * ("workspace" paths in npm/yarn/pnpm terms) within a monorepo.
 *
 * This is an internal helper used by `getWorkspaces` implementations for different managers.
 *
 * @param packagePaths Paths to packages within a monorepo
 * @returns Array of workspace package infos
 * @internal
 */
export function getWorkspacePackageInfo(packagePaths: string[]): WorkspaceInfos {
  if (!packagePaths) {
    return [];
  }

  return packagePaths
    .map<WorkspacePackageInfo | null>((workspacePath) => {
      const packageJson = readPackageInfo(workspacePath);
      if (!packageJson) {
        return null; // readPackageInfo already logged a warning
      }

      return {
        name: packageJson.name,
        path: workspacePath,
        packageJson,
      };
    })
    .filter(Boolean) as WorkspaceInfos;
}

/**
 * Get an array with names, paths, and package.json contents for each of the given package paths
 * ("workspace" paths in npm/yarn/pnpm terms) within a monorepo.
 *
 * NOTE: As of writing, this will start promises to read all package.json files in parallel,
 * without direct concurrency control.
 *
 * This is an internal helper used by `getWorkspaces` implementations for different managers.
 *
 * @param packagePaths Paths to packages within a monorepo
 * @returns Array of workspace package infos
 * @internal
 */
export async function getWorkspacePackageInfoAsync(packagePaths: string[]): Promise<WorkspaceInfos> {
  if (!packagePaths) {
    return [];
  }

  const workspacePkgPromises = packagePaths.map<Promise<WorkspacePackageInfo | null>>(async (workspacePath) => {
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

  return (await Promise.all(workspacePkgPromises)).filter(Boolean) as WorkspaceInfos;
}
