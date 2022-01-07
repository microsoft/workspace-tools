import { getWorkspaceImplementation } from "./implementations";

import { WorkspaceInfo } from "../types/WorkspaceInfo";
import { WorkspaceManager } from "./WorkspaceManager";

const preferred = process.env.PREFERRED_WORKSPACE_MANAGER as WorkspaceManager | null;

export function getWorkspaces(cwd: string): WorkspaceInfo {
  const workspaceImplementation = preferred || getWorkspaceImplementation(cwd);

  if (!workspaceImplementation) {
    return [];
  }

  switch (workspaceImplementation) {
    case "yarn":
      return require(`./implementations/yarn`).getYarnWorkspaces(cwd);

    case "pnpm":
      return require(`./implementations/pnpm`).getPnpmWorkspaces(cwd);

    case "rush":
      return require(`./implementations/rush`).getRushWorkspaces(cwd);

    case "npm":
      return require(`./implementations/npm`).getNpmWorkspaces(cwd);

    case "lerna":
      return require(`./implementations/lerna`).getLernaWorkspaces(cwd);
  }
}
