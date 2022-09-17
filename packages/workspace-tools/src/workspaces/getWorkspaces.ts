import { getWorkspaceRootInfo } from "workspace-tools-paths";
import { WorkspaceInfo } from "../types/WorkspaceInfo";

export function getWorkspaces(cwd: string): WorkspaceInfo {
  const rootInfo = getWorkspaceRootInfo(cwd);

  if (!rootInfo) {
    return [];
  }

  // TODO: update signatures of these functions to take WorkspaceRootInfo to avoid redundant call
  // to search function (it will be cached, but it's still redundant)
  switch (rootInfo.manager) {
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
