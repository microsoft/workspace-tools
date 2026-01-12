import fs from "fs";
import path from "path";
import { getWorkspaceManagerAndRoot } from "./index";
import type { WorkspaceInfos } from "../../types/WorkspaceInfo";
import {
  getPackagePathsFromWorkspaceRoot,
  getPackagePathsFromWorkspaceRootAsync,
  getWorkspaceInfoFromWorkspaceRoot,
  getWorkspaceInfoFromWorkspaceRootAsync,
} from "./packageJsonWorkspaces";
import { getPackageInfo } from "../../getPackageInfo";
import type { Catalog, Catalogs, NamedCatalogs } from "../../types/Catalogs";
import { logVerboseWarning } from "../../logging";
import { readYaml } from "../../lockfile/readYaml";

/** @deprecated Use `getWorkspaceManagerRoot` */
export function getYarnWorkspaceRoot(cwd: string): string {
  const root = getWorkspaceManagerAndRoot(cwd, undefined, "yarn")?.root;
  if (!root) {
    throw new Error("Could not find yarn root from " + cwd);
  }
  return root;
}

/**
 * Get paths for each package ("workspace") in a yarn monorepo.
 * @returns Array of monorepo package paths, or an empty array on error
 */
export function getWorkspacePackagePaths(cwd: string): string[] {
  const root = getYarnWorkspaceRoot(cwd);
  return getPackagePathsFromWorkspaceRoot(root);
}

/**
 * Get paths for each package ("workspace") in a yarn monorepo.
 * @returns Array of monorepo package paths, or an empty array on error
 */
export function getWorkspacePackagePathsAsync(cwd: string): Promise<string[]> {
  const root = getYarnWorkspaceRoot(cwd);
  return getPackagePathsFromWorkspaceRootAsync(root);
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in a yarn monorepo.
 * @returns Array of monorepo package infos, or an empty array on error
 */
export function getYarnWorkspaces(cwd: string): WorkspaceInfos {
  const root = getYarnWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRoot(root);
}

/**
 * Get an array with names, paths, and package.json contents for each package ("workspace")
 * in a yarn monorepo.
 * @returns Array of monorepo package infos, or an empty array on error
 */
export function getYarnWorkspacesAsync(cwd: string): Promise<WorkspaceInfos> {
  const root = getYarnWorkspaceRoot(cwd);
  return getWorkspaceInfoFromWorkspaceRootAsync(root);
}

/**
 * Get version catalogs if present.
 * Returns undefined if there's no catalog, or any issue reading or parsing.
 * @see https://yarnpkg.com/features/catalogs
 */
export function getYarnCatalogs(cwd: string): Catalogs | undefined {
  try {
    const root = getYarnWorkspaceRoot(cwd);
    const yarnrcYmlPath = path.join(root, ".yarnrc.yml");
    if (fs.existsSync(yarnrcYmlPath)) {
      const yarnrcYml = readYaml<{ catalog?: Catalog; catalogs?: NamedCatalogs }>(yarnrcYmlPath);
      if (yarnrcYml?.catalog || yarnrcYml?.catalogs) {
        // Yarn v4+ format
        return { default: yarnrcYml.catalog, named: yarnrcYml.catalogs };
      }
    } else {
      // Check for midgard-yarn-strict definition of catalogs in package.json
      const workspaceSettings = getPackageInfo(root)?.workspaces;
      if (
        workspaceSettings &&
        !Array.isArray(workspaceSettings) &&
        (workspaceSettings?.catalog || workspaceSettings?.catalogs)
      ) {
        // This probably handles a catalog named "default" as the default catalog
        const { default: namedDefaultCatalog, ...namedCatalogs } = workspaceSettings.catalogs || {};
        return {
          default: workspaceSettings.catalog || namedDefaultCatalog,
          named: Object.keys(namedCatalogs).length ? namedCatalogs : undefined,
        };
      }
    }
  } catch (err) {
    logVerboseWarning(`Error getting yarn catalogs for ${cwd}`, err);
    return undefined;
  }
}

export { getYarnWorkspaces as getWorkspaces };
export { getYarnWorkspacesAsync as getWorkspacesAsync };
export { getYarnCatalogs as getCatalogs };
