import path from "path";

import { getPackagePaths } from "../../getPackagePaths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo } from "../getWorkspacePackageInfo";
import { readYaml } from "../../lockfile/readYaml";
import { getWorkspaceRootInfo } from "workspace-tools-paths";

type PnpmWorkspaces = {
  packages: string[];
};

export function getPnpmWorkspaceRoot(cwd: string): string {
  const pnpmWorkspaceRoot = getWorkspaceRootInfo(cwd, "pnpm")?.root;

  if (!pnpmWorkspaceRoot) {
    throw new Error("Could not find pnpm workspaces root");
  }

  return pnpmWorkspaceRoot;
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
