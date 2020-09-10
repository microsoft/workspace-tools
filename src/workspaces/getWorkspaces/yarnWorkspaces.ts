import path from "path";
import fs from "fs";
import findWorkspaceRoot from "find-yarn-workspace-root";

import { getPackagePaths } from "../../getPackagePaths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo } from "../getWorkspacePackageInfo";

type PackageJsonWorkspaces = {
  workspaces?:
    | {
        packages?: string[];
        nohoist?: string[];
      }
    | string[];
};

function getYarnWorkspaceRoot(cwd: string): string {
  const yarnWorkspacesRoot = findWorkspaceRoot(cwd);

  if (!yarnWorkspacesRoot) {
    throw new Error("Could not find yarn workspaces root");
  }

  return yarnWorkspacesRoot;
}

function getRootPackageJson(yarnWorkspacesRoot: string) {
  const packageJsonFile = path.join(yarnWorkspacesRoot, "package.json");

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

export function getYarnWorkspaces(cwd: string): WorkspaceInfo {
  try {
    const yarnWorkspacesRoot = getYarnWorkspaceRoot(cwd);
    const rootPackageJson = getRootPackageJson(yarnWorkspacesRoot);
    const packages = getPackages(rootPackageJson);
    const packagePaths = getPackagePaths(yarnWorkspacesRoot, packages);
    const workspaceInfo = getWorkspacePackageInfo(packagePaths);

    return workspaceInfo;
  } catch {
    return [];
  }
}
