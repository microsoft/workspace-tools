import fs from "fs";
import jju from "jju";
import path from "path";
import { getPackagePaths } from "../../getPackagePaths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo } from "../getWorkspacePackageInfo";
import { logVerboseWarning } from "../../logging";
import { getWorkspaceManagerAndRoot } from "./getWorkspaceManagerAndRoot";

function getLernaWorkspaceRoot(cwd: string): string {
  const root = getWorkspaceManagerAndRoot(cwd, undefined, "lerna")?.root;
  if (!root) {
    throw new Error("Could not find lerna workspace root from " + cwd);
  }
  return root;
}

/** Get package paths for a lerna workspace. */
export function getWorkspacePackagePaths(cwd: string): string[] {
  try {
    const lernaWorkspaceRoot = getLernaWorkspaceRoot(cwd);
    const lernaJsonPath = path.join(lernaWorkspaceRoot, "lerna.json");
    const lernaConfig = jju.parse(fs.readFileSync(lernaJsonPath, "utf-8"));
    return getPackagePaths(lernaWorkspaceRoot, lernaConfig.packages);
  } catch (err) {
    logVerboseWarning(`Error getting lerna workspace package paths for ${cwd}`, err);
    return [];
  }
}

/**
 * Get an array with names, paths, and package.json contents for each package in a lerna workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export function getLernaWorkspaces(cwd: string): WorkspaceInfo {
  try {
    const packagePaths = getWorkspacePackagePaths(cwd);
    return getWorkspacePackageInfo(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting lerna workspaces for ${cwd}`, err);
    return [];
  }
}

export { getLernaWorkspaces as getWorkspaces };
