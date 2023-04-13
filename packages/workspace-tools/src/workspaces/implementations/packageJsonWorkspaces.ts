import fs from "fs";
import path from "path";
import { getWorkspaceManagerAndRoot } from ".";
import { getPackagePaths, getPackagePathsAsync } from "../../getPackagePaths";
import { getWorkspacePackageInfo, getWorkspacePackageInfoAsync } from "../getWorkspacePackageInfo";
import { logVerboseWarning } from "../../logging";

type PackageJsonWorkspaces = {
  workspaces?:
    | {
        packages?: string[];
        nohoist?: string[];
      }
    | string[];
};

export function getPackageJsonWorkspaceRoot(cwd: string): string | undefined {
  return getWorkspaceManagerAndRoot(cwd)?.root;
}

function getRootPackageJson(packageJsonWorkspacesRoot: string) {
  const packageJsonFile = path.join(packageJsonWorkspacesRoot, "package.json");

  try {
    return JSON.parse(fs.readFileSync(packageJsonFile, "utf-8"));
  } catch (e) {
    throw new Error("Could not load package.json from workspaces root");
  }
}

function getPackages(packageJson: PackageJsonWorkspaces): string[] {
  const { workspaces } = packageJson;

  if (Array.isArray(workspaces)) {
    return workspaces;
  }

  if (!workspaces?.packages) {
    throw new Error("Could not find a workspaces object in package.json");
  }

  return workspaces.packages;
}

export function getWorkspaceInfoFromWorkspaceRoot(packageJsonWorkspacesRoot: string) {
  try {
    const rootPackageJson = getRootPackageJson(packageJsonWorkspacesRoot);
    const packages = getPackages(rootPackageJson);
    const packagePaths = getPackagePaths(packageJsonWorkspacesRoot, packages);
    return getWorkspacePackageInfo(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting workspace info for ${packageJsonWorkspacesRoot}`, err);
    return [];
  }
}

export async function getWorkspaceInfoFromWorkspaceRootAsync(packageJsonWorkspacesRoot: string) {
  try {
    const rootPackageJson = getRootPackageJson(packageJsonWorkspacesRoot);
    const packages = getPackages(rootPackageJson);
    const packagePaths = await getPackagePathsAsync(packageJsonWorkspacesRoot, packages);
    return getWorkspacePackageInfoAsync(packagePaths);
  } catch (err) {
    logVerboseWarning(`Error getting workspace info for ${packageJsonWorkspacesRoot}`, err);
    return [];
  }
}
