import path from "path";

import { getPackagePaths } from "../../getPackagePaths";
import type { WorkspaceInfos } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo, getWorkspacePackageInfoAsync } from "../getWorkspacePackageInfo";
import { readYaml } from "../../lockfile/readYaml";
import { logVerboseWarning } from "../../logging";
import { getWorkspaceManagerAndRoot } from "./getWorkspaceManagerAndRoot";
import type { Catalog, Catalogs, NamedCatalogs } from "../../types/Catalogs";

type PnpmWorkspaceYaml = {
  packages: string[];
  // Format per https://pnpm.io/catalogs
  catalog?: Catalog;
  catalogs?: NamedCatalogs;
};

function getPnpmWorkspaceRootAndYaml(cwd: string) {
  const root = getPnpmWorkspaceRoot(cwd);
  const pnpmWorkspacesFile = path.join(root, "pnpm-workspace.yaml");
  return { root, workspaceYaml: readYaml<PnpmWorkspaceYaml>(pnpmWorkspacesFile) };
}

/** @deprecated Use `getWorkspaceManagerRoot` */
export function getPnpmWorkspaceRoot(cwd: string): string {
  const root = getWorkspaceManagerAndRoot(cwd, undefined, "pnpm")?.root;
  if (!root) {
    throw new Error("Could not find pnpm workspace root from " + cwd);
  }
  return root;
}

/** Get paths for each package ("workspace") in a pnpm monorepo. */
export function getWorkspacePackagePaths(cwd: string): string[] {
  try {
    const { root, workspaceYaml } = getPnpmWorkspaceRootAndYaml(cwd);

    return getPackagePaths(root, workspaceYaml.packages);
  } catch (err) {
    logVerboseWarning(`Error getting pnpm workspace package paths for ${cwd}`, err);
    return [];
  }
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in a pnpm monorepo.
 */
export function getPnpmWorkspaces(cwd: string): WorkspaceInfos {
  try {
    const packagePaths = getWorkspacePackagePaths(cwd);
    return getWorkspacePackageInfo(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting pnpm workspaces for ${cwd}`, err);
    return [];
  }
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in a pnpm monorepo.
 */
export async function getPnpmWorkspacesAsync(cwd: string): Promise<WorkspaceInfos> {
  try {
    const packagePaths = getWorkspacePackagePaths(cwd);
    return getWorkspacePackageInfoAsync(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting pnpm workspaces for ${cwd}`, err);
    return [];
  }
}

/**
 * Get version catalogs if present.
 * Returns undefined if there's no catalog, or any issue reading or parsing.
 * @see https://pnpm.io/catalogs
 */
export function getPnpmCatalogs(cwd: string): Catalogs | undefined {
  try {
    const { workspaceYaml } = getPnpmWorkspaceRootAndYaml(cwd);
    if (!workspaceYaml.catalog && !workspaceYaml.catalogs) {
      return undefined;
    }
    return {
      default: workspaceYaml.catalog,
      named: workspaceYaml.catalogs,
    };
  } catch (err) {
    logVerboseWarning(`Error getting pnpm catalogs for ${cwd}`, err);
    return undefined;
  }
}

export { getPnpmWorkspaces as getWorkspaces };
export { getPnpmWorkspacesAsync as getWorkspacesAsync };
export { getPnpmCatalogs as getCatalogs };
