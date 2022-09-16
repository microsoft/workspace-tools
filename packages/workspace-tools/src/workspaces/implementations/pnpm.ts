import path from "path";
import findUp from "find-up";

import { getPackagePaths } from "../../getPackagePaths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo } from "../getWorkspacePackageInfo";
import { readYaml } from "../../lockfile/readYaml";

type PnpmWorkspaces = {
  packages: string[];
};

export function getPnpmWorkspaceRoot(cwd: string): string {
  const pnpmWorkspacesFile = findUp.sync("pnpm-workspace.yaml", { cwd });

  if (!pnpmWorkspacesFile) {
    throw new Error("Could not find pnpm workspaces root");
  }

  return path.dirname(pnpmWorkspacesFile);
}

export function getPnpmWorkspaces(cwd: string): WorkspaceInfo {
  try {
    const pnpmWorkspacesRoot = getPnpmWorkspaceRoot(cwd);
    const pnpmWorkspacesFile = path.join(pnpmWorkspacesRoot, "pnpm-workspace.yaml");

    const pnpmWorkspaces = readYaml(pnpmWorkspacesFile) as PnpmWorkspaces;

    const packagePaths = getPackagePaths(pnpmWorkspacesRoot, pnpmWorkspaces.packages);
    const workspaceInfo = getWorkspacePackageInfo(packagePaths);

    return workspaceInfo;
  } catch {
    return [];
  }
}
