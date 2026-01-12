import fs from "fs";
import jju from "jju";
import path from "path";
import { getPackagePaths } from "../../getPackagePaths";
import type { WorkspaceInfos } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo, getWorkspacePackageInfoAsync } from "../getWorkspacePackageInfo";
import { logVerboseWarning } from "../../logging";
import { getWorkspaceManagerAndRoot } from "./getWorkspaceManagerAndRoot";

function getLernaRoot(cwd: string): string {
  const root = getWorkspaceManagerAndRoot(cwd, undefined, "lerna")?.root;
  if (!root) {
    throw new Error("Could not find lerna root from " + cwd);
  }
  return root;
}

/**
 * Get paths for each package ("workspace") in a lerna monorepo.
 * @returns Array of monorepo package paths, or an empty array on error
 */
export function getWorkspacePackagePaths(cwd: string): string[] {
  try {
    const root = getLernaRoot(cwd);
    const lernaJsonPath = path.join(root, "lerna.json");
    const lernaConfig = jju.parse(fs.readFileSync(lernaJsonPath, "utf-8"));
    return getPackagePaths(root, lernaConfig.packages);
  } catch (err) {
    logVerboseWarning(`Error getting lerna workspace package paths for ${cwd}`, err);
    return [];
  }
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in a lerna monorepo.
 * @returns Array of monorepo package infos, or an empty array on error
 */
export function getLernaWorkspaces(cwd: string): WorkspaceInfos {
  try {
    const packagePaths = getWorkspacePackagePaths(cwd);
    return getWorkspacePackageInfo(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting lerna workspace package infos for ${cwd}`, err);
    return [];
  }
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in a lerna monorepo.
 * @returns Array of monorepo package infos, or an empty array on error
 */
export async function getLernaWorkspacesAsync(cwd: string): Promise<WorkspaceInfos> {
  try {
    const packagePaths = getWorkspacePackagePaths(cwd);
    return getWorkspacePackageInfoAsync(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting lerna workspace package infos for ${cwd}`, err);
    return [];
  }
}

export { getLernaWorkspaces as getWorkspaces };
export { getLernaWorkspacesAsync as getWorkspacesAsync };
