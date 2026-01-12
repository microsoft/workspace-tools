import path from "path";
import jju from "jju";
import fs from "fs";

import type { WorkspaceInfos } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo, getWorkspacePackageInfoAsync } from "../getWorkspacePackageInfo";
import { logVerboseWarning } from "../../logging";
import { getWorkspaceManagerAndRoot } from "./getWorkspaceManagerAndRoot";

/** @deprecated Use getWorkspaceRoot */
export function getRushWorkspaceRoot(cwd: string): string {
  const root = getWorkspaceManagerAndRoot(cwd, undefined, "rush")?.root;
  if (!root) {
    throw new Error("Could not find rush root from " + cwd);
  }
  return root;
}

/**
 * Get paths for each package ("workspace") in a rush monorepo.
 * @returns Array of monorepo package paths, or an empty array on error
 */
export function getWorkspacePackagePaths(cwd: string): string[] {
  try {
    const root = getRushWorkspaceRoot(cwd);
    const rushJsonPath = path.join(root, "rush.json");

    const rushConfig: { projects: Array<{ projectFolder: string }> } = jju.parse(
      fs.readFileSync(rushJsonPath, "utf-8")
    );
    return rushConfig.projects.map((project) => path.join(root, project.projectFolder));
  } catch (err) {
    logVerboseWarning(`Error getting rush workspace package paths for ${cwd}`, err);
    return [];
  }
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in a rush monorepo.
 * @returns Array of monorepo package infos, or an empty array on error
 */
export function getRushWorkspaces(cwd: string): WorkspaceInfos {
  try {
    const packagePaths = getWorkspacePackagePaths(cwd);
    return getWorkspacePackageInfo(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting rush workspace package infos for ${cwd}`, err);
    return [];
  }
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in a rush monorepo.
 * @returns Array of monorepo package infos, or an empty array on error
 */
export async function getRushWorkspacesAsync(cwd: string): Promise<WorkspaceInfos> {
  try {
    const packagePaths = getWorkspacePackagePaths(cwd);
    return getWorkspacePackageInfoAsync(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting rush workspace package infos for ${cwd}`, err);
    return [];
  }
}

export { getRushWorkspaces as getWorkspaces };
export { getRushWorkspacesAsync as getWorkspacesAsync };
