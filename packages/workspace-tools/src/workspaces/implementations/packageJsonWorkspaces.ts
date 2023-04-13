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
 * Read the workspace root package.json and get the list of package globs from its `workspaces` property.
 */
function getPackages(packageJsonWorkspacesRoot: string): string[] {
  const packageJsonFile = path.join(packageJsonWorkspacesRoot, "package.json");

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
    throw new Error("Could not find a workspaces object in package.json");
  }

  return workspaces.packages;
}

/**
 * Get an array with names, paths, and package.json contents for each package in an npm/yarn workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export function getWorkspaceInfoFromWorkspaceRoot(packageJsonWorkspacesRoot: string) {
  try {
    const packageGlobs = getPackages(packageJsonWorkspacesRoot);
    const packagePaths = getPackagePaths(packageJsonWorkspacesRoot, packageGlobs);
    return getWorkspacePackageInfo(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting workspace info for ${packageJsonWorkspacesRoot}`, err);
    return [];
  }
}

/**
 * Get an array with names, paths, and package.json contents for each package in an npm/yarn workspace.
 * (See `../getWorkspaces` for why it's named this way.)
 */
export async function getWorkspaceInfoFromWorkspaceRootAsync(packageJsonWorkspacesRoot: string) {
  try {
    const packageGlobs = getPackages(packageJsonWorkspacesRoot);
    const packagePaths = await getPackagePathsAsync(packageJsonWorkspacesRoot, packageGlobs);
    return getWorkspacePackageInfoAsync(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting workspace info for ${packageJsonWorkspacesRoot}`, err);
    return [];
  }
}
