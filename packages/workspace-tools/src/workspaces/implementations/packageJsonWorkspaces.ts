import fs from "fs";
import path from "path";
import { getWorkspaceImplementationAndLockFile } from ".";
import { getPackagePaths, getPackagePathsAsync } from "../../getPackagePaths";
import { getWorkspacePackageInfo, getWorkspacePackageInfoAsync } from "../getWorkspacePackageInfo";

type PackageJsonWorkspaces = {
  workspaces?:
    | {
        packages?: string[];
        nohoist?: string[];
      }
    | string[];
};

export function getPackageJsonWorkspaceRoot(cwd: string): string | null {
  const lockFile = getWorkspaceImplementationAndLockFile(cwd)?.lockFile;
  const packageJsonWorkspacesRoot = lockFile ? path.dirname(lockFile) : cwd;
  return packageJsonWorkspacesRoot;
}

function getRootPackageJson(packageJsonWorkspacesRoot: string) {
  const packageJsonFile = path.join(packageJsonWorkspacesRoot, "package.json");

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, "utf-8"));
    return packageJson;
  } catch (e) {
    throw new Error("Could not load package.json from workspaces root");
  }
}

function getPackages(packageJson: PackageJsonWorkspaces): string[] {
  const { workspaces } = packageJson;

  if (workspaces && Array.isArray(workspaces)) {
    return workspaces;
  }

  if (!workspaces || !workspaces.packages) {
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
  } catch {
    return [];
  }
}

export async function getWorkspaceInfoFromWorkspaceRootAsync(packageJsonWorkspacesRoot: string) {
  try {
    const rootPackageJson = getRootPackageJson(packageJsonWorkspacesRoot);
    const packages = getPackages(rootPackageJson);
    const packagePaths = await getPackagePathsAsync(packageJsonWorkspacesRoot, packages);
    return getWorkspacePackageInfoAsync(packagePaths);
  } catch {
    return [];
  }
}
