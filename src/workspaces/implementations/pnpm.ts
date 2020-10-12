import path from "path";
import findUp from "find-up";
import { sync as readYaml } from "read-yaml-file";

import { getPackagePaths } from "../../getPackagePaths";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { getWorkspacePackageInfo } from "../getWorkspacePackageInfo";

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
    const pnpmWorkspacesFile = path.join(
      pnpmWorkspacesRoot,
      "pnpm-workspace.yaml"
    );
    const pnpmWorkspaces = readYaml<PnpmWorkspaces>(pnpmWorkspacesFile);

    const packagePaths = getPackagePaths(
      pnpmWorkspacesRoot,
      pnpmWorkspaces.packages
    );
    const workspaceInfo = getWorkspacePackageInfo(packagePaths);

    return workspaceInfo;
  } catch {
    return [];
  }
}
