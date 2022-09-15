import path from "path";
import { getPackagePaths } from "../../getPackagePaths";
import { getPackageInfosFromPaths } from "../getPackageInfosFromPaths";
import { PackageInfos } from "../../types/PackageInfo";
import { readYaml } from "../../lockfile/readYaml";

type PnpmWorkspaces = {
  packages: string[];
};

export function getPnpmWorkspacePackages(pnpmWorkspacesRoot: string): PackageInfos {
  try {
    const pnpmWorkspacesFile = path.join(pnpmWorkspacesRoot, "pnpm-workspace.yaml");

    // DO NOT move to top of file (slows down parsing)
    const pnpmWorkspaces = readYaml<PnpmWorkspaces>(pnpmWorkspacesFile);

    const packagePaths = getPackagePaths(pnpmWorkspacesRoot, pnpmWorkspaces.packages);
    return getPackageInfosFromPaths(packagePaths);
  } catch {
    return {};
  }
}
