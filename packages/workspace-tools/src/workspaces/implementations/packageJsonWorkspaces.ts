import fs from "fs";
import path from "path";
import { getPackagePaths, getPackagePathsAsync } from "../../getPackagePaths";
import { getWorkspacePackageInfo, getWorkspacePackageInfoAsync } from "../getWorkspacePackageInfo";
import { logVerboseWarning } from "../../logging";

type PackageJsonWithWorkspaces = {
  workspaces?:
    | {
        packages?: string[];
        nohoist?: string[];
      }
    | string[];
};

/**
 * Read the monorepo root package.json and get the list of package globs from its `workspaces` property.
 */
function getPackages(root: string): string[] {
  const packageJsonFile = path.join(root, "package.json");

  let packageJson: PackageJsonWithWorkspaces;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonFile, "utf-8")) as PackageJsonWithWorkspaces;
  } catch (e) {
    throw new Error("Could not load package.json from workspaces root");
  }

  const { workspaces } = packageJson;

  if (Array.isArray(workspaces)) {
    return workspaces;
  }

  if (!workspaces?.packages) {
    throw new Error("Could not find a workspaces object in package.json (expected if this is not a monorepo)");
  }

  return workspaces.packages;
}

/**
 * Read the `workspaces` property the monorepo root package.json, then process the workspace globs
 * into absolute package paths. Returns an empty array if the `workspaces` property is not found or
 * there's some other issue.
 */
export function getPackagePathsFromWorkspaceRoot(root: string) {
  try {
    const packageGlobs = getPackages(root);
    return packageGlobs ? getPackagePaths(root, packageGlobs) : [];
  } catch (err) {
    logVerboseWarning(`Error getting package paths for ${root}`, err);
    return [];
  }
}

/**
 * Read the `workspaces` property the monorepo root package.json, then process the workspace globs
 * into absolute package paths. Returns an empty array if the `workspaces` property is not found or
 * there's some other issue.
 */
export async function getPackagePathsFromWorkspaceRootAsync(root: string): Promise<string[]> {
  try {
    const packageGlobs = getPackages(root);
    return packageGlobs ? getPackagePathsAsync(root, packageGlobs) : [];
  } catch (err) {
    logVerboseWarning(`Error getting package paths for ${root}`, err);
    return [];
  }
}

/**
 * Read the `workspaces` property the monorepo root package.json, then process the workspace globs
 * into an array with names, paths, and package.json contents for each package (each "workspace"
 * in npm/yarn/pnpm terms). Returns an empty array if there's any issue.
 */
export function getWorkspaceInfoFromWorkspaceRoot(root: string) {
  try {
    const packagePaths = getPackagePathsFromWorkspaceRoot(root);
    return getWorkspacePackageInfo(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting workspace info for ${root}`, err);
    return [];
  }
}

/**
 * Read the `workspaces` property the monorepo root package.json, then process the workspace globs
 * into an array with names, paths, and package.json contents for each package (each "workspace"
 * in npm/yarn/pnpm terms). Returns an empty array if there's any issue.
 *
 * NOTE: As of writing, this will start promises to read all package.json files in parallel,
 * without direct concurrency control.
 */
export async function getWorkspaceInfoFromWorkspaceRootAsync(root: string) {
  try {
    const packagePaths = await getPackagePathsFromWorkspaceRootAsync(root);
    return getWorkspacePackageInfoAsync(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting workspace info for ${root}`, err);
    return [];
  }
}
