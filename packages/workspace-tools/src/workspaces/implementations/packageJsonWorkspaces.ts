import fs from "fs";
import path from "path";
import { getPackagePaths } from "../../getPackagePaths";
import { PackageJson } from "../../types/PackageInfo";
import { getWorkspacePackageInfo } from "../getWorkspacePackageInfo";

function getRootPackageJson(packageJsonWorkspacesRoot: string) {
  const packageJsonFile = path.join(packageJsonWorkspacesRoot, "package.json");

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, "utf-8"));
    return packageJson;
  } catch (e) {
    throw new Error("Could not load package.json from workspaces root");
  }
}

function getPackages(packageJson: PackageJson): string[] {
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
    const workspaceInfo = getWorkspacePackageInfo(packagePaths);
    return workspaceInfo;
  } catch {
    return [];
  }
}
