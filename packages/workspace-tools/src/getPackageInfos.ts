import fs from "fs";
import path from "path";
import { PackageInfo, PackageInfos } from "./types/PackageInfo";
import { infoFromPackageJson } from "./infoFromPackageJson";
import { getWorkspaces, getWorkspacesAsync } from "./workspaces/getWorkspaces";

/**
 * Read all the package.json files in a monorepo. Only works for monorepos which
 * use a supported workspace manager.
 * @param cwd Start looking for the workspace manager config from here
 */
export function getPackageInfos(cwd: string): PackageInfos {
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

/**
 * Read all the package.json files in a monorepo. Only works for monorepos which
 * use a supported workspace manager.
 *
 * NOTE: As of writing, this will start promises to read all package.json files in parallel,
 * without direct concurrency control.
 *
 * @param cwd Start looking for the workspace manager config from here
 */
export async function getPackageInfosAsync(cwd: string): Promise<PackageInfos> {
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
