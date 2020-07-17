import findUp from "find-up";

import { getPnpmWorkspaces } from "./pnpmWorkspaces";
import { getYarnWorkspaces } from "./yarnWorkspaces";
import { getRushWorkspaces } from "./rushWorkspaces";
import { WorkspaceInfo } from "../../types/WorkspaceInfo";
import { WorkspaceManager } from "../WorkspaceManager";

const workspaceGetter = {
  yarn: getYarnWorkspaces,
  pnpm: getPnpmWorkspaces,
  rush: getRushWorkspaces,
};

const preferred = process.env
  .PREFERRED_WORKSPACE_MANAGER as WorkspaceManager | null;

export function getWorkspaces(cwd: string): WorkspaceInfo {
  if (preferred) {
    return workspaceGetter[preferred](cwd);
  }

  const yarnLockPath = findUp.sync("yarn.lock", { cwd });
  if (yarnLockPath) {
    return getYarnWorkspaces(cwd);
  }

  const pnpmLockPath = findUp.sync("pnpm-workspace.yaml", { cwd });
  if (pnpmLockPath) {
    return getPnpmWorkspaces(cwd);
  }

  const rushJsonPath = findUp.sync("rush.json", { cwd });
  if (rushJsonPath) {
    return getRushWorkspaces(cwd);
  }

  return [];
}
