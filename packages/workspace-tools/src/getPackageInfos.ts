import fs from "fs";
import path from "path";
import { PackageInfo, PackageInfos } from "./types/PackageInfo";
import { infoFromPackageJson } from "./infoFromPackageJson";
import { getWorkspaces, getWorkspacesAsync } from "./workspaces/getWorkspaces";

export function getPackageInfos(cwd: string) {
  const packageInfos: PackageInfos = {};
  const workspacePackages = getWorkspaces(cwd);

  if (workspacePackages.length) {
    for (const pkg of workspacePackages) {
      packageInfos[pkg.name] = pkg.packageJson;
    }
  } else {
    const rootInfo = tryReadRootPackageJson(cwd);
    if (rootInfo) {
      packageInfos[rootInfo.name] = rootInfo;
    }
  }

  return packageInfos;
}

export async function getPackageInfosAsync(cwd: string) {
  const packageInfos: PackageInfos = {};
  const workspacePackages = await getWorkspacesAsync(cwd);

  if (workspacePackages.length) {
    for (const pkg of workspacePackages) {
      packageInfos[pkg.name] = pkg.packageJson;
    }
  } else {
    const rootInfo = tryReadRootPackageJson(cwd);
    if (rootInfo) {
      packageInfos[rootInfo.name] = rootInfo;
    }
  }

  return packageInfos;
}

function tryReadRootPackageJson(cwd: string): PackageInfo | undefined {
  const packageJsonPath = path.join(cwd, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      return infoFromPackageJson(packageJson, packageJsonPath);
    } catch (e) {
      throw new Error(`Invalid package.json file detected ${packageJsonPath}: ${(e as Error)?.message || e}`);
    }
  }
}
