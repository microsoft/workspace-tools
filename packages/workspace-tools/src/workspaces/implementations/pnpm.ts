import path from "path";

import { getPackagePaths } from "../../getPackagePaths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo } from "../getWorkspacePackageInfo";
import { readYaml } from "../../lockfile/readYaml";
import { logVerboseWarning } from "../../logging";
import { getWorkspaceManagerAndRoot } from "./getWorkspaceManagerAndRoot";

type PnpmWorkspaceYaml = {
  packages: string[];
};

/** @deprecated Use `getWorkspaceRoot` */
export function getPnpmWorkspaceRoot(cwd: string): string {
  const root = getWorkspaceManagerAndRoot(cwd, undefined, "pnpm")?.root;
  if (!root) {
    throw new Error("Could not find pnpm workspace root from " + cwd);
  }
  return root;
}

/**
 * Get an array with names, paths, and package.json contents for each package in a pnpm workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export function getPnpmWorkspaces(cwd: string): WorkspaceInfo {
  try {
    const pnpmWorkspacesRoot = getPnpmWorkspaceRoot(cwd);
    const pnpmWorkspacesFile = path.join(pnpmWorkspacesRoot, "pnpm-workspace.yaml");

    const pnpmWorkspaces = readYaml(pnpmWorkspacesFile) as PnpmWorkspaceYaml;

    const packagePaths = getPackagePaths(pnpmWorkspacesRoot, pnpmWorkspaces.packages);
    const workspaceInfo = getWorkspacePackageInfo(packagePaths);

    return workspaceInfo;
  } catch (err) {
    logVerboseWarning(`Error getting pnpm workspaces for ${cwd}`, err);
    return [];
  }
}

export { getPnpmWorkspaces as getWorkspaces };
