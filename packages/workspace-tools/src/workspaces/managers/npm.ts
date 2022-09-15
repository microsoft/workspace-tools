import fs from "fs";
import path from "path";
import { getPackagePaths } from "../../getPackagePaths";
import { PackageInfos, PackageJson } from "../../types/PackageInfo";
import { getPackageInfosFromPaths } from "../getPackageInfosFromPaths";

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

export function getNpmWorkspacePackages(npmWorkspaceRoot: string): PackageInfos {
  try {
    const rootPackageJson = getRootPackageJson(npmWorkspaceRoot);
    const packages = getPackages(rootPackageJson);
    const packagePaths = getPackagePaths(npmWorkspaceRoot, packages);
    return getPackageInfosFromPaths(packagePaths);
  } catch {
    return {};
  }
}
