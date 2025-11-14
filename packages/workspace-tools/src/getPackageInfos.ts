import { PackageInfos } from "./types/PackageInfo";
import { getWorkspaces, getWorkspacesAsync } from "./workspaces/getWorkspaces";
import { readPackageInfo } from "./workspaces/readPackageInfo";

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
    const rootInfo = readPackageInfo(cwd);
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
    const rootInfo = readPackageInfo(cwd);
    if (rootInfo) {
      packageInfos[rootInfo.name] = rootInfo;
    }
  }

  return packageInfos;
}
